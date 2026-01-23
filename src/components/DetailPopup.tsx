import { useMemo } from "react";
import { View } from "@tarojs/components";
import { Popup } from "@nutui/nutui-react-taro";

import { DetailLink } from "./data";
import LinkDetailView from "./LinkDetailView";
import { SelectionEntry } from "./SelectionsContext";

interface DetailPopupProps {
  visible: boolean;
  entry: SelectionEntry | null;
  onClose: () => void;
}

export default function DetailPopup({ visible, entry, onClose }: DetailPopupProps) {
  const link = useMemo<DetailLink | null>(() => {
    if (!entry) return null;
    return {
      name: entry.item.name,
      icon: entry.item.icon || "",
      detail: entry.detail,
    };
  }, [entry]);

  return (
    <Popup
      className="popup-root"
      visible={visible && Boolean(entry)}
      position="bottom"
      title={entry?.item.name || "详情"}
      onClose={onClose}
      closeable
      style={{ height: "50%", paddingBottom: process.env.TARO_ENV === "h5" ? 50 : 0 }}
    >
      <View className="flex-1 p-8 overflow-y-auto">
        {entry && link ? (
          <LinkDetailView
            link={link}
            categoryPath={entry.categoryPath}
            mode="edit"
            editKey={entry.key}
            initialCount={entry.count}
            initialModeSelections={entry.modeSelections}
            initialEfficiency={entry.efficiency}
            onConfirmed={onClose}
          />
        ) : null}
      </View>
    </Popup>
  );
}
