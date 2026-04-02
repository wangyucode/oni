import { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import { Button, InputNumber } from '@nutui/nutui-react-taro';
import BackButton from '@/components/ui/BackButton';
import FilteredImage from '@/components/ui/FilteredImage';
import GlobalSvgFilters from '@/components/ui/GlobalSvgFilters';
import { DataContext } from '@/contexts/DataContext';
import { CYCLE_SECONDS, HUNGER_OPTIONS, HungerLevel, useUnit } from '@/contexts/UnitContext';
import { buildDefaultModeSelections } from '@/components/selection/modeSelection';
import { calculateSelectionTotals, ResourceUnitKind } from '@/components/selection/calc';
import { Link, LinkDetail, Menu } from '@/types/data';
import { getIconData } from '@/utils/utils';
import './food.scss';

type Profile = {
  name: string;
  icon?: string;
  category: '建筑' | '小动物' | '植物';
  inputs: Record<string, number>;
  outputs: Record<string, number>;
  inputKinds: Record<string, ResourceUnitKind>;
  outputKinds: Record<string, ResourceUnitKind>;
  recipeLabel?: string;
};

type FoodRow = {
  id: string;
  recipeLabel: string;
  share: number;
};

type RecipeStep = {
  material: string;
  producer: string;
  count: number;
  depth: number;
};

const FOOD_BUILDING_KEYWORDS = ['电烤炉', '油炸锅', '敲蛋桌', '燃气灶', '食物压制器', '熏炉'];

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

import { getEffectiveModes, buildDefaultModeSelection, normalizeModeSelections } from '@/components/selection/modeSelection';

function toProfiles(link: Link, category: '建筑' | '小动物' | '植物'): Profile[] {
  const detail = link.detail as LinkDetail;
  const isPlant = category === '植物';

  const modes = getEffectiveModes(detail);
  if (!modes || modes.length === 0) {
    return [toProfileWithModes(link, category, {})];
  }

  // 为每个模式的每个选项生成一个 profile
  // 这样可以覆盖所有可能的配方
  const profiles: Profile[] = [];
  const seenLabels = new Set<string>();

  modes.forEach(mode => {
    mode.options.forEach(option => {
      const modeSelections: Record<string, string> = {};
      modes.forEach(m => {
        modeSelections[m.name] = m.name === mode.name ? option.name : buildDefaultModeSelection(m);
      });
      const profile = toProfileWithModes(link, category, modeSelections);
      if (profile.recipeLabel && !seenLabels.has(profile.recipeLabel)) {
        profiles.push(profile);
        seenLabels.add(profile.recipeLabel);
      }
    });
  });

  return profiles;
}

function toProfileWithModes(link: Link, category: '建筑' | '小动物' | '植物', modeSelections: Record<string, string>): Profile {
  const detail = link.detail as LinkDetail;
  const isPlant = category === '植物';
  const normalizedSelections = normalizeModeSelections(detail, modeSelections);
  const totals = calculateSelectionTotals(detail, 1, normalizedSelections, 100, 0, 0, { isPlant });

  const inputs: Record<string, number> = {};
  const outputs: Record<string, number> = {};
  const inputKinds: Record<string, ResourceUnitKind> = {};
  const outputKinds: Record<string, ResourceUnitKind> = {};

  Object.entries(totals.resources).forEach(([name, value]) => {
    const kind = totals.resourceKinds[name] || 'mass';
    if (value < 0) {
      addAmount(inputs, name, -value);
      inputKinds[name] = kind;
    }
    if (value > 0) {
      addAmount(outputs, name, value);
      outputKinds[name] = kind;
    }
  });

  // 生成配方标签
  let recipeLabel = '';
  const outputKcal = Object.entries(outputKinds).find(([_, kind]) => kind === 'kcal');
  if (outputKcal) {
    const foodName = outputKcal[0];
    const inputNames = Object.keys(inputs);
    if (inputNames.length > 0) {
      recipeLabel = `${inputNames.join(' + ')} = ${foodName}`;
    } else {
      recipeLabel = `${foodName} (${link.name})`;
    }
  }

  return {
    name: link.name,
    icon: link.icon,
    category,
    inputs,
    outputs,
    inputKinds,
    outputKinds,
    recipeLabel,
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

function formatCount(valuePerSecond: number, timeUnit: '秒' | '周期') {
  const value = timeUnit === '周期' ? valuePerSecond * CYCLE_SECONDS : valuePerSecond;
  return `${formatNumber(value)} 单位/${timeUnit}`;
}

function formatCalories(valuePerSecond: number, timeUnit: '秒' | '周期') {
  const value = timeUnit === '周期' ? valuePerSecond * CYCLE_SECONDS : valuePerSecond;
  return `${formatNumber(value)} 千卡/${timeUnit}`;
}

function createRow(recipeLabel: string): FoodRow {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    recipeLabel,
    share: 100,
  };
}

export default function Food() {
  const { data, iconMap, loading, error } = useContext(DataContext);
  const { timeUnit, hungerLevel } = useUnit();
  const [dupeCount, setDupeCount] = useState<number>(8);
  const [selectedHunger, setSelectedHunger] = useState(hungerLevel);
  const [foodRows, setFoodRows] = useState<FoodRow[]>([]);

  const renderIcon = (name: string, icon?: string, size = 20) => {
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

  const buildingMenu = useMemo(() => findChildMenu(data, '建筑'), [data]);
  const animalMenu = useMemo(() => findChildMenu(data, '小动物'), [data]);
  const plantMenu = useMemo(() => findChildMenu(data, '植物'), [data]);

  const buildingProfiles = useMemo(
    () => collectLinks(buildingMenu).flatMap((link) => toProfiles(link, '建筑')),
    [buildingMenu]
  );

  const sourceProfiles = useMemo(() => {
    const animalProfiles = collectLinks(animalMenu).flatMap((link) => toProfiles(link, '小动物'));
    const plantProfiles = collectLinks(plantMenu).flatMap((link) => toProfiles(link, '植物'));
    return [...animalProfiles, ...plantProfiles];
  }, [animalMenu, plantMenu]);

  const recipeProfiles = useMemo(() => {
    const allProfiles = [...buildingProfiles, ...sourceProfiles];
    return allProfiles
      .filter((profile) => {
        if (FOOD_BUILDING_KEYWORDS.some((keyword) => profile.name.includes(keyword))) return true;
        return Object.entries(profile.outputKinds).some(([material, kind]) => kind === 'kcal' && (profile.outputs[material] || 0) > 0);
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  }, [buildingProfiles, sourceProfiles]);

  const foodOptions = useMemo(() => {
    const options: { label: string; material: string }[] = [];
    recipeProfiles.forEach((recipe) => {
      Object.entries(recipe.outputKinds).forEach(([material, kind]) => {
        if (kind !== 'kcal' || (recipe.outputs[material] || 0) <= 0) return;
        if (recipe.recipeLabel) {
          options.push({ label: recipe.recipeLabel, material });
        }
      });
    });
    return options.sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));
  }, [recipeProfiles]);

  useEffect(() => {
    if (!foodOptions.length) {
      setFoodRows([]);
      return;
    }
    setFoodRows((prev) => {
      const valid = prev.filter((row) => foodOptions.some((option) => option.label === row.recipeLabel));
      if (valid.length > 0) return valid;
      return [createRow(foodOptions[0].label)];
    });
  }, [foodOptions]);

  const recipeByMaterial = useMemo(() => {
    const map: Record<string, Profile[]> = {};
    recipeProfiles.forEach((recipe) => {
      Object.entries(recipe.outputs).forEach(([material, value]) => {
        if (value <= 0) return;
        map[material] = map[material] || [];
        map[material].push(recipe);
      });
    });
    return map;
  }, [recipeProfiles]);

  const sourceByMaterial = useMemo(() => {
    const map: Record<string, Profile[]> = {};
    sourceProfiles.forEach((profile) => {
      Object.entries(profile.outputs).forEach(([material, value]) => {
        if (value <= 0) return;
        const kind = profile.outputKinds[material] || 'mass';
        if (kind === 'kcal') return;
        map[material] = map[material] || [];
        map[material].push(profile);
      });
    });
    return map;
  }, [sourceProfiles]);

  const hungerOptions = useMemo(() => HUNGER_OPTIONS.map((item) => item.label as HungerLevel), []);
  const hungerInfo = useMemo(
    () => HUNGER_OPTIONS.find((item) => item.label === selectedHunger) || HUNGER_OPTIONS[2],
    [selectedHunger]
  );

  const calorieNeedPerDupeCycle = useMemo(() => Math.max(0, 1000 - hungerInfo.calorieDelta), [hungerInfo.calorieDelta]);
  const totalCalorieNeedPerCycle = useMemo(() => Math.max(0, dupeCount) * calorieNeedPerDupeCycle, [calorieNeedPerDupeCycle, dupeCount]);
  const totalCalorieNeedPerSecond = useMemo(() => totalCalorieNeedPerCycle / CYCLE_SECONDS, [totalCalorieNeedPerCycle]);

  const normalizedFoodRows = useMemo(() => {
    const validRows = foodRows.filter((row) => row.recipeLabel);
    if (!validRows.length) return [];
    const totalShare = validRows.reduce((sum, row) => sum + Math.max(0, row.share), 0);
    const fallbackShare = 100 / validRows.length;
    return validRows.map((row) => {
      const normalized = totalShare > 0 ? (Math.max(0, row.share) / totalShare) * 100 : fallbackShare;
      return { ...row, normalizedShare: normalized };
    });
  }, [foodRows]);

  const ratioTotal = useMemo(() => foodRows.reduce((sum, row) => sum + Math.max(0, row.share), 0), [foodRows]);
  const ratioHint = useMemo(() => {
    if (!normalizedFoodRows.length) return '';
    if (Math.abs(ratioTotal - 100) <= 0.01) return '';
    return `当前占比之和为 ${formatNumber(ratioTotal)}%，已自动归一化到 100%`;
  }, [normalizedFoodRows, ratioTotal]);

  const result = useMemo(() => {
    const foodDemand: Record<string, number> = {};
    const materialDemand: Record<string, number> = {};
    const materialKinds: Record<string, ResourceUnitKind> = {};
    const recipeCounts: Record<string, number> = {};
    const recipeSteps: RecipeStep[] = [];
    const sourceAnimalCounts: Record<string, { theoretical: number; rounded: number }> = {};
    const sourcePlantCounts: Record<string, { theoretical: number; rounded: number }> = {};
    const gaps: string[] = [];

    if (totalCalorieNeedPerSecond <= 0 || normalizedFoodRows.length === 0) {
      return {
        foodDemand,
        materialDemand,
        materialKinds,
        recipeCounts,
        recipeSteps,
        sourceAnimalCounts,
        sourcePlantCounts,
        gaps,
      };
    }

    const resolveMaterial = (material: string, amount: number, kind: ResourceUnitKind, trail: string[], preferredRecipeLabel?: string) => {
      if (!Number.isFinite(amount) || amount <= 1e-9) return;
      addAmount(materialDemand, material, amount);
      materialKinds[material] = kind;

      if (trail.includes(material)) {
        gaps.push(`检测到循环配方：${[...trail, material].join(' → ')}，已停止展开`);
        return;
      }

      const producers = recipeByMaterial[material] || [];
      let producer = preferredRecipeLabel ? producers.find(p => p.recipeLabel === preferredRecipeLabel) : undefined;
      if (!producer) {
        producer = producers
          .filter((item) => (item.outputs[material] || 0) > 0)
          .sort((a, b) => (b.outputs[material] || 0) - (a.outputs[material] || 0))[0];
      }
      if (!producer) return;

      const outputRate = producer.outputs[material] || 0;
      if (outputRate <= 0) return;
      const count = amount / outputRate;
      addAmount(recipeCounts, producer.name, count);
      recipeSteps.push({
        material,
        producer: producer.name,
        count,
        depth: trail.length,
      });

      Object.entries(producer.inputs).forEach(([inputMaterial, inputNeed]) => {
        const inputKind = producer.inputKinds[inputMaterial] || 'mass';
        resolveMaterial(inputMaterial, inputNeed * count, inputKind, [...trail, material]);
      });
    };

    normalizedFoodRows.forEach((row) => {
      const option = foodOptions.find(opt => opt.label === row.recipeLabel);
      if (!option) return;
      const need = totalCalorieNeedPerSecond * (row.normalizedShare / 100);
      addAmount(foodDemand, option.material, need);
      resolveMaterial(option.material, need, 'kcal', ['目标食物'], row.recipeLabel);
    });

    Object.entries(materialDemand).forEach(([material, demand]) => {
      const kind = materialKinds[material] || 'mass';
      const producers = sourceByMaterial[material] || [];
      const source = producers
        .filter((item) => (item.outputs[material] || 0) > 0)
        .sort((a, b) => (b.outputs[material] || 0) - (a.outputs[material] || 0))[0];
      if (!source) {
        if ((recipeByMaterial[material] || []).length === 0 && kind !== 'kcal') gaps.push(`${material} 缺少动物/植物来源，请补充外部输入`);
        return;
      }
      const outputRate = source.outputs[material] || 0;
      if (outputRate <= 0) {
        gaps.push(`${source.name} 对 ${material} 的产量无效`);
        return;
      }
      const theoretical = demand / outputRate;
      const rounded = Math.ceil(theoretical);
      const targetMap = source.category === '小动物' ? sourceAnimalCounts : sourcePlantCounts;
      const current = targetMap[source.name] || { theoretical: 0, rounded: 0 };
      targetMap[source.name] = {
        theoretical: current.theoretical + theoretical,
        rounded: current.rounded + rounded,
      };
    });

    return {
      foodDemand,
      materialDemand,
      materialKinds,
      recipeCounts,
      recipeSteps,
      sourceAnimalCounts,
      sourcePlantCounts,
      gaps: Array.from(new Set(gaps)),
    };
  }, [normalizedFoodRows, recipeByMaterial, sourceByMaterial, totalCalorieNeedPerSecond, foodOptions]);

  const foodNeedRows = useMemo(() => {
    return Object.entries(result.foodDemand)
      .map(([foodName, value]) => ({ foodName, value }))
      .sort((a, b) => b.value - a.value);
  }, [result.foodDemand]);

  const recipeCountRows = useMemo(() => {
    return Object.entries(result.recipeCounts)
      .map(([name, value]) => ({ name, value, rounded: Math.ceil(value) }))
      .sort((a, b) => b.value - a.value);
  }, [result.recipeCounts]);

  const sourceAnimalRows = useMemo(() => {
    return Object.entries(result.sourceAnimalCounts)
      .map(([name, value]) => ({ name, ...value }))
      .sort((a, b) => b.theoretical - a.theoretical);
  }, [result.sourceAnimalCounts]);

  const sourcePlantRows = useMemo(() => {
    return Object.entries(result.sourcePlantCounts)
      .map(([name, value]) => ({ name, ...value }))
      .sort((a, b) => b.theoretical - a.theoretical);
  }, [result.sourcePlantCounts]);

  const materialDemandRows = useMemo(() => {
    return Object.entries(result.materialDemand)
      .map(([name, value]) => ({
        name,
        value,
        kind: result.materialKinds[name] || 'mass',
      }))
      .sort((a, b) => b.value - a.value);
  }, [result.materialDemand, result.materialKinds]);

  const addFoodRow = () => {
    if (!foodOptions.length) return;
    setFoodRows((prev) => [...prev, createRow(foodOptions[0].label)]);
  };

  const removeFoodRow = (id: string) => {
    setFoodRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((row) => row.id !== id);
    });
  };

  const updateFoodRow = (id: string, patch: Partial<FoodRow>) => {
    setFoodRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const formatByKind = (valuePerSecond: number, kind: ResourceUnitKind) => {
    if (kind === 'kcal') return formatCalories(valuePerSecond, timeUnit);
    if (kind === 'count') return formatCount(valuePerSecond, timeUnit);
    return formatMass(valuePerSecond, timeUnit);
  };

  return (
    <View className='page food p-8'>
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
        <View className='flex items-center gap-8'>
          <Text className='text-sm'>饥饿难度</Text>
          <Picker
            mode='selector'
            range={hungerOptions}
            value={Math.max(0, hungerOptions.indexOf(selectedHunger))}
            onChange={(e) => {
              const index = Number(e.detail.value);
              const next = hungerOptions[index];
              if (next) setSelectedHunger(next);
            }}
          >
            <View className='picker-chip'>{selectedHunger}</View>
          </Picker>
        </View>
        <Text className='text-sm text-gray-600'>单人每周期需求：{formatNumber(calorieNeedPerDupeCycle)} 千卡</Text>
        <Text className='text-sm text-danger'>总目标：{formatNumber(totalCalorieNeedPerCycle)} 千卡/周期</Text>
      </View>

      <View className='tool-card p-12 flex flex-col gap-8'>
        <Text className='text-md font-semibold'>目标食物与占比</Text>
        {loading && <Text className='text-sm text-muted'>加载中...</Text>}
        {!loading && error && <Text className='text-sm text-danger'>数据加载失败：{error.message}</Text>}
        {!loading && !error && foodOptions.length === 0 && <Text className='text-sm text-muted'>未找到可用食物配方</Text>}
        {foodRows.map((row) => {
          const material = foodOptions.find(opt => opt.label === row.recipeLabel)?.material || '';
          return (
            <View key={row.id} className='material-item p-8 flex flex-col gap-6'>
              <View className='flex items-center gap-6'>
                <Text className='text-sm'>食物</Text>
                <Picker
                  mode='selector'
                  range={foodOptions.map((item) => item.label)}
                  value={Math.max(0, foodOptions.findIndex((item) => item.label === row.recipeLabel))}
                  onChange={(e) => {
                    const index = Number(e.detail.value);
                    const next = foodOptions[index]?.label;
                    if (next) updateFoodRow(row.id, { recipeLabel: next });
                  }}
                >
                  <View className='picker-chip flex items-center gap-4'>
                    {renderIcon(material, undefined, 16)}
                    <Text>{row.recipeLabel || '请选择'}</Text>
                  </View>
                </Picker>
                <View style={{ flex: 1 }} />
                <Button size='small' type='primary' fill='none' onClick={() => removeFoodRow(row.id)}>删除</Button>
              </View>
              <View className='flex items-center gap-8'>
                <Text className='text-sm'>占比(%)</Text>
                <InputNumber
                  value={row.share}
                  min={0}
                  step={1}
                  onChange={(value) => {
                    const next = Number(value);
                    updateFoodRow(row.id, { share: Number.isFinite(next) ? Math.max(0, next) : 0 });
                  }}
                />
                <Text className='text-xs text-gray-600'>
                  归一化后：{formatNumber(normalizedFoodRows.find((item) => item.id === row.id)?.normalizedShare || 0)}%
                </Text>
              </View>
            </View>
          );
        })}
        <View className='flex items-center gap-8'>
          <Button size='small' type='primary' onClick={addFoodRow}>添加食物</Button>
          {ratioHint && <Text className='text-xs text-danger'>{ratioHint}</Text>}
        </View>
      </View>

      <View className='tool-card p-12 flex flex-col gap-8'>
        <Text className='text-md font-semibold'>总览</Text>
        <Text className='text-sm'>目标总卡路里：{formatNumber(totalCalorieNeedPerCycle)} 千卡/周期</Text>
        <View className='flex flex-col gap-4'>
          {foodNeedRows.map((item) => (
            <View key={`food-${item.foodName}`} className='table-row simple'>
              <View className='flex items-center gap-4'>
                {renderIcon(item.foodName, undefined, 14)}
                <Text className='text-xs'>{item.foodName}</Text>
              </View>
              <Text className='text-xs'>{formatCalories(item.value, timeUnit)}</Text>
            </View>
          ))}
          {foodNeedRows.length === 0 && <Text className='text-sm text-muted'>无</Text>}
        </View>
        <Text className='text-sm font-semibold'>食物建筑规模</Text>
        <View className='flex flex-col gap-4'>
          {recipeCountRows.map((item) => (
            <View key={`recipe-${item.name}`} className='table-row simple'>
              <View className='flex items-center gap-4'>
                {renderIcon(item.name, undefined, 14)}
                <Text className='text-xs'>{item.name}</Text>
              </View>
              <Text className='text-xs'>理论 {formatNumber(item.value)} / 向上取整 {item.rounded}</Text>
            </View>
          ))}
          {recipeCountRows.length === 0 && <Text className='text-sm text-muted'>无</Text>}
        </View>
      </View>

      <View className='tool-card p-12 flex flex-col gap-8'>
        <Text className='text-md font-semibold'>养殖建议</Text>
        <Text className='text-sm font-semibold'>动物</Text>
        <View className='flex flex-col gap-4'>
          {sourceAnimalRows.map((item) => (
            <View key={`animal-${item.name}`} className='table-row simple'>
              <View className='flex items-center gap-4'>
                {renderIcon(item.name, undefined, 14)}
                <Text className='text-xs'>{item.name}</Text>
              </View>
              <Text className='text-xs'>理论 {formatNumber(item.theoretical)} / 向上取整 {item.rounded}</Text>
            </View>
          ))}
          {sourceAnimalRows.length === 0 && <Text className='text-sm text-muted'>暂无</Text>}
        </View>
        <Text className='text-sm font-semibold'>植物</Text>
        <View className='flex flex-col gap-4'>
          {sourcePlantRows.map((item) => (
            <View key={`plant-${item.name}`} className='table-row simple'>
              <View className='flex items-center gap-4'>
                {renderIcon(item.name, undefined, 14)}
                <Text className='text-xs'>{item.name}</Text>
              </View>
              <Text className='text-xs'>理论 {formatNumber(item.theoretical)} / 向上取整 {item.rounded}</Text>
            </View>
          ))}
          {sourcePlantRows.length === 0 && <Text className='text-sm text-muted'>暂无</Text>}
        </View>
      </View>

      <View className='tool-card p-12 flex flex-col gap-8'>
        <Text className='text-md font-semibold'>配方缺口</Text>
        {result.gaps.map((gap, index) => (
          <Text key={`gap-${index}`} className='text-sm text-danger'>{gap}</Text>
        ))}
        {result.gaps.length === 0 && <Text className='text-sm text-success'>未发现缺口</Text>}
      </View>

      <View className='tool-card p-12 flex flex-col gap-8'>
        <Text className='text-md font-semibold'>材料需求明细</Text>
        {materialDemandRows.map((row) => (
          <View key={`material-${row.name}`} className='table-row simple'>
            <View className='flex items-center gap-4'>
              {renderIcon(row.name, undefined, 14)}
              <Text className='text-xs'>{row.name}</Text>
            </View>
            <Text className='text-xs'>{formatByKind(row.value, row.kind)}</Text>
          </View>
        ))}
        {materialDemandRows.length === 0 && <Text className='text-sm text-muted'>无</Text>}
      </View>

      <View className='tool-card p-12 flex flex-col gap-8'>
        <Text className='text-md font-semibold'>配方链路</Text>
        {result.recipeSteps.map((step, index) => (
          <View key={`step-${index}-${step.material}-${step.producer}`} className='flex items-center gap-4'>
            <Text className='text-xs'>{'　'.repeat(Math.min(step.depth, 6))}</Text>
            {renderIcon(step.material, undefined, 14)}
            <Text className='text-xs'>{step.material} ← </Text>
            {renderIcon(step.producer, undefined, 14)}
            <Text className='text-xs'>{step.producer} × {formatNumber(step.count)}</Text>
          </View>
        ))}
        {result.recipeSteps.length === 0 && <Text className='text-sm text-muted'>无</Text>}
      </View>

      <GlobalSvgFilters />
    </View>
  );
}
