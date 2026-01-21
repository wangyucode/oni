import { Text, View } from "@tarojs/components";
import { Button, InputNumber } from "@nutui/nutui-react-taro";

import FilteredImage from "../FilteredImage";

export type SelectionDetailHeaderProps = {
  icon?: string;
  iconFilter?: string;
  name: string;
  count: number;
  actionLabel: string;
  onCountChange: (nextCount: number) => void;
  onAction: () => void;
};

export default function SelectionDetailHeader({
  icon,
  iconFilter,
  name,
  count,
  actionLabel,
  onCountChange,
  onAction,
}: SelectionDetailHeaderProps) {
  return (
    <View className="selection-detail-view__header">
      {icon ? (
        <FilteredImage src={icon} iconFilter={iconFilter} className="selection-detail-view__icon" mode="aspectFit" />
      ) : null}
      <Text className="selection-detail-view__name">{name}</Text>
      <View style={{ flex: 1 }} />
      <View className="selection-detail-view__count">
        <InputNumber
          value={count}
          min={0}
          onChange={(value) => {
            const next = Number(value);
            onCountChange(Number.isFinite(next) ? Math.max(0, next) : 0);
          }}
        />
        <Button onClick={onAction} type="primary">
          {actionLabel}
        </Button>
      </View>
    </View>
  );
}

