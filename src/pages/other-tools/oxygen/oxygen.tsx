import { useContext, useMemo, useState } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import { Cell, Collapse, InputNumber, Radio, RadioGroup } from '@nutui/nutui-react-taro';
import { ArrowDown } from '@nutui/icons-react-taro';
import BackButton from '@/components/ui/BackButton';
import FilteredImage from '@/components/ui/FilteredImage';
import { DataContext } from '@/contexts/DataContext';
import { CYCLE_SECONDS, useUnit } from '@/contexts/UnitContext';
import { BuildingDetail, Link, LinkDetail, Menu } from '@/types/data';
import { buildDefaultModeSelections } from '@/components/selection/modeSelection';
import { calculateSelectionTotals } from '@/components/selection/calc';
import { getIconData } from '@/utils/utils';
import './oxygen.scss';
import GlobalSvgFilters from '@/components/ui/GlobalSvgFilters';

type SourceChoice = {
  type: 'external' | 'building' | 'animal' | 'plant';
  producerName?: string;
};

type Profile = {
  name: string;
  icon?: string;
  inputs: Record<string, number>;
  outputs: Record<string, number>;
  category: string;
};

type MethodProfile = Profile & {
  oxygenRate: number;
};

type LinkStep = {
  material: string;
  producer: string;
  buildingCount: number;
  depth: number;
};

type MaterialSummary = {
  name: string;
  totalDemand: number;
  internalSupply: number;
  externalGap: number;
  surplus: number;
};

function addAmount(map: Record<string, number>, key: string, value: number) {
  if (!Number.isFinite(value) || value === 0) return;
  map[key] = (map[key] || 0) + value;
}

function findChildMenu(menu: Menu | null, name: string): Menu | null {
  if (!menu) return null;
  const items = Array.isArray(menu.items) ? menu.items : [];
  for (const item of items) {
    if (item?.name === name && item?.menu) return item.menu;
  }
  return null;
}

function collectLinks(menu: Menu | null): Link[] {
  if (!menu) return [];
  const result: Link[] = [];
  const visited = new WeakSet<Menu>();
  const dfs = (current: Menu) => {
    if (!current || visited.has(current)) return;
    visited.add(current);
    const items = Array.isArray(current.items) ? current.items : [];
    for (const item of items) {
      if (item?.detail) result.push(item);
      if (item?.menu) dfs(item.menu);
    }
  };
  dfs(menu);
  return result;
}

function toProfile(link: Link, category: string): Profile {
  const detail = link.detail as LinkDetail;
  const isPlant = category === '植物';
  const modeSelections = buildDefaultModeSelections(detail);
  const totals = calculateSelectionTotals(detail, 1, modeSelections, 100, 0, 0, { isPlant });
  const inputs: Record<string, number> = {};
  const outputs: Record<string, number> = {};
  Object.entries(totals.resources).forEach(([name, value]) => {
    if (value < 0) addAmount(inputs, name, -value);
    if (value > 0) addAmount(outputs, name, value);
  });
  return {
    name: link.name,
    icon: link.icon,
    inputs,
    outputs,
    category,
  };
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return '0';
  const abs = Math.abs(value);
  let digits = 2;
  if (abs >= 1000) digits = 0;
  else if (abs >= 100) digits = 1;
  else if (abs < 1) digits = 3;
  const fixed = value.toFixed(digits);
  const trimmed = fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed;
  return trimmed === '-0' ? '0' : trimmed;
}

function formatMass(valuePerSecond: number, timeUnit: '秒' | '周期') {
  const value = timeUnit === '周期' ? valuePerSecond * CYCLE_SECONDS : valuePerSecond;
  const abs = Math.abs(value);
  if (abs >= 1000000) return `${formatNumber(value / 1000000)} 吨/${timeUnit}`;
  if (abs >= 1000) return `${formatNumber(value / 1000)} 千克/${timeUnit}`;
  return `${formatNumber(value)} 克/${timeUnit}`;
}

