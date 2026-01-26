import { Text, View } from "@tarojs/components";
import { Button } from "@nutui/nutui-react-taro";
import { Del, Edit } from "@nutui/icons-react-taro";

import Icon from "@/components/ui/icons";
import FilteredImage from "@/components/ui/FilteredImage";
import { SelectionEntryWithDetail } from "@/contexts/SelectionsContext";
import { IconData } from "@/contexts/DataContext";
import { getIconData } from "@/utils/utils";
import { normalizeModeSelections } from "@/components/selection/modeSelection";

interface SelectionsViewProps {
  selections: SelectionEntryWithDetail[];
  iconMap: Map<string, IconData>;
  onSelect: (entry: SelectionEntryWithDetail) => void;
  onRemove: (key: string) => void;
}

function buildSummary(entry: SelectionEntryWithDetail): string {
  const detailAny = entry.detail as any;
  const modes = Array.isArray(detailAny?.modes) ? detailAny.modes : [];
  const normalized = normalizeModeSelections(entry.detail, entry.modeSelections);
  const parts = modes
    .map((mode: any) => {
      const name = String(mode?.name || "");
      const selected = normalized[name];
      if (!name || !selected) return "";
      return `${name}：${selected}`;
    })
    .filter(Boolean);

  if (normalized["平均产量"]) {
    parts.push(`平均产量：${normalized["平均产量"]}`);
  }

  if (entry.efficiency !== undefined && entry.efficiency !== 100) {
    parts.unshift(`效率：${entry.efficiency}%`);
  }

  return parts.length ? parts.join(" ｜ ") : "无模式";
}

export default function SelectionsView({ selections, iconMap, onSelect, onRemove }: SelectionsViewProps) {
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
        const iconData = getIconData(iconMap, entry.name);
        const summary = buildSummary(entry);
        return (
          <View
            className="flex items-center gap-12 p-8 px-10 rounded-10 bg-gray-100 active-bg-gray-200"
            key={entry.key}
            onClick={() => onSelect(entry)}
          >
              {iconData?.icon ? (
                <FilteredImage
                  src={iconData.icon}
                  iconFilter={iconData.iconFilter}
                  className="w-40 h-40"
                  mode="aspectFit"
                />
              ) : (
                <Icon name={entry.name} width={40} height={40} />
              )}
            <View className="flex flex-col gap-4 flex-1">
              <View className="flex items-center gap-8">
                <Text className="text-sm font-semibold text-ink">{entry.name}</Text>
                <Text className="text-md font-semibold text-primary">x{entry.count}</Text>
                <View className="flex-1" />
                <Button
                  type="info"
                  size="small"
                  onClick={() => {
                    onSelect(entry);
                  }}
                >
                  <Edit size={16} color="#fff" />
                </Button>
                <Button
                  type="danger"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(entry.key);
                  }}
                >
                  <Del size={16} color="#fff" />
                </Button>

              </View>
              <Text className="text-xs text-muted truncate">{summary}</Text>
            </View>

          </View>
        );
      })}
    </View>
  );
}
