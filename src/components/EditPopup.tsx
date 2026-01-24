import { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import { Popup } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";

import { SelectionEntry, SelectionsActionsContext } from "./SelectionsContext";
import { DataContext } from "./DataContext";
import LinkDetailView from "./LinkDetailView";
import SelectionsView from "./SelectionsView";

interface EditPopupProps {
  visible: boolean;
  selections: SelectionEntry[];
  onClose: () => void;
}

export default function EditPopup({ visible, selections, onClose }: EditPopupProps) {
  const { iconMap } = useContext(DataContext);
  const { remove } = useContext(SelectionsActionsContext);
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
          ) : (
            <SelectionsView
              selections={selections}
              iconMap={iconMap}
              onSelect={setSelectedEntry}
              onRemove={remove}
            />
          )}
        </View>
      </ScrollView>
    </Popup>
  );
}
