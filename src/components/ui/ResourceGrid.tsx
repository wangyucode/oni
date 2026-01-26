import { useMemo, useContext } from 'react';
import { View, Text } from '@tarojs/components';
import { Grid } from '@nutui/nutui-react-taro';
import Icon from '@/components/ui/icons';
import { useUnit, transValue } from '@/contexts/UnitContext';
import { DataContext } from '@/contexts/DataContext';
import { calculateGridColumns } from '@/utils/utils';
import FilteredImage from '@/components/ui/FilteredImage';
import { ResourceUnitKind } from '@/components/selection/calc';

export interface ResourceItem {
  name: string;
  value: number;
  count: number;
  kind?: ResourceUnitKind;
}

export interface ResourceGridProps {
  items: ResourceItem[];
}

export default function ResourceGrid({ items }: ResourceGridProps) {
  const { timeUnit } = useUnit();
  const { iconMap } = useContext(DataContext);

  const aggregatedResources = useMemo(() => {
    const map = new Map<string, { value: number; kind: ResourceUnitKind }>();
    items.forEach(item => {
      const total = item.value * item.count;
      if (total !== 0) {
        const kind = item.kind || "mass";
        const existing = map.get(item.name);
        if (!existing) {
          map.set(item.name, { value: total, kind });
          return;
        }

        const mergeKind = (a: ResourceUnitKind, b: ResourceUnitKind): ResourceUnitKind => {
          if (a === b) return a;
          const order: ResourceUnitKind[] = ["mass", "kcal", "count", "growth"];
          return order.find(k => k === a || k === b) || a;
        };

        map.set(item.name, {
          value: existing.value + total,
          kind: mergeKind(existing.kind, kind)
        });
      }
    });
    return map;
  }, [items]);

  const sortedResources = useMemo(() => {
    return Array.from(aggregatedResources.entries())
      .sort(([a], [b]) => a.localeCompare(b, "zh-CN"));
  }, [aggregatedResources]);

  const convertResourceValue = (value: number, kind: ResourceUnitKind) => {
    const valueByTime = transValue(value, timeUnit);
    const absValue = Math.abs(valueByTime);

    if (kind === "count") {
      return {
        convertedValue: valueByTime,
        unit: `单位/${timeUnit}`,
      };
    }

    if (kind === "kcal") {
      return {
        convertedValue: valueByTime,
        unit: `千卡/${timeUnit}`,
      };
    }

    if (kind === "growth") {
      return {
        convertedValue: valueByTime,
        unit: `生长进度/${timeUnit}`,
      };
    }

    // Mass handling
    if (absValue >= 1000) {
      return {
        convertedValue: valueByTime / 1000,
        unit: `千克/${timeUnit}`
      };
    } else if (absValue >= 1 || absValue === 0) {
      return {
        convertedValue: valueByTime,
        unit: `克/${timeUnit}`
      };
    } else {
      return {
        convertedValue: valueByTime * 1000,
        unit: `毫克/${timeUnit}`
      };
    }
  };

  if (sortedResources.length === 0) {
    return (
      <View className="py-8 text-center text-muted">
        <Text>无</Text>
      </View>
    );
  }

  return (
    <Grid
      className="resource-grid"
      gap={0}
      columns={calculateGridColumns(sortedResources.length)}
    >
      {sortedResources.map(([name, entry]) => {
        const { convertedValue, unit } = convertResourceValue(entry.value, entry.kind);
        const formattedValue = Number(convertedValue.toFixed(2));
        const valueStr = formattedValue > 0 ? '+' + formattedValue : formattedValue.toString();
        const iconData = iconMap.get(name);
        const iconSrc = iconData?.icon;
        const iconFilter = iconData?.iconFilter;
        const type = convertedValue < 0 ? "consume" : "produce";
        return (
          <Grid.Item key={name}>
            {iconSrc ? <FilteredImage src={iconSrc} iconFilter={iconFilter} style={{ width: 48, height: 48 }} mode="aspectFit" /> : <Icon name={name} width={48} height={48} />}
            <Text className='text-xs'>{name}</Text>
            <Text className={`text-sm font-bold ${type}`}>
              {valueStr}
            </Text>
            <Text className={`text-xs ${type}`}>{unit}</Text>
          </Grid.Item>
        );
      })}
    </Grid>
  );
}
