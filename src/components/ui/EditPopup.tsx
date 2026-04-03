import { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import { Popup } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";

import { SelectionEntryWithDetail, SelectionsActionsContext } from "@/contexts/SelectionsContext";
import { DataContext } from "@/contexts/DataContext";
import LinkDetailView from "@/components/detail/views/LinkDetailView";
import SelectionsView from "@/components/ui/SelectionsView";

interface EditPopupProps {
  visible: boolean;
  selections: SelectionEntryWithDetail[];
  onClose: () => void;
}

export default function EditPopup({ visible, selections, onClose }: EditPopupProps) {
  const { iconMap } = useContext(DataContext);
  const { remove } = useContext(SelectionsActionsContext);
  const [selectedEntry, setSelectedEntry] = useState<SelectionEntryWithDetail | null>(null);

  useEffect(() => {
    if (!visible) setSelectedEntry(null);
  }, [visible]);

  const title = useMemo(() => {
    return selectedEntry?.name || "已选条目";
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
      className='popup-root'
      visible={visible}
      position='bottom'
      title={title}
      onClose={handleClose}
      left={selectedEntry ? <ArrowLeft onClick={handleGoBack} /> : null}
      closeable
      style={{ marginBottom: process.env.TARO_ENV === "h5" ? "50px" : "0" }}
    >
      <ScrollView style={{ height: "calc(100% - 48px)" }} scrollY>
        <View className='p-8'>
          {selectedEntry ? (
            <LinkDetailView
              link={{
                name: selectedEntry.name,
                detail: selectedEntry.detail,
              }}
              category={selectedEntry.category}
              mode='edit'
              editKey={selectedEntry.key}
              initialCount={selectedEntry.count}
              initialModeSelections={selectedEntry.modeSelections}
              initialEfficiency={selectedEntry.efficiency}
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
