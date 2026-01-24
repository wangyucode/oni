import { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "@tarojs/components";
import { Badge, Popup } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";



import Icon from "./icons";
import FilteredImage from "./FilteredImage";
import { SelectionEntry } from "./SelectionsContext";
import { DataContext } from "./DataContext";
import { getIconData } from "./utils";
import { normalizeModeSelections } from "./selection/modeSelection";
import LinkDetailView from "./LinkDetailView";

interface EditPopupProps {
  visible: boolean;
  selections: SelectionEntry[];
  onClose: () => void;
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

export default function EditPopup({ visible, selections, onClose }: EditPopupProps) {
  const { iconMap } = useContext(DataContext);
  const [selectedEntry, setSelectedEntry] = useState<SelectionEntry | null>(null);

  useEffect(() => {
    if (!visible) setSelectedEntry(null);
  }, [visible]);

  const title = useMemo(() => {
    return selectedEntry?.item.name || "已选条目";
  }, [selectedEntry]);

  function handleClose() {
    setSelectedEntry(null);
    onClose();
  }

  function handleGoBack() {
    setSelectedEntry(null);
  }

  return (
    <Popup
      className="popup-root"
      visible={visible}
      position="bottom"
      title={title}
      onClose={handleClose}
      left={selectedEntry ? <ArrowLeft onClick={handleGoBack} /> : null}
      closeable
      style={{ marginBottom: process.env.TARO_ENV === "h5" ? "50px" : "0" }}
    >
      <ScrollView style={{ height: "calc(100% - 48px)" }} scrollY={true}>
        <View className="p-8">
          {selectedEntry ? (
            <LinkDetailView
              link={{
                name: selectedEntry.item.name,
                icon: selectedEntry.item.icon || "",
                detail: selectedEntry.detail,
              }}
              categoryPath={selectedEntry.categoryPath}
              mode="edit"
              editKey={selectedEntry.key}
              initialCount={selectedEntry.count}
              initialModeSelections={selectedEntry.modeSelections}
              initialEfficiency={selectedEntry.efficiency}
              onConfirmed={handleClose}
            />
          ) : selections.length ? (
            <View className="flex flex-col gap-8">
              {selections.map((entry) => {
                const iconData = getIconData(iconMap, entry.item.name, entry.item.icon);
                const summary = buildSummary(entry);
                return (
                  <View
                    className="flex items-center gap-12 p-8 px-10 rounded-10 bg-gray-100 active-bg-gray-200"
                    key={entry.key}
                    onClick={() => setSelectedEntry(entry)}
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
          ) : (
            <View className="p-16 text-center text-muted">
              <Text>暂无选择，先添加再编辑。</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Popup>
  );
}
