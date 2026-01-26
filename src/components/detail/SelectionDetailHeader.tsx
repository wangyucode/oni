import { Text, View } from "@tarojs/components";
import { Button, InputNumber } from "@nutui/nutui-react-taro";

import FilteredImage from "@/components/ui/FilteredImage";

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
    <View className="flex items-center gap-8">
      {icon ? (
        <FilteredImage src={icon} iconFilter={iconFilter} className="w-48 h-48" mode="aspectFit" />
      ) : null}
      <Text className="text-md font-semibold">{name}</Text>
      <View style={{ flex: 1 }} />
      <View className="flex justify-end gap-16 w-120">
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

