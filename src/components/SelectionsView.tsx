import { Text, View } from "@tarojs/components";
import { Badge } from "@nutui/nutui-react-taro";

import Icon from "./icons";
import FilteredImage from "./FilteredImage";
import { SelectionEntry } from "./SelectionsContext";
import { IconData } from "./DataContext";
import { getIconData } from "./utils";
import { normalizeModeSelections } from "./selection/modeSelection";

interface SelectionsViewProps {
  selections: SelectionEntry[];
  iconMap: Map<string, IconData>;
  onSelect: (entry: SelectionEntry) => void;
}

function buildSummary(entry: SelectionEntry): string {
  const detailAny = entry.detail as any;
  const modes = Array.isArray(detailAny?.modes) ? detailAny.modes : [];
  const normalized = normalizeModeSelections(entry.detail, entry.modeSelections);
  const parts = modes
    .map((mode: any, idx: number) => {
      const name = String(mode?.name || "");
      const options = Array.isArray(mode?.options) ? mode.options : [];
      const fallback = options[0]?.name || "";
      const selected = normalized[idx] || fallback;
      if (!name || !selected) return "";
      return `${name}：${selected}`;
    })
    .filter(Boolean);

  if (entry.efficiency !== undefined && entry.efficiency !== 100) {
    parts.unshift(`效率：${entry.efficiency}%`);
  }

  return parts.length ? parts.join(" ｜ ") : "无模式";
}

export default function SelectionsView({ selections, iconMap, onSelect }: SelectionsViewProps) {
  if (!selections.length) {
    return (
      <View className="p-16 text-center text-muted">
        <Text>暂无选择，先添加再编辑。</Text>
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-8">
      {selections.map((entry) => {
        const iconData = getIconData(iconMap, entry.item.name, entry.item.icon);
        const summary = buildSummary(entry);
        return (
          <View
            className="flex items-center gap-12 p-8 px-10 rounded-10 bg-gray-100 active-bg-gray-200"
            key={entry.key}
            onClick={() => onSelect(entry)}
          >
            <Badge value={entry.count} max={999}>
              {iconData?.icon ? (
                <FilteredImage
                  src={iconData.icon}
                  iconFilter={iconData.iconFilter}
                  className="w-40 h-40"
                  mode="aspectFit"
                />
              ) : (
                <Icon name={entry.item.name} width={40} height={40} />
              )}
            </Badge>
            <View className="flex flex-col gap-4 flex-1">
              <Text className="text-sm font-semibold text-ink">{entry.item.name}</Text>
              <Text className="text-xs text-muted">{summary}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
