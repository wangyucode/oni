import { Text, View } from "@tarojs/components";
import { InputNumber } from "@nutui/nutui-react-taro";

import FilteredImage from "@/components/ui/FilteredImage";

export type SelectionDetailHeaderProps = {
  icon?: string;
  iconFilter?: string;
  name: string;
  count: number;
  onCountChange: (nextCount: number) => void;
};

export default function SelectionDetailHeader({
  icon,
  iconFilter,
  name,
  count,
  onCountChange,
}: SelectionDetailHeaderProps) {
  return (
    <View className="flex items-center gap-8">
      {icon ? (
        <FilteredImage src={icon} iconFilter={iconFilter} className="w-48 h-48" mode="aspectFit" />
      ) : null}
      <Text className="text-md font-semibold">{name}</Text>
      <View style={{ flex: 1 }} />
      <View className="flex justify-end gap-16">
        <InputNumber
          value={count}
          min={0}
          onChange={(value) => {
            const next = Number(value);
            onCountChange(Number.isFinite(next) ? Math.max(0, next) : 0);
          }}
        />
      </View>
    </View>
  );
}
