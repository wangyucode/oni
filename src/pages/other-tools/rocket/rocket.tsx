import { useContext, useMemo, useState } from 'react';
import { Picker, View, Text, AdCustom } from '@tarojs/components';
import { InputNumber, Radio, RadioGroup } from '@nutui/nutui-react-taro';
import BackButton from '@/components/ui/BackButton';
import FilteredImage from '@/components/ui/FilteredImage';
import GlobalSvgFilters from '@/components/ui/GlobalSvgFilters';
import { DataContext } from '@/contexts/DataContext';
import { getIconData } from '@/utils/utils';
import './rocket.scss';

type EngineType = '蒸汽引擎' | '石油引擎' | '液氢引擎';
type OxidizerType = '氧石' | '液氧';

type ModuleState = {
  researchModule: number;
  sightSeeingModule: number;
  cargoBay: number;
  liquidCargoBay: number;
  biologicalCargoBay: number;
  gasCargoCanister: number;
};

type SteamResult = {
  kind: 'steam';
  fuel: number;
  thrusters: number;
};

type LiquidResult = {
  kind: 'liquid';
  fuelType: '石油' | '液态氢';
  fuelAmount: number;
  oxidizer: OxidizerType;
  fuelTanks: number;
  oxidizerTanks: number;
};

type RocketResult = {
  error: boolean;
  solution: SteamResult | LiquidResult | null;
};

const ENGINE_FUEL_DISTANCE: Record<EngineType, number> = {
  蒸汽引擎: 20,
  石油引擎: 40,
  液氢引擎: 60,
};

const OXIDIZER_MULTIPLIER: Record<OxidizerType, number> = {
  氧石: 1,
  液氧: 4 / 3,
};

const MODULE_MASS = {
  蒸汽引擎: 2000,
  石油引擎: 200,
  液氢引擎: 500,
  指挥舱: 200,
  研究舱: 200,
  货舱: 2000,
  液缸货舱: 1000,
  观光舱: 200,
  固体燃料推进器: 1000,
  生物货舱: 1000,
  气罐货舱: 1000,
  固体氧化剂舱: 100,
  液体氧化剂舱: 100,
  液缸燃料舱: 100,
};

const CAPACITY = {
  蒸汽引擎: 900,
  固体氧化剂舱: 2700,
  液体氧化剂舱: 2700,
  液缸燃料舱: 900,
};

const ICON_BASE_URL = 'https://wycode.cn/upload/oni/v3/images/';

const ROCKET_ICON_FILES: Record<string, string> = {
  蒸汽引擎: 'rocket_cluster_steam_engine_0__ui.png',
  石油引擎: 'rocket_cluster_petroleum_engine_0__ui.png',
  液氢引擎: 'rocket_cluster_hydrogen_engine_0__ui.png',
  氧石: 'rocket_oxidizer_tank_small_0__ui.png',
  液氧: 'rocket_cluster_oxidizer_tank_liquid_0__ui.png',
  指挥舱: 'rocket_nosecone_default_0__ui.png',
  研究舱: 'rocket_research_module_small_0__ui.png',
  货舱: 'rocket_storage_solid_small_0__ui.png',
  液缸货舱: 'rocket_storage_liquid_small_0__ui.png',
  观光舱: 'rocket_habitat_medium_module_0__ui.png',
  生物货舱: 'rocket_storage_live_small_0__ui.png',
  气罐货舱: 'rocket_storage_gas_small_0__ui.png',
  固体燃料推进器: 'rocket_sugar_engine_0__ui.png',
  固体氧化剂舱: 'rocket_oxidizer_tank_small_0__ui.png',
  液缸燃料舱: 'rocket_cluster_liquid_fuel_tank_0__ui.png',
  液体氧化剂舱: 'rocket_cluster_oxidizer_tank_liquid_0__ui.png',
  蒸汽: 'rocket_cluster_steam_engine_0__ui.png',
  石油: 'rocket_cluster_petroleum_engine_0__ui.png',
  液态氢: 'rocket_cluster_hydrogen_engine_0__ui.png',
};

const DISTANCE_OPTIONS = Array.from({ length: 20 }, (_, i) => (i + 1) * 10000);

function toInt(value: string | number) {
  const next = Number(value);
  if (!Number.isFinite(next)) return 0;
  return Math.max(0, Math.round(next));
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return '0';
  const fixed = value.toFixed(2);
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
}

function calculateRocket(
  engine: EngineType,
  oxidizer: OxidizerType,
  distance: number,
  modules: ModuleState
): RocketResult {
  let baseMass = MODULE_MASS[engine] + MODULE_MASS.指挥舱;
  const oxidizerTankModule = oxidizer === '液氧' ? '液体氧化剂舱' : '固体氧化剂舱';
  baseMass += modules.researchModule * MODULE_MASS.研究舱;
  baseMass += modules.cargoBay * MODULE_MASS.货舱;
  baseMass += modules.liquidCargoBay * MODULE_MASS.液缸货舱;
  baseMass += modules.sightSeeingModule * MODULE_MASS.观光舱;
  baseMass += modules.biologicalCargoBay * MODULE_MASS.生物货舱;
  baseMass += modules.gasCargoCanister * MODULE_MASS.气罐货舱;

  const calculateDistance = (fuelAmount: number, fuelTanks = 0, oxidizerTanks = 0, thrusters = 0) => {
    let totalMass = baseMass;
    if (engine === '蒸汽引擎') {
      totalMass += fuelAmount + thrusters * MODULE_MASS.固体燃料推进器;
      const baseFlightDistance = ENGINE_FUEL_DISTANCE.蒸汽引擎 * fuelAmount;
      const massPenalty = Math.max(totalMass, Math.pow(totalMass / 300, 3.2));
      return baseFlightDistance - massPenalty + thrusters * 12000;
    }

    totalMass += fuelTanks * MODULE_MASS.液缸燃料舱;
    totalMass += oxidizerTanks * MODULE_MASS[oxidizerTankModule];
    totalMass += fuelAmount * 2;

    const baseFlightDistance = ENGINE_FUEL_DISTANCE[engine] * fuelAmount * OXIDIZER_MULTIPLIER[oxidizer];
    const massPenalty = Math.max(totalMass, Math.pow(totalMass / 300, 3.2));
    return baseFlightDistance - massPenalty;
  };

  const findMinFuel = (maxFuel: number, fuelTanks = 0, oxidizerTanks = 0, thrusters = 0) => {
    let left = 1;
    let right = Math.max(1, Math.floor(maxFuel));
    let answer: number | null = null;
    while (left <= right) {
      const middle = Math.floor((left + right) / 2);
      const actualDistance = calculateDistance(middle, fuelTanks, oxidizerTanks, thrusters);
      if (actualDistance >= distance) {
        answer = middle;
        right = middle - 1;
      } else left = middle + 1;
    }
    return answer;
  };

  if (engine === '蒸汽引擎') {
    for (let thrusters = 0; thrusters <= 10; thrusters++) {
      const minFuel = findMinFuel(CAPACITY.蒸汽引擎, 0, 0, thrusters);
      if (minFuel === null) continue;
      return {
        error: false,
        solution: { kind: 'steam', fuel: minFuel, thrusters },
      };
    }
    return { error: true, solution: null };
  }

  for (let oxidizerTanks = 1; oxidizerTanks <= 6; oxidizerTanks++) {
    const maxFuelTanks = oxidizerTanks * 3;
    for (let fuelTanks = 1; fuelTanks <= maxFuelTanks; fuelTanks++) {
      const totalTanks = fuelTanks + oxidizerTanks;
      if (totalTanks > 20) continue;

      const maxFuel = fuelTanks * CAPACITY.液缸燃料舱;
      const maxOxidizer = oxidizerTanks * CAPACITY[oxidizerTankModule];
      const actualMaxFuel = Math.min(maxFuel, maxOxidizer);
      if (calculateDistance(actualMaxFuel, fuelTanks, oxidizerTanks) < distance) continue;

      const minFuel = findMinFuel(actualMaxFuel, fuelTanks, oxidizerTanks);
      if (minFuel === null) continue;
      return {
        error: false,
        solution: {
          kind: 'liquid',
          fuelType: engine === '石油引擎' ? '石油' : '液态氢',
          fuelAmount: minFuel,
          oxidizer,
          fuelTanks,
          oxidizerTanks,
        },
      };
    }
  }

  return { error: true, solution: null };
}

