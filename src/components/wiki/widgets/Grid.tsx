import { GridWidget } from "@/types/data";
import LargeLink from "./LargeLink";
import { View } from "@tarojs/components";

interface GridProps {
  data: GridWidget['data'];
  onPush: (key: string) => void;
}

export default function Grid({ data, onPush }: GridProps) {
  return (
    <View className="grid">
      {data.items.map((item, idx) => (
        <LargeLink key={idx} data={{ ...item, text: item.name }} onPush={onPush} />
      ))}
    </View>
  );
}