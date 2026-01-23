import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Badge, Button, Popup } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";

import "./EditPopup.scss";
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

function buildModeSummary(entry: SelectionEntry): string {
  const detailAny = entry.detail as any;
  const modes = Array.isArray(detailAny?.modes) ? detailAny.modes : [];
  if (!modes.length) return "无模式";
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
  return parts.length ? parts.join(" · ") : "无模式";
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
      className="edit-popup"
      visible={visible}
      position="bottom"
      title={title}
      onClose={handleClose}
      left={selectedEntry ? <Button className="back" onClick={handleGoBack}><ArrowLeft size={16} />返回</Button> : null}
      closeable
      style={{ height: "50%", paddingBottom: process.env.TARO_ENV === "h5" ? 50 : 0 }}
    >
      <View className="content">
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
            onConfirmed={handleGoBack}
          />
        ) : selections.length ? (
          <View className="edit-popup__list">
            {selections.map((entry) => {
              const iconData = getIconData(iconMap, entry.item.name, entry.item.icon);
              const modeSummary = buildModeSummary(entry);
              return (
                <View
                  className="edit-popup__item"
                  key={entry.key}
                  onClick={() => setSelectedEntry(entry)}
                >
                  <Badge value={entry.count} max={999}>
                    {iconData?.icon ? (
                      <FilteredImage
                        src={iconData.icon}
                        iconFilter={iconData.iconFilter}
                        className="edit-popup__icon"
                        mode="aspectFit"
                      />
                    ) : (
                      <Icon name={entry.item.name} width={40} height={40} />
                    )}
                  </Badge>
                  <View className="edit-popup__meta">
                    <Text className="edit-popup__name">{entry.item.name}</Text>
                    <Text className="edit-popup__modes">{modeSummary}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View className="edit-popup__empty">
            <Text>暂无选择，先添加再编辑。</Text>
          </View>
        )}
      </View>
    </Popup>
  );
}
