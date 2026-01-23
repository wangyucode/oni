import { useMemo, useContext } from 'react';
import { View, Text } from '@tarojs/components';
import { Grid } from '@nutui/nutui-react-taro';
import Icon from './icons';
import { useUnit, transValue } from './UnitContext';
import { DataContext } from './DataContext';
import { calculateGridColumns } from './utils';
import FilteredImage from './FilteredImage';

export interface ResourceItem {
  name: string;
  value: number;
  count: number;
  kind?: "mass" | "count";
}

export interface ResourceGridProps {
  items: ResourceItem[];
}

export default function ResourceGrid({ items }: ResourceGridProps) {
  const { timeUnit } = useUnit();
  const { iconMap } = useContext(DataContext);

  const aggregatedResources = useMemo(() => {
    const map = new Map<string, { value: number; kind: "mass" | "count" }>();
    items.forEach(item => {
      const total = item.value * item.count;
      if (total !== 0) {
        const kind = item.kind || "mass";
        const existing = map.get(item.name);
        if (!existing) {
          map.set(item.name, { value: total, kind });
          return;
        }
        map.set(item.name, {
          value: existing.value + total,
          kind: existing.kind === "mass" || kind === "mass" ? "mass" : "count"
        });
      }
    });
    return map;
  }, [items]);

  const sortedResources = useMemo(() => {
    return Array.from(aggregatedResources.entries())
      .sort(([a], [b]) => a.localeCompare(b, "zh-CN"));
  }, [aggregatedResources]);

  const convertResourceValue = (value: number, kind: "mass" | "count") => {
    if (kind === "count") {
      const convertedValue = timeUnit === "周期" ? value * 600 : value;
      return {
        convertedValue,
        unit: `单位/${timeUnit}`,
      };
    }
    const valueByTime = transValue(value, timeUnit);
    const useKg = Math.abs(valueByTime) >= 10000 || valueByTime % 1000 === 0;
    return {
      convertedValue: useKg ? valueByTime / 1000 : valueByTime,
      unit: `${useKg ? "千克" : "克"}/${timeUnit}`
    };
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
        const valueStr = convertedValue < 0 ? Math.floor(convertedValue) : '+' + Math.floor(convertedValue);
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
            <Text className={`text-10 ${type}`}>{unit}</Text>
          </Grid.Item>
        );
      })}
    </Grid>
  );
}
