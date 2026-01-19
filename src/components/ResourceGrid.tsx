import React, { useMemo, useContext } from 'react';
import { View, Text } from '@tarojs/components';
import { Grid, Image } from '@nutui/nutui-react-taro';
import Icon from './icons';
import { useUnit, transValue } from './UnitContext';
import { DataContext } from './DataContext';
import './ResourceGrid.scss';
import { calculateGridColumns } from './utils';

export interface ResourceItem {
  name: string;
  value: number;
  count: number;
}

export interface ResourceGridProps {
  items: ResourceItem[];
}

export default function ResourceGrid({ items }: ResourceGridProps) {
  const { weightUnit, timeUnit } = useUnit();
  const { iconMap } = useContext(DataContext);

  const aggregatedResources = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach(item => {
      const total = item.value * item.count;
      if (total !== 0) {
        map.set(item.name, (map.get(item.name) || 0) + total);
      }
    });
    return map;
  }, [items]);

  const sortedResources = useMemo(() => {
    return Array.from(aggregatedResources.entries())
      .sort(([a], [b]) => a.localeCompare(b, "zh-CN"));
  }, [aggregatedResources]);

  const convertResourceValue = (value: number) => {
    return {
      convertedValue: transValue(value, weightUnit, timeUnit),
      unit: `${weightUnit}/${timeUnit}`
    };
  };

  if (sortedResources.length === 0) {
    return (
      <View className="resource-grid__empty">
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
      {sortedResources.map(([name, value]) => {
        const { convertedValue, unit } = convertResourceValue(value);
        const valueStr = convertedValue < 0 ? Math.floor(convertedValue) : '+' + Math.floor(convertedValue);
        const iconSrc = iconMap.get(name);
        return (
          <Grid.Item key={name}>
            {iconSrc ? <Image src={iconSrc} width={48} height={48} mode="aspectFit" /> : <Icon name={name} width={48} height={48} />}
            <Text className='resource-grid__name'>{name}</Text>
            <Text className={`resource-grid__value ${convertedValue < 0 ? "consume" : "produce"}`}>
              {`${valueStr} ${unit}`}
            </Text>
          </Grid.Item>
        );
      })}
    </Grid>
  );
}