export default function Rocket() {
  const { iconMap } = useContext(DataContext);
  const [engine, setEngine] = useState<EngineType>('蒸汽引擎');
  const [oxidizer, setOxidizer] = useState<OxidizerType>('氧石');
  const [distance, setDistance] = useState<number>(10000);
  const [modules, setModules] = useState<ModuleState>({
    researchModule: 0,
    sightSeeingModule: 0,
    cargoBay: 0,
    liquidCargoBay: 0,
    biologicalCargoBay: 0,
    gasCargoCanister: 0,
  });

  const getRocketIconUrl = (name: string) => {
    const file = ROCKET_ICON_FILES[name];
    if (!file) return undefined;
    return `${ICON_BASE_URL}${file}`;
  };

  const renderIcon = (name: string, icon?: string, size = 20) => {
    const iconData = getIconData(iconMap, name, icon) ?? getIconData(iconMap, name, getRocketIconUrl(name));
    if (!iconData?.icon) return null;
    return (
      <FilteredImage
        src={iconData.icon}
        iconFilter={iconData.iconFilter}
        style={{ width: size, height: size }}
        mode='aspectFit'
      />
    );
  };

  const result = useMemo(() => calculateRocket(engine, oxidizer, distance, modules), [distance, engine, modules, oxidizer]);

  const setModuleValue = (key: keyof ModuleState, value: string | number) => {
    setModules((prev) => ({ ...prev, [key]: toInt(value) }));
  };

  const distanceLabel = `${distance / 1000} 千米`;
  const oxidizerTankName = oxidizer === '液氧' ? '液体氧化剂舱' : '固体氧化剂舱';

  return (
    <View className='page rocket p-8'>
      {process.env.TARO_ENV === 'h5' && <BackButton />}

      <View className='tool-card p-12 flex flex-col gap-8'>
        <Text className='text-md font-semibold'>火箭引擎</Text>
        <RadioGroup
          value={engine}
          onChange={(value) => {
            const next = String(value) as EngineType;
            setEngine(next);
          }}
        >
          <View className='flex flex-wrap gap-4'>
            {(['蒸汽引擎', '石油引擎', '液氢引擎'] as EngineType[]).map((item) => (
              <Radio key={item} value={item}>
                <View className='flex items-center gap-4'>
                  {renderIcon(item)}
                  <Text>{item}</Text>
                </View>
              </Radio>
            ))}
          </View>
        </RadioGroup>
      </View>

      {engine !== '蒸汽引擎' && (
        <View className='tool-card p-12 flex flex-col gap-8'>
          <Text className='text-md font-semibold'>氧化剂</Text>
          <RadioGroup
            value={oxidizer}
            onChange={(value) => {
              const next = String(value) as OxidizerType;
              setOxidizer(next);
            }}
          >
            <View className='flex gap-6'>
              {(['氧石', '液氧'] as OxidizerType[]).map((item) => (
                <Radio key={item} value={item}>
                  <View className='flex items-center gap-4'>
                    {renderIcon(item, item === '液氧' ? '液态氧' : undefined)}
                    <Text>{item}</Text>
                  </View>
                </Radio>
              ))}
            </View>
          </RadioGroup>
        </View>
      )}

      <View className='tool-card p-12 flex items-center gap-8'>
        <Text className='text-md font-semibold'>目标距离</Text>
        <View style={{ flex: 1 }} />
        <Picker
          mode='selector'
          range={DISTANCE_OPTIONS.map((item) => `${item} 千米`)}
          value={DISTANCE_OPTIONS.indexOf(distance)}
          onChange={(e) => {
            const index = Number(e.detail.value);
            const next = DISTANCE_OPTIONS[index];
            if (next) setDistance(next);
          }}
        >
          <View className='picker-chip'>{distanceLabel}</View>
        </Picker>
      </View>

      <View className='tool-card p-12 flex flex-col gap-10'>
        <Text className='text-md font-semibold'>舱体配置</Text>

        <View className='module-row'>
          <View className='flex items-center gap-4'>
            {renderIcon('指挥舱')}
            <Text className='text-sm'>指挥舱</Text>
          </View>
          <Text className='text-sm font-semibold'>1</Text>
        </View>

        <View className='module-row'>
          <View className='flex items-center gap-4'>
            {renderIcon('研究舱')}
            <Text className='text-sm'>研究舱</Text>
          </View>
          <InputNumber value={modules.researchModule} min={0} step={1} onChange={(value) => setModuleValue('researchModule', value)} />
        </View>

        <View className='module-row'>
          <View className='flex items-center gap-4'>
            {renderIcon('货舱')}
            <Text className='text-sm'>货舱</Text>
          </View>
          <InputNumber value={modules.cargoBay} min={0} step={1} onChange={(value) => setModuleValue('cargoBay', value)} />
        </View>

        <View className='module-row'>
          <View className='flex items-center gap-4'>
            {renderIcon('液缸货舱')}
            <Text className='text-sm'>液缸货舱</Text>
          </View>
          <InputNumber value={modules.liquidCargoBay} min={0} step={1} onChange={(value) => setModuleValue('liquidCargoBay', value)} />
        </View>

        <View className='module-row'>
          <View className='flex items-center gap-4'>
            {renderIcon('观光舱')}
            <Text className='text-sm'>观光舱</Text>
          </View>
          <InputNumber value={modules.sightSeeingModule} min={0} step={1} onChange={(value) => setModuleValue('sightSeeingModule', value)} />
        </View>

        <View className='module-row'>
          <View className='flex items-center gap-4'>
            {renderIcon('生物货舱')}
            <Text className='text-sm'>生物货舱</Text>
          </View>
          <InputNumber value={modules.biologicalCargoBay} min={0} step={1} onChange={(value) => setModuleValue('biologicalCargoBay', value)} />
        </View>

        <View className='module-row'>
          <View className='flex items-center gap-4'>
            {renderIcon('气罐货舱')}
            <Text className='text-sm'>气罐货舱</Text>
          </View>
          <InputNumber value={modules.gasCargoCanister} min={0} step={1} onChange={(value) => setModuleValue('gasCargoCanister', value)} />
        </View>

        {engine === '蒸汽引擎' && (
          <View className='module-row'>
            <View className='flex items-center gap-4'>
              {renderIcon('固体燃料推进器')}
              <Text className='text-sm'>固体燃料推进器（自动）</Text>
            </View>
            <Text className='text-sm font-semibold'>{result.solution?.kind === 'steam' ? result.solution.thrusters : 0}</Text>
          </View>
        )}

        {engine !== '蒸汽引擎' && (
          <>
            <View className='module-row'>
              <View className='flex items-center gap-4'>
                {renderIcon('液缸燃料舱')}
                <Text className='text-sm'>液体燃料舱（自动）</Text>
              </View>
              <Text className='text-sm font-semibold'>{result.solution?.kind === 'liquid' ? result.solution.fuelTanks : 0}</Text>
            </View>

            <View className='module-row'>
              <View className='flex items-center gap-4'>
                {renderIcon(oxidizerTankName)}
                <Text className='text-sm'>{oxidizerTankName}（自动）</Text>
              </View>
              <Text className='text-sm font-semibold'>{result.solution?.kind === 'liquid' ? result.solution.oxidizerTanks : 0}</Text>
            </View>
          </>
        )}
      </View>

      {process.env.TARO_ENV === 'weapp' && <AdCustom unitId='adunit-3ea00a0b550cb48c' adIntervals={30} />}

      <View className='tool-card p-12 flex flex-col gap-8'>
        <Text className='text-md font-semibold'>计算结果</Text>
        {result.error || !result.solution ? (
          <>
            <Text className='text-sm text-danger'>当前配置无法到达目标距离</Text>
            <Text className='text-xs text-gray-600'>请减少舱体负载或降低目标距离</Text>
          </>
        ) : (
          <View className='result-grid'>
            {result.solution.kind === 'steam' && (
              <>
                <View className='result-item'>
                  <View className='flex items-center gap-4'>
                    {renderIcon('蒸汽')}
                    <Text className='text-sm'>蒸汽燃料</Text>
                  </View>
                  <Text className='text-sm font-semibold'>{formatNumber(result.solution.fuel)} kg</Text>
                </View>
                {result.solution.thrusters > 0 && (
                  <View className='result-item'>
                    <View className='flex items-center gap-4'>
                      {renderIcon('固体燃料推进器')}
                      <Text className='text-sm'>固体燃料推进器</Text>
                    </View>
                    <Text className='text-sm font-semibold'>{result.solution.thrusters} 个</Text>
                  </View>
                )}
              </>
            )}

            {result.solution.kind === 'liquid' && (
              <>
                <View className='result-item'>
                  <View className='flex items-center gap-4'>
                    {renderIcon(result.solution.fuelType === '石油' ? '石油' : '液态氢')}
                    <Text className='text-sm'>{result.solution.fuelType}燃料</Text>
                  </View>
                  <Text className='text-sm font-semibold'>{formatNumber(result.solution.fuelAmount)} kg</Text>
                </View>

                <View className='result-item'>
                  <View className='flex items-center gap-4'>
                    {renderIcon(result.solution.oxidizer, result.solution.oxidizer === '液氧' ? '液态氧' : undefined)}
                    <Text className='text-sm'>{result.solution.oxidizer}氧化剂</Text>
                  </View>
                  <Text className='text-sm font-semibold'>{formatNumber(result.solution.fuelAmount)} kg</Text>
                </View>

                <View className='result-item'>
                  <View className='flex items-center gap-4'>
                    {renderIcon('液缸燃料舱')}
                    <Text className='text-sm'>液体燃料舱</Text>
                  </View>
                  <Text className='text-sm font-semibold'>{result.solution.fuelTanks} 个</Text>
                </View>

                <View className='result-item'>
                  <View className='flex items-center gap-4'>
                    {renderIcon(result.solution.oxidizer === '液氧' ? '液体氧化剂舱' : '固体氧化剂舱')}
                    <Text className='text-sm'>{result.solution.oxidizer === '液氧' ? '液体氧化剂舱' : '固体氧化剂舱'}</Text>
                  </View>
                  <Text className='text-sm font-semibold'>{result.solution.oxidizerTanks} 个</Text>
                </View>
              </>
            )}
          </View>
        )}
      </View>

      

      <GlobalSvgFilters />
    </View>
  );
}
