import { useContext, useEffect, useMemo, useState } from 'react';
import { Picker, Text, View } from '@tarojs/components';
import { InputNumber } from '@nutui/nutui-react-taro';
import { ArrowRight } from '@nutui/icons-react-taro';
import BackButton from '@/components/ui/BackButton';
import FilteredImage from '@/components/ui/FilteredImage';
import GlobalSvgFilters from '@/components/ui/GlobalSvgFilters';
import { DataContext } from '@/contexts/DataContext';
import { CYCLE_SECONDS, HUNGER_OPTIONS, HungerLevel, useUnit } from '@/contexts/UnitContext';
import { calculateSelectionTotals, parseResourceRate, ResourceUnitKind } from '@/components/selection/calc';
import { buildDefaultModeSelections, withPlantGrowthMode } from '@/components/selection/modeSelection';
import { CreatureDetail, Link, LinkDetail, Menu, PlantDetail } from '@/types/data';
import { getIconData } from '@/utils/utils';
import './food.scss';

type MaterialRate = {
  value: number;
  kind: ResourceUnitKind;
};

type Recipe = {
  name: string;
  fullName: string;
  machine: string;
  output: MaterialRate;
  inputs: Record<string, MaterialRate>;
};

type SourceProfile = {
  name: string;
  icon?: string;
  category: '植物' | '小动物';
  inputs: Record<string, MaterialRate>;
  outputs: Record<string, MaterialRate>;
};

type ProducerOption = {
  name: string;
  count: number;
  type: 'recipe' | 'source';
  inputs: Record<string, MaterialRate>;
};

type ChainStep = {
  material: string;
  neededRate: MaterialRate;
  producers: ProducerOption[];
};

function addRate(map: Record<string, MaterialRate>, key: string, value: number, kind: ResourceUnitKind) {
  if (!Number.isFinite(value) || Math.abs(value) <= 1e-9) return;
  const current = map[key];
  if (!current) {
    map[key] = { value, kind };
    return;
  }
  current.value += value;
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
  const links: Link[] = [];
  const visited = new WeakSet<Menu>();
  const dfs = (current: Menu) => {
    if (!current || visited.has(current)) return;
    visited.add(current);
    const items = Array.isArray(current.items) ? current.items : [];
    for (const item of items) {
      if (item?.detail) links.push(item);
      if (item?.menu) dfs(item.menu);
    }
  };
  dfs(menu);
  return links;
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

function formatRate(valuePerSecond: number, kind: ResourceUnitKind) {
  const valuePerCycle = valuePerSecond * CYCLE_SECONDS;
  if (kind === 'kcal') return `${formatNumber(valuePerCycle)} 千卡/周期`;
  if (kind === 'count') return `${formatNumber(valuePerCycle)} 单位/周期`;
  if (kind === 'growth') return `${formatNumber(valuePerCycle)} 生长进度/周期`;
  const abs = Math.abs(valuePerCycle);
  if (abs >= 1000000) return `${formatNumber(valuePerCycle / 1000000)} 吨/周期`;
  if (abs >= 1000) return `${formatNumber(valuePerCycle / 1000)} 千克/周期`;
  return `${formatNumber(valuePerCycle)} 克/周期`;
}

function getDeltaCalories(level: HungerLevel) {
  const option = HUNGER_OPTIONS.find((item) => item.label === level);
  return option?.calorieDelta || 0;
}

export default function Food() {
  const { data, iconMap, loading, error } = useContext(DataContext);
  const { hungerLevel, setHungerLevel } = useUnit();
  const [dupeCount, setDupeCount] = useState(8);
  const [bottomlessCount, setBottomlessCount] = useState(0);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [selectedFood, setSelectedFood] = useState('');

  const renderIcon = (name: string, icon?: string, size = 20) => {
    const iconData = getIconData(iconMap, name, icon);
    if (!iconData?.icon) return null;
    return <FilteredImage src={iconData.icon} iconFilter={iconData.iconFilter} style={{ width: size, height: size }} mode='aspectFit' />;
  };

  const buildingMenu = useMemo(() => findChildMenu(data, '建筑'), [data]);
  const plantMenu = useMemo(() => findChildMenu(data, '植物'), [data]);
  const creatureMenu = useMemo(() => findChildMenu(data, '小动物'), [data]);
  const foodBuildingMenu = useMemo(() => findChildMenu(buildingMenu, '食物'), [buildingMenu]);

  const recipes = useMemo<Recipe[]>(() => {
    const links = collectLinks(foodBuildingMenu);
    const result: Recipe[] = [];
    links.forEach((link) => {
      const detail = link.detail as LinkDetail;
      const modes = Array.isArray((detail as any).modes) ? ((detail as any).modes as any[]) : [];
      modes.forEach((mode) => {
        const options = Array.isArray(mode?.options) ? mode.options : [];
        options.forEach((option) => {
          const resources = (option?.resources || {}) as Record<string, string>;
          const outputs = Object.entries(resources).map(([name, raw]) => ({ name, parsed: parseResourceRate(raw) })).filter((entry) => entry.parsed.valuePerSecond > 0 && entry.parsed.kind === 'kcal');
          if (outputs.length === 0) return;
          const output = outputs[0];
          const inputs: Record<string, MaterialRate> = {};
          Object.entries(resources).forEach(([name, raw]) => {
            const parsed = parseResourceRate(raw);
            if (parsed.valuePerSecond >= 0) return;
            inputs[name] = { value: Math.abs(parsed.valuePerSecond), kind: parsed.kind };
          });
          result.push({
            name: output.name,
            fullName: option?.name || output.name,
            machine: link.name,
            output: { value: output.parsed.valuePerSecond, kind: output.parsed.kind },
            inputs,
          });
        });
      });
    });
    return result;
  }, [foodBuildingMenu]);

  const sourceProfiles = useMemo<SourceProfile[]>(() => {
    const profiles: SourceProfile[] = [];

    const processMenu = (menu: Menu | null, category: '植物' | '小动物') => {
      collectLinks(menu).forEach((link) => {
        const detail = link.detail as any;
        const totals = category === '植物'
          ? (() => {
              const withGrowth = withPlantGrowthMode(detail as PlantDetail, true);
              const modeSelections = buildDefaultModeSelections(withGrowth);
              return calculateSelectionTotals(withGrowth, 1, modeSelections, 100, 0, 0, { isPlant: true });
            })()
          : (() => {
              const modeSelections = buildDefaultModeSelections(detail as CreatureDetail);
              return calculateSelectionTotals(detail as CreatureDetail, 1, modeSelections);
            })();

        const outputs: Record<string, MaterialRate> = {};
        Object.entries(totals.resources).forEach(([name, value]) => {
          if (value > 0) {
            const kind = totals.resourceKinds[name] || 'mass';
            addRate(outputs, name, value, kind);
          }
        });
        if (Object.keys(outputs).length === 0) return;
        profiles.push({ name: link.name, icon: link.icon, category, inputs: {}, outputs });
      });
    };

    processMenu(plantMenu, '植物');
    processMenu(creatureMenu, '小动物');
    return profiles;
  }, [creatureMenu, plantMenu]);

  const foodToRecipes = useMemo(() => {
    const map: Record<string, Recipe[]> = {};
    recipes.forEach((recipe) => {
      map[recipe.name] = map[recipe.name] || [];
      map[recipe.name].push(recipe);
    });
    Object.values(map).forEach((list) => list.sort((a, b) => b.output.value - a.output.value));
    return map;
  }, [recipes]);

  const producerByMaterial = useMemo(() => {
    const map: Record<string, SourceProfile[]> = {};
    sourceProfiles.forEach((profile) => {
      Object.entries(profile.outputs).forEach(([material, rate]) => {
        if (rate.value <= 1e-9) return;
        map[material] = map[material] || [];
        map[material].push(profile);
      });
    });
    Object.values(map).forEach((list) => list.sort((a, b) => {
      const aRate = Object.values(a.outputs)[0]?.value || 0;
      const bRate = Object.values(b.outputs)[0]?.value || 0;
      return bRate - aRate;
    }));
    return map;
  }, [sourceProfiles]);

  const machineOptions = useMemo(() => {
    const crafted = Array.from(new Set(recipes.map((recipe) => recipe.machine))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
    const naturalFoods = Array.from(new Set(sourceProfiles.flatMap((profile) => Object.entries(profile.outputs).filter(([, rate]) => rate.kind === 'kcal').map(([name]) => name)))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
    if (naturalFoods.length > 0) return [...crafted, '生食'];
    return crafted;
  }, [recipes, sourceProfiles]);

  const foodOptions = useMemo(() => {
    if (!selectedMachine) return [];
    if (selectedMachine === '生食') {
      return Array.from(new Set(sourceProfiles.flatMap((profile) => Object.entries(profile.outputs).filter(([, rate]) => rate.kind === 'kcal').map(([name]) => name)))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
    }
    return Array.from(new Set(recipes.filter((recipe) => recipe.machine === selectedMachine).map((recipe) => recipe.fullName))).sort((a, b) => a.localeCompare(b, 'zh-CN'));
  }, [recipes, selectedMachine, sourceProfiles]);

  useEffect(() => {
    if (bottomlessCount > dupeCount) setBottomlessCount(dupeCount);
  }, [bottomlessCount, dupeCount]);

  useEffect(() => {
    if (!machineOptions.length) {
      setSelectedMachine('');
      return;
    }
    if (!machineOptions.includes(selectedMachine)) setSelectedMachine(machineOptions[0]);
  }, [machineOptions, selectedMachine]);

  useEffect(() => {
    if (!foodOptions.length) {
      setSelectedFood('');
      return;
    }
    if (!foodOptions.includes(selectedFood)) setSelectedFood(foodOptions[0]);
  }, [foodOptions, selectedFood]);

  const hungerIndex = useMemo(() => Math.max(0, HUNGER_OPTIONS.findIndex((option) => option.label === hungerLevel)), [hungerLevel]);
  const machineIndex = useMemo(() => Math.max(0, machineOptions.findIndex((name) => name === selectedMachine)), [machineOptions, selectedMachine]);
  const foodIndex = useMemo(() => Math.max(0, foodOptions.findIndex((name) => name === selectedFood)), [foodOptions, selectedFood]);

  const result = useMemo(() => {
    if (!selectedFood) return null;
    const deltaCalories = getDeltaCalories(hungerLevel);
    const baseNeedPerDupe = Math.max(0, 1000 - deltaCalories);
    const calorieNeed = Math.max(0, dupeCount * baseNeedPerDupe + bottomlessCount * 500);
    const targetRate = calorieNeed / CYCLE_SECONDS;
    const steps: ChainStep[] = [];
    const warnings: string[] = [];
    const resolvedMaterials = new Set<string>();

    const resolveMaterial = (material: string, rate: MaterialRate, trail: string[], preferredMachine?: string, preferredRecipeFullName?: string) => {
      if (!Number.isFinite(rate.value) || rate.value <= 1e-9) return;
      if (trail.includes(material)) {
        warnings.push(`检测到循环依赖：${[...trail, material].join(' → ')}`);
        return;
      }

      if (resolvedMaterials.has(material)) return;
      resolvedMaterials.add(material);

      const producerOptions: ProducerOption[] = [];

      // 1. Check recipes
      const candidates = foodToRecipes[material] || [];
      candidates.forEach((recipe) => {
        if (recipe.output.value <= 1e-9) return;
        const count = rate.value / recipe.output.value;
        producerOptions.push({
          name: recipe.machine,
          count,
          type: 'recipe',
          inputs: Object.fromEntries(Object.entries(recipe.inputs).map(([name, inputRate]) => [name, { value: inputRate.value * count, kind: inputRate.kind }])),
        });
      });

      // 2. Check source profiles
      const producers = producerByMaterial[material] || [];
      producers.forEach((profile) => {
        const outputRate = profile.outputs[material];
        if (!outputRate || outputRate.value <= 1e-9) return;
        const count = rate.value / outputRate.value;
        producerOptions.push({
          name: profile.name,
          count,
          type: 'source',
          inputs: Object.fromEntries(Object.entries(profile.inputs).map(([name, inputRate]) => [name, { value: inputRate.value * count, kind: inputRate.kind }])),
        });
      });

      if (producerOptions.length === 0) return;

      let finalOptions = producerOptions;
      if (preferredRecipeFullName && trail.length === 1) { // trail.length === 1 means it's the target food
        const recipe = candidates.find(c => c.fullName === preferredRecipeFullName);
        if (recipe) {
          const count = rate.value / recipe.output.value;
          finalOptions = [{
            name: recipe.machine,
            count,
            type: 'recipe',
            inputs: Object.fromEntries(Object.entries(recipe.inputs).map(([name, inputRate]) => [name, { value: inputRate.value * count, kind: inputRate.kind }])),
          }];
        }
      }

      steps.push({ material, neededRate: rate, producers: finalOptions });

      const bestProducer = preferredRecipeFullName
        ? finalOptions[0]
        : finalOptions.sort((a, b) => b.count - a.count)[0];

      Object.entries(bestProducer.inputs).forEach(([name, inputRate]) => {
        resolveMaterial(name, inputRate, [...trail, material]);
      });
    };

    let targetMaterial = selectedFood;
    let preferredRecipeFullName: string | undefined;
    if (selectedMachine !== '生食') {
      const recipe = recipes.find((r) => r.fullName === selectedFood && r.machine === selectedMachine);
      if (recipe) {
        targetMaterial = recipe.name;
        preferredRecipeFullName = recipe.fullName;
      }
    }

    resolveMaterial(targetMaterial, { value: targetRate, kind: 'kcal' }, ['目标食物'], selectedMachine === '生食' ? undefined : selectedMachine, preferredRecipeFullName);

    return { calorieNeed, targetRate, steps, warnings, targetMaterial };
  }, [bottomlessCount, dupeCount, foodToRecipes, hungerLevel, producerByMaterial, selectedFood, selectedMachine, recipes]);

  return (
    <View className='page food p-8'>
      {process.env.TARO_ENV === 'h5' && <BackButton />}
      <View className='tool-card p-12 flex flex-col gap-8'>
        <View className='flex items-center gap-8'>
          <Text className='text-sm font-semibold'>复制人数量</Text>
          <View style={{ flex: 1 }} />
          <InputNumber
            value={dupeCount}
            min={0}
            step={1}
            onChange={(value) => {
              const next = Number(value);
              setDupeCount(Number.isFinite(next) ? Math.max(0, Math.round(next)) : 0);
            }}
          />
        </View>
        <View className='flex items-center gap-8'>
          <Text className='text-sm font-semibold'>无底胃人数</Text>
          <View style={{ flex: 1 }} />
          <InputNumber
            value={bottomlessCount}
            min={0}
            max={dupeCount}
            step={1}
            onChange={(value) => {
              const next = Number(value);
              const normalized = Number.isFinite(next) ? Math.max(0, Math.round(next)) : 0;
              setBottomlessCount(Math.min(normalized, dupeCount));
            }}
          />
        </View>
        <View className='flex items-center gap-8'>
          <Text className='text-sm font-semibold'>游戏难度</Text>
          <View style={{ flex: 1 }} />
          <Picker
            mode='selector'
            range={HUNGER_OPTIONS.map(option => option.label)}
            value={hungerIndex}
            onChange={(event) => {
              const nextIndex = Number(event.detail.value);
              if (Number.isNaN(nextIndex)) return;
              const nextOption = HUNGER_OPTIONS[nextIndex];
              if (nextOption?.label) setHungerLevel(nextOption.label as HungerLevel);
            }}
          >
            <View className='flex items-center justify-center gap-4 border border-gray px-8 py-4 rounded-4'>
              <Text className='text-primary font-bold text-xs'>{hungerLevel}</Text>
              <ArrowRight size={12} />
            </View>
          </Picker>
        </View>
      </View>

      <View className='tool-card mt-8 p-12 flex flex-col gap-8'>
        <View className='flex items-center gap-8'>
          <Text className='text-sm font-semibold'>制作机器</Text>
          <View style={{ flex: 1 }} />
          <Picker
            mode='selector'
            range={machineOptions}
            value={machineIndex}
            onChange={(event) => {
              const nextIndex = Number(event.detail.value);
              if (Number.isNaN(nextIndex)) return;
              const nextMachine = machineOptions[nextIndex];
              if (nextMachine) setSelectedMachine(nextMachine);
            }}
          >
            <View className='flex items-center justify-center gap-4 border border-gray px-8 py-4 rounded-4'>
              {selectedMachine ? renderIcon(selectedMachine, undefined, 14) : null}
              <Text className='text-primary font-bold text-xs'>{selectedMachine || '-'}</Text>
              <ArrowRight size={12} />
            </View>
          </Picker>
        </View>
        <View className='flex items-center gap-8'>
          <Text className='text-sm font-semibold'>目标食物</Text>
          <View style={{ flex: 1 }} />
          <Picker
            mode='selector'
            range={foodOptions}
            value={foodIndex}
            onChange={(event) => {
              const nextIndex = Number(event.detail.value);
              if (Number.isNaN(nextIndex)) return;
              const nextFood = foodOptions[nextIndex];
              if (nextFood) setSelectedFood(nextFood);
            }}
          >
            <View className='flex items-center justify-center gap-4 border border-gray px-8 py-4 rounded-4'>
              {selectedFood ? renderIcon(selectedFood, undefined, 14) : null}
              <Text className='text-primary font-bold text-xs'>{selectedFood || '-'}</Text>
              <ArrowRight size={12} />
            </View>
          </Picker>
        </View>
      </View>

      <View className='tool-card mt-8 p-12 flex flex-col gap-8'>
        {loading && <Text className='text-sm'>数据加载中...</Text>}
        {!loading && error && <Text className='text-sm text-danger'>数据加载失败：{error.message}</Text>}
        {!loading && !error && !selectedFood && <Text className='text-sm'>暂无可计算食物</Text>}
        {!loading && !error && result && (
          <>
            <Text className='text-sm font-semibold'>每日需求</Text>
            <View className='table-row simple'>
              <Text className='text-xs'>总卡路里</Text>
              <Text className='text-xs'>{formatNumber(result.calorieNeed)} 千卡/周期</Text>
            </View>
            <View className='table-row simple'>
              <Text className='text-xs'>目标食物</Text>
              <View className='flex items-center gap-4'>
                {renderIcon(result.targetMaterial, undefined, 14)}
                <Text className='text-xs'>{result.targetMaterial}</Text>
              </View>
            </View>
            <View className='table-row simple'>
              <Text className='text-xs'>目标产出</Text>
              <Text className='text-xs'>{formatRate(result.targetRate, 'kcal')}</Text>
            </View>

            <Text className='text-sm font-semibold mt-8'>生产链选项</Text>
            {result.steps.length === 0 && <Text className='text-xs'>无内部链路，全部按外部输入处理</Text>}
            <View className='flex flex-col gap-12'>
              {result.steps.map((step) => (
                <View key={step.material} className='producer-card p-12 border border-gray rounded-8 bg-gray-100'>
                  <View className='flex items-center gap-4 mb-8 border-b border-gray pb-4'>
                    {renderIcon(step.material, undefined, 18)}
                    <Text className='text-sm font-bold'>{step.material}</Text>
                    <View style={{ flex: 1 }} />
                    <Text className='text-xs text-gray'>需求: {formatRate(step.neededRate.value, step.neededRate.kind)}</Text>
                  </View>
                  <View className='flex flex-col gap-8'>
                    {step.producers.map((producer, pIndex) => (
                      <View key={`${producer.name}-${pIndex}`} className='flex flex-col gap-4 p-8 bg-white rounded-4'>
                        <View className='flex items-center gap-4'>
                          {renderIcon(producer.name, undefined, 14)}
                          <Text className='text-xs font-semibold'>{producer.name}</Text>
                          <Text className='text-xs text-primary'>× {formatNumber(producer.count)}</Text>
                        </View>
                        {Object.keys(producer.inputs).length > 0 && (
                          <View className='flex flex-wrap gap-x-8 gap-y-4 mt-4'>
                            {Object.entries(producer.inputs).map(([inputName, inputRate]) => (
                              <View key={inputName} className='flex items-center gap-2'>
                                {renderIcon(inputName, undefined, 12)}
                                <Text className='text-xs'>{inputName}: {formatRate(inputRate.value, inputRate.kind)}</Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {result.warnings.length > 0 && (
              <View className='flex flex-col gap-4 mt-8'>
                <Text className='text-sm font-semibold'>提示</Text>
                {result.warnings.map((warning, index) => (
                  <Text key={`warning-${index}`} className='text-xs text-danger'>{warning}</Text>
                ))}
              </View>
            )}
          </>
        )}
      </View>
      <GlobalSvgFilters />
    </View>
  );
}
