import { useContext, useMemo, useState } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import { Cell, Collapse, InputNumber, Radio, RadioGroup } from '@nutui/nutui-react-taro';
import { ArrowDown } from '@nutui/icons-react-taro';
import BackButton from '@/components/ui/BackButton';
import { DataContext } from '@/contexts/DataContext';
import { CYCLE_SECONDS, useUnit } from '@/contexts/UnitContext';
import { BuildingDetail, Link, Menu } from '@/types/data';
import { buildDefaultModeSelections } from '@/components/selection/modeSelection';
import { calculateSelectionTotals } from '@/components/selection/calc';
import './oxygen.scss';

type SourceChoice = {
  type: 'external' | 'building';
  producerName?: string;
};

type Profile = {
  name: string;
  inputs: Record<string, number>;
  outputs: Record<string, number>;
  power: number;
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

function toProfile(link: Link): Profile {
  const detail = link.detail as BuildingDetail;
  const modeSelections = buildDefaultModeSelections(detail);
  const totals = calculateSelectionTotals(detail, 1, modeSelections);
  const inputs: Record<string, number> = {};
  const outputs: Record<string, number> = {};
  Object.entries(totals.resources).forEach(([name, value]) => {
    if (value < 0) addAmount(inputs, name, -value);
    if (value > 0) addAmount(outputs, name, value);
  });
  return {
    name: link.name,
    inputs,
    outputs,
    power: totals.totalPower,
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
  const { data, loading, error } = useContext(DataContext);
  const { timeUnit } = useUnit();
  const [dupeCount, setDupeCount] = useState<number>(8);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [sourceChoices, setSourceChoices] = useState<Record<string, SourceChoice>>({});

  const buildingMenu = useMemo(() => findChildMenu(data, '建筑'), [data]);
  const oxygenMenu = useMemo(() => findChildMenu(buildingMenu, '氧气'), [buildingMenu]);

  const methodProfiles = useMemo<MethodProfile[]>(() => {
    const links = collectLinks(oxygenMenu);
    return links
      .map((link) => {
        const profile = toProfile(link);
        return {
          ...profile,
          oxygenRate: profile.outputs['氧气'] || 0,
        };
      })
      .filter((item) => item.oxygenRate > 0)
      .sort((a, b) => b.oxygenRate - a.oxygenRate);
  }, [oxygenMenu]);

  const allBuildingProfiles = useMemo<Profile[]>(() => {
    const links = collectLinks(buildingMenu);
    return links.map(toProfile);
  }, [buildingMenu]);

  const producerByMaterial = useMemo<Record<string, Profile[]>>(() => {
    const map: Record<string, Profile[]> = {};
    allBuildingProfiles.forEach((profile) => {
      Object.entries(profile.outputs).forEach(([material, amount]) => {
        if (amount <= 0) return;
        map[material] = map[material] || [];
        map[material].push(profile);
      });
    });
    Object.values(map).forEach((profiles) => profiles.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')));
    return map;
  }, [allBuildingProfiles]);

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
    let totalPower = 0;

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
        totalPower,
      };
    }

    const rootCount = oxygenNeed / selectedMethodProfile.oxygenRate;
    addAmount(buildingCounts, selectedMethodProfile.name, rootCount);
    totalPower += selectedMethodProfile.power * rootCount;

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
      totalPower += producer.power * producerCount;
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
      totalPower,
    };
  }, [oxygenNeed, producerByMaterial, selectedMethodProfile, sourceChoices]);

  const materialSummaries = useMemo<MaterialSummary[]>(() => {
    const keys = new Set<string>([
      ...Object.keys(result.totalDemand),
      ...Object.keys(result.internalSupplyUsed),
      ...Object.keys(result.externalInputs),
    ]);
    return Array.from(keys)
      .map((name) => ({
        name,
        totalDemand: result.totalDemand[name] || 0,
        internalSupply: result.internalSupplyUsed[name] || 0,
        externalGap: result.externalInputs[name] || 0,
      }))
      .filter((item) => item.totalDemand > 1e-9 || item.externalGap > 1e-9)
      .sort((a, b) => b.totalDemand - a.totalDemand);
  }, [result.externalInputs, result.internalSupplyUsed, result.totalDemand]);

  const byproducts = useMemo(() => {
    return Object.entries(result.supplyPool)
      .filter(([name, value]) => value > 1e-9 && name !== '氧气')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [result.supplyPool]);

  const setMaterialSourceType = (material: string, type: 'external' | 'building') => {
    setSourceChoices((prev) => {
      if (type === 'external') return { ...prev, [material]: { type: 'external' } };
      const producers = producerByMaterial[material] || [];
      if (!producers.length) return { ...prev, [material]: { type: 'external' } };
      const old = prev[material];
      const currentName = old?.producerName && producers.some((item) => item.name === old.producerName) ? old.producerName : producers[0].name;
      return { ...prev, [material]: { type: 'building', producerName: currentName } };
    });
  };

  const setMaterialProducer = (material: string, producerName: string) => {
    setSourceChoices((prev) => ({ ...prev, [material]: { type: 'building', producerName } }));
  };

  const directInputRows = useMemo(() => {
    if (!selectedMethodProfile || oxygenNeed <= 0) return [];
    const count = oxygenNeed / selectedMethodProfile.oxygenRate;
    return Object.entries(selectedMethodProfile.inputs)
      .map(([name, amount]) => ({ name, amount: amount * count }))
      .sort((a, b) => b.amount - a.amount);
  }, [oxygenNeed, selectedMethodProfile]);

  const directOutputRows = useMemo(() => {
    if (!selectedMethodProfile || oxygenNeed <= 0) return [];
    const count = oxygenNeed / selectedMethodProfile.oxygenRate;
    return Object.entries(selectedMethodProfile.outputs)
      .filter(([name]) => name !== '氧气')
      .map(([name, amount]) => ({ name, amount: amount * count }))
      .sort((a, b) => b.amount - a.amount);
  }, [oxygenNeed, selectedMethodProfile]);

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
        <Text className='text-sm text-gray-600'>总耗氧：{formatMass(oxygenNeed, timeUnit)}</Text>
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
              {methodProfiles.map((method) => (
                <Radio key={method.name} value={method.name}>
                  {method.name}（{formatMass(method.oxygenRate, timeUnit)}）
                </Radio>
              ))}
            </View>
          </RadioGroup>
        )}
      </View>

      {selectedMethodProfile && oxygenNeed > 0 && (
        <View className='tool-card p-12 flex flex-col gap-8'>
          <Text className='text-md font-semibold'>直接材料</Text>
          <Text className='text-sm text-gray-600'>
            目标产氧 {formatMass(oxygenNeed, timeUnit)}，{selectedMethodProfile.name} 规模 {formatNumber(oxygenNeed / selectedMethodProfile.oxygenRate)}
          </Text>
          {directInputRows.length > 0 && (
            <View className='flex flex-col gap-4'>
              {directInputRows.map((item) => (
                <View key={`in-${item.name}`} className='flex justify-between'>
                  <Text className='text-sm'>{item.name}</Text>
                  <Text className='text-sm text-danger'>{formatMass(item.amount, timeUnit)}</Text>
                </View>
              ))}
            </View>
          )}
          {directOutputRows.length > 0 && (
            <View className='flex flex-col gap-4'>
              {directOutputRows.map((item) => (
                <View key={`out-${item.name}`} className='flex justify-between'>
                  <Text className='text-sm'>{item.name}</Text>
                  <Text className='text-sm text-success'>+{formatMass(item.amount, timeUnit)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {selectedMethodProfile && oxygenNeed > 0 && (
        <View className='tool-card p-12 flex flex-col gap-10'>
          <Text className='text-md font-semibold'>来源展开</Text>
          {materialSummaries.length === 0 && <Text className='text-sm text-muted'>当前无额外输入需求</Text>}
          {materialSummaries.map((row) => {
            const producers = producerByMaterial[row.name] || [];
            const sourceModeOptions = producers.length > 0 ? ['外部输入', '建筑生产'] : ['外部输入'];
            const currentChoice = sourceChoices[row.name];
            const modeValue = currentChoice?.type === 'building' && producers.length > 0 ? '建筑生产' : '外部输入';
            const producerNames = producers.map((item) => item.name);
            const producerValue = currentChoice?.producerName && producerNames.includes(currentChoice.producerName)
              ? currentChoice.producerName
              : producerNames[0];
            return (
              <View key={row.name} className='material-item p-8 flex flex-col gap-6'>
                <View className='flex justify-between items-center'>
                  <Text className='text-sm font-semibold'>{row.name}</Text>
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
                      setMaterialSourceType(row.name, mode === '建筑生产' ? 'building' : 'external');
                    }}
                  >
                    <View className='picker-chip'>{modeValue}</View>
                  </Picker>
                  {modeValue === '建筑生产' && producerNames.length > 0 && (
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
                      <View className='picker-chip'>{producerValue}</View>
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
          <Text className='text-md font-semibold'>结果汇总</Text>
          <Cell.Group>
            <Cell title='净水总需求' extra={formatMass(result.externalInputs['水'] || 0, timeUnit)} />
            <Cell title='总电力' extra={`${formatNumber(result.totalPower)} 瓦`} />
            <Cell
              title='副产物'
              extra={byproducts.length > 0 ? byproducts.map(([name, value]) => `${name} ${formatMass(value, timeUnit)}`).join('；') : '无'}
            />
          </Cell.Group>
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
          </View>
          {materialSummaries.map((row) => (
            <View key={`summary-${row.name}`} className='table-row'>
              <Text className='text-xs'>{row.name}</Text>
              <Text className='text-xs'>{formatMass(row.totalDemand, timeUnit)}</Text>
              <Text className='text-xs text-success'>{formatMass(row.internalSupply, timeUnit)}</Text>
              <Text className='text-xs text-danger'>{formatMass(row.externalGap, timeUnit)}</Text>
            </View>
          ))}
          {materialSummaries.length === 0 && <Text className='text-sm text-muted text-center'>无</Text>}
        </View>
      )}

      {selectedMethodProfile && oxygenNeed > 0 && (
        <View className='tool-card p-12 flex flex-col gap-8'>
          <Text className='text-md font-semibold'>链路视图</Text>
          <Collapse defaultActiveName={['步骤']} expandIcon={<ArrowDown className='text-white' />}>
            <Collapse.Item title='展开链路' name='步骤'>
              <View className='flex flex-col gap-4'>
                <Text className='text-xs'>主方式：{selectedMethodProfile.name} × {formatNumber(oxygenNeed / selectedMethodProfile.oxygenRate)} </Text>
                {result.linkSteps.map((step, index) => (
                  <Text key={`${step.material}-${step.producer}-${index}`} className='text-xs'>
                    {`${'　'.repeat(Math.min(step.depth, 6))}${step.material} ← ${step.producer} × ${formatNumber(step.buildingCount)}`}
                  </Text>
                ))}
                {Object.entries(result.buildingCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([name, count]) => (
                    <Text key={`building-${name}`} className='text-xs text-gray-600'>
                      {`建筑统计：${name} × ${formatNumber(count)} 台`}
                    </Text>
                  ))}
              </View>
            </Collapse.Item>
          </Collapse>
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
    </View>
  );
}