export default function Oxygen() {
  const { data, iconMap, loading, error } = useContext(DataContext);
  const { timeUnit } = useUnit();

  const renderIcon = (name: string, icon?: string, size = 24) => {
    const iconData = getIconData(iconMap, name, icon);
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
  const [dupeCount, setDupeCount] = useState<number>(8);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [sourceChoices, setSourceChoices] = useState<Record<string, SourceChoice>>({});

  const buildingMenu = useMemo(() => findChildMenu(data, '建筑'), [data]);
  const animalMenu = useMemo(() => findChildMenu(data, '小动物'), [data]);
  const plantMenu = useMemo(() => findChildMenu(data, '植物'), [data]);
  const oxygenMenu = useMemo(() => findChildMenu(buildingMenu, '氧气'), [buildingMenu]);

  const methodProfiles = useMemo<MethodProfile[]>(() => {
    const links = collectLinks(oxygenMenu);
    return links
      .map((link) => {
        const profile = toProfile(link, '建筑');
        return {
          ...profile,
          oxygenRate: profile.outputs['氧气'] || 0,
        };
      })
      .filter((item) => item.oxygenRate > 0)
      .sort((a, b) => b.oxygenRate - a.oxygenRate);
  }, [oxygenMenu]);

  const allSourceProfiles = useMemo<Profile[]>(() => {
    const bLinks = collectLinks(buildingMenu).map((l) => toProfile(l, '建筑'));
    const aLinks = collectLinks(animalMenu).map((l) => toProfile(l, '小动物'));
    const pLinks = collectLinks(plantMenu).map((l) => toProfile(l, '植物'));
    return [...bLinks, ...aLinks, ...pLinks];
  }, [buildingMenu, animalMenu, plantMenu]);

  const producerByMaterial = useMemo<Record<string, Profile[]>>(() => {
    const map: Record<string, Profile[]> = {};
    allSourceProfiles.forEach((profile) => {
      Object.entries(profile.outputs).forEach(([material, amount]) => {
        if (amount <= 0) return;
        map[material] = map[material] || [];
        map[material].push(profile);
      });
    });
    Object.values(map).forEach((profiles) => profiles.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')));
    return map;
  }, [allSourceProfiles]);

  const activeMethodName = selectedMethod || methodProfiles[0]?.name || '';
  const selectedMethodProfile = useMemo(() => {
    if (!activeMethodName) return null;
    return methodProfiles.find((item) => item.name === activeMethodName) || null;
  }, [activeMethodName, methodProfiles]);

  const oxygenNeed = useMemo(() => Math.max(0, dupeCount) * 100, [dupeCount]);

  const result = useMemo(() => {
    const externalInputs: Record<string, number> = {};
    const totalDemand: Record<string, number> = {};
    const internalSupplyUsed: Record<string, number> = {};
    const supplyPool: Record<string, number> = {};
    const producedTotal: Record<string, number> = {};
    const buildingCounts: Record<string, number> = {};
    const linkSteps: LinkStep[] = [];
    const warnings: string[] = [];

    if (!selectedMethodProfile || oxygenNeed <= 0) {
      return {
        externalInputs,
        totalDemand,
        internalSupplyUsed,
        supplyPool,
        producedTotal,
        buildingCounts,
        linkSteps,
        warnings,
      };
    }

    const rootCount = oxygenNeed / selectedMethodProfile.oxygenRate;
    addAmount(buildingCounts, selectedMethodProfile.name, rootCount);

    Object.entries(selectedMethodProfile.outputs).forEach(([name, amount]) => {
      const value = amount * rootCount;
      addAmount(producedTotal, name, value);
      addAmount(supplyPool, name, value);
    });

    const resolveMaterial = (material: string, amount: number, trail: string[]) => {
      if (!Number.isFinite(amount) || amount <= 1e-9) return;
      addAmount(totalDemand, material, amount);
      const available = supplyPool[material] || 0;
      if (available > 0) {
        const used = Math.min(available, amount);
        addAmount(internalSupplyUsed, material, used);
        supplyPool[material] = available - used;
        amount -= used;
      }
      if (amount <= 1e-9) return;
      if (trail.includes(material)) {
        addAmount(externalInputs, material, amount);
        warnings.push(`检测到循环依赖：${[...trail, material].join(' → ')}，已回退为外部输入`);
        return;
      }

      const choice = sourceChoices[material];
      if (!choice || choice.type === 'external') {
        addAmount(externalInputs, material, amount);
        return;
      }

      const producers = producerByMaterial[material] || [];
      const producer = producers.find((item) => item.name === choice.producerName) || producers[0];
      if (!producer) {
        addAmount(externalInputs, material, amount);
        warnings.push(`${material} 未找到可生产建筑，已回退为外部输入`);
        return;
      }

      const outputRate = producer.outputs[material] || 0;
      if (outputRate <= 0) {
        addAmount(externalInputs, material, amount);
        warnings.push(`${producer.name} 无法稳定产出 ${material}，已回退为外部输入`);
        return;
      }

      const producerCount = amount / outputRate;
      addAmount(buildingCounts, producer.name, producerCount);
      linkSteps.push({
        material,
        producer: producer.name,
        buildingCount: producerCount,
        depth: trail.length,
      });

      Object.entries(producer.outputs).forEach(([name, value]) => {
        const produced = value * producerCount;
        addAmount(producedTotal, name, produced);
        addAmount(supplyPool, name, produced);
      });

      const refreshed = supplyPool[material] || 0;
      if (refreshed > 0) {
        const used = Math.min(refreshed, amount);
        addAmount(internalSupplyUsed, material, used);
        supplyPool[material] = refreshed - used;
        amount -= used;
      }
      if (amount > 1e-9) addAmount(externalInputs, material, amount);

      Object.entries(producer.inputs).forEach(([upstream, need]) => {
        resolveMaterial(upstream, need * producerCount, [...trail, material]);
      });
    };

    Object.entries(selectedMethodProfile.inputs).forEach(([material, need]) => {
      resolveMaterial(material, need * rootCount, ['目标产氧']);
    });

    return {
      externalInputs,
      totalDemand,
      internalSupplyUsed,
      supplyPool,
      producedTotal,
      buildingCounts,
      linkSteps,
      warnings: Array.from(new Set(warnings)),
    };
  }, [oxygenNeed, producerByMaterial, selectedMethodProfile, sourceChoices]);

  const materialSummaries = useMemo<MaterialSummary[]>(() => {
    const keys = new Set<string>([
      ...Object.keys(result.totalDemand),
      ...Object.keys(result.internalSupplyUsed),
      ...Object.keys(result.externalInputs),
      ...Object.keys(result.supplyPool),
    ]);
    return Array.from(keys)
      .map((name) => ({
        name,
        totalDemand: result.totalDemand[name] || 0,
        internalSupply: result.internalSupplyUsed[name] || 0,
        externalGap: result.externalInputs[name] || 0,
        surplus: result.supplyPool[name] || 0,
      }))
      .filter((item) => item.totalDemand > 1e-9 || item.externalGap > 1e-9 || item.surplus > 1e-9)
      .sort((a, b) => b.totalDemand - a.totalDemand || b.surplus - a.surplus);
  }, [result.externalInputs, result.internalSupplyUsed, result.totalDemand, result.supplyPool]);

  const demandMaterials = useMemo(() => materialSummaries.filter((item) => item.totalDemand > 1e-9), [materialSummaries]);

  const setMaterialSourceType = (material: string, type: SourceChoice['type']) => {
    setSourceChoices((prev) => {
      if (type === 'external') return { ...prev, [material]: { type: 'external' } };
      const categoryMap: Record<string, string> = {
        building: '建筑',
        animal: '小动物',
        plant: '植物',
      };
      const category = categoryMap[type];
      const producers = (producerByMaterial[material] || []).filter((p) => p.category === category);
      if (!producers.length) return { ...prev, [material]: { type: 'external' } };
      const old = prev[material];
      const currentName = old?.producerName && producers.some((item) => item.name === old.producerName) ? old.producerName : producers[0].name;
      return { ...prev, [material]: { type, producerName: currentName } };
    });
  };

  const setMaterialProducer = (material: string, producerName: string) => {
    setSourceChoices((prev) => ({ ...prev, [material]: { type: 'building', producerName } }));
  };

  return (
    <View className='page oxygen p-8'>
      {process.env.TARO_ENV === 'h5' && <BackButton />}
      <View className='tool-card p-12 flex flex-col gap-8'>
        <View className='flex items-center gap-8'>
          <Text className='text-md font-semibold'>复制人数量</Text>
          <View style={{ flex: 1 }} />
          <InputNumber
            value={dupeCount}
            min={0}
            step={1}
            onChange={(value) => {
              const next = Number(value);
              setDupeCount(Number.isFinite(next) ? Math.max(0, next) : 0);
            }}
          />
        </View>
        <Text className='text-sm text-gray-600'>总耗氧：- {formatMass(oxygenNeed, timeUnit)}</Text>
      </View>

      <View className='tool-card p-12 flex flex-col gap-8'>
        <Text className='text-md font-semibold'>制氧方式</Text>
        {loading && <Text className='text-sm text-muted'>加载中...</Text>}
        {!loading && error && <Text className='text-sm text-danger'>数据加载失败：{error.message}</Text>}
        {!loading && !error && methodProfiles.length === 0 && <Text className='text-sm text-muted'>未找到可用制氧建筑</Text>}
        {!loading && !error && methodProfiles.length > 0 && (
          <RadioGroup
            value={activeMethodName}
            onChange={(value) => {
              const next = String(value);
              setSelectedMethod(next);
            }}
          >
            <View className='flex flex-col gap-6'>
              {methodProfiles.map((method) => {
                const count = oxygenNeed / method.oxygenRate;
                return (
                  <Radio key={method.name} value={method.name}>
                    <View className='flex items-center gap-4'>
                      {renderIcon(method.name, method.icon)}
                      <Text>
                        {method.name}（+{formatMass(method.oxygenRate, timeUnit)}）× {formatNumber(count)} 台
                      </Text>
                    </View>
                  </Radio>
                );
              })}
            </View>
          </RadioGroup>
        )}
      </View>

      {selectedMethodProfile && oxygenNeed > 0 && (
        <View className='tool-card p-12 flex flex-col gap-10'>
          <Text className='text-md font-semibold'>材料来源</Text>
          {demandMaterials.length === 0 && <Text className='text-sm text-muted'>当前无额外输入需求</Text>}
          {demandMaterials.map((row) => {
            const producers = producerByMaterial[row.name] || [];
            const hasBuildings = producers.some((p) => p.category === '建筑');
            const hasAnimals = producers.some((p) => p.category === '小动物');
            const hasPlants = producers.some((p) => p.category === '植物');

            const sourceModeOptions = ['外部输入'];
            if (hasBuildings) sourceModeOptions.push('建筑生产');
            if (hasAnimals) sourceModeOptions.push('动物产出');
            if (hasPlants) sourceModeOptions.push('植物产出');

            const currentChoice = sourceChoices[row.name];
            let modeValue = '外部输入';
            if (currentChoice?.type === 'building' && hasBuildings) modeValue = '建筑生产';
            else if (currentChoice?.type === 'animal' && hasAnimals) modeValue = '动物产出';
            else if (currentChoice?.type === 'plant' && hasPlants) modeValue = '植物产出';

            const categoryMap: Record<string, string> = {
              建筑生产: '建筑',
              动物产出: '小动物',
              植物产出: '植物',
            };
            const currentCategory = categoryMap[modeValue];
            const currentProducers = producers.filter((p) => p.category === currentCategory);
            const producerNames = currentProducers.map((item) => item.name);
            const producerValue =
              currentChoice?.producerName && producerNames.includes(currentChoice.producerName) ? currentChoice.producerName : producerNames[0];

            return (
              <View key={row.name} className='material-item p-8 flex flex-col gap-6'>
                <View className='flex justify-between items-center'>
                  <View className='flex items-center gap-4'>
                    {renderIcon(row.name, undefined, 20)}
                    <Text className='text-sm font-semibold'>{row.name}</Text>
                  </View>
                  <Text className='text-sm text-danger'>缺口 {formatMass(row.externalGap, timeUnit)}</Text>
                </View>
                <View className='text-xs text-gray-600'>
                  总需求 {formatMass(row.totalDemand, timeUnit)} / 内部供给 {formatMass(row.internalSupply, timeUnit)}
                </View>
                <View className='flex gap-8'>
                  <Picker
                    mode='selector'
                    range={sourceModeOptions}
                    value={sourceModeOptions.indexOf(modeValue)}
                    onChange={(e) => {
                      const index = Number(e.detail.value);
                      const mode = sourceModeOptions[index] || '外部输入';
                      const modeTypeMap: Record<string, SourceChoice['type']> = {
                        '外部输入': 'external',
                        '建筑生产': 'building',
                        '动物产出': 'animal',
                        '植物产出': 'plant',
                      };
                      setMaterialSourceType(row.name, modeTypeMap[mode] || 'external');
                    }}
                  >
                    <View className='picker-chip'>{modeValue}</View>
                  </Picker>
                  {modeValue !== '外部输入' && producerNames.length > 0 && (
                    <Picker
                      mode='selector'
                      range={producerNames}
                      value={Math.max(0, producerNames.indexOf(producerValue))}
                      onChange={(e) => {
                        const index = Number(e.detail.value);
                        const nextName = producerNames[index];
                        if (nextName) setMaterialProducer(row.name, nextName);
                      }}
                    >
                      <View className='picker-chip flex items-center gap-4'>
                        {renderIcon(producerValue, undefined, 16)}
                        <Text>{producerValue}</Text>
                      </View>
                    </Picker>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {selectedMethodProfile && oxygenNeed > 0 && (
        <View className='tool-card p-12 flex flex-col gap-8'>
          <Text className='text-md font-semibold'>明细表</Text>
          <View className='table-head'>
            <Text className='text-xs font-semibold'>材料</Text>
            <Text className='text-xs font-semibold'>总需求</Text>
            <Text className='text-xs font-semibold'>内部供给</Text>
            <Text className='text-xs font-semibold'>外部缺口</Text>
            <Text className='text-xs font-semibold'>剩余</Text>
          </View>
          {materialSummaries.map((row) => (
            <View key={`summary-${row.name}`} className='table-row'>
              <View className='flex items-center gap-2'>
                {renderIcon(row.name, undefined, 14)}
                <Text className='text-xs'>{row.name}</Text>
              </View>
              <Text className='text-xs'>{formatMass(row.totalDemand, timeUnit)}</Text>
              <Text className='text-xs text-success'>{formatMass(row.internalSupply, timeUnit)}</Text>
              <Text className='text-xs text-danger'>{formatMass(row.externalGap, timeUnit)}</Text>
              <Text className='text-xs text-gray-600'>{row.surplus > 1e-9 ? formatMass(row.surplus, timeUnit) : '-'}</Text>
            </View>
          ))}
          {materialSummaries.length === 0 && <Text className='text-sm text-muted text-center'>无</Text>}
        </View>
      )}

      {selectedMethodProfile && oxygenNeed > 0 && (
        <View className='tool-card p-12 flex flex-col gap-8'>
          <Text className='text-md font-semibold'>链路视图</Text>
          <View className='flex flex-col gap-4'>
                <View className='flex items-center gap-2'>
                  {renderIcon(selectedMethodProfile.name, selectedMethodProfile.icon, 16)}
                  <Text className='text-xs'>{selectedMethodProfile.name} × {formatNumber(oxygenNeed / selectedMethodProfile.oxygenRate)} </Text>
                </View>
                {result.linkSteps.map((step, index) => (
                  <View key={`${step.material}-${step.producer}-${index}`} className='flex items-center gap-2'>
                    <Text className='text-xs'>{'　'.repeat(Math.min(step.depth, 6))}</Text>
                    {renderIcon(step.material, undefined, 14)}
                    <Text className='text-xs'>{step.material} ← </Text>
                    {renderIcon(step.producer, undefined, 14)}
                    <Text className='text-xs'>{step.producer} × {formatNumber(step.buildingCount)}</Text>
                  </View>
                ))}
              </View>
        </View>
      )}

      {result.warnings.length > 0 && (
        <View className='tool-card p-12 flex flex-col gap-4'>
          <Text className='text-md font-semibold'>提示</Text>
          {result.warnings.map((warning, index) => (
            <Text key={`warn-${index}`} className='text-sm text-danger'>{warning}</Text>
          ))}
        </View>
      )}
      
      <GlobalSvgFilters />
    </View>
  );
}
