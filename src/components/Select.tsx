import { useContext, useState } from "react";
import { Button, Divider, Popup } from "@nutui/nutui-react-taro";

import { Item } from "./data";
import { DataContext } from "./DataContext";
import SelectItems from "./select/SelectItems";
import SelectDetail from "./select/SelectDetail";

interface SelectProps {
    select: string;
    onClose: () => void;
    edit?: Item;
}

export default function Select({ select, onClose, edit }: SelectProps) {
    const { items } = useContext(DataContext);
    const [canGoBack, setCanGoBack] = useState(false);
    let item = edit;
    if (select) item = items.find(item => item.name === select);
    const [currentItem, setCurrentItem] = useState<Item>(item!);

    function goBack() {
        if (!currentItem.parent?.parent) setCanGoBack(false);
        if (currentItem.parent) setCurrentItem(currentItem.parent);
    }

    function handleSelect({ index }: { index: number }) {
        const nextItem = currentItem.items![index];
        nextItem.parent = currentItem;
        setCurrentItem(nextItem);
        setCanGoBack(true);
    }

    return (
        <Popup
            visible={!!item}
            position="bottom"
            title={currentItem.name}
            left={canGoBack ? <Button onClick={goBack}>返回</Button> : null}
            onClose={onClose}
            closeable>
            <Divider />
            {currentItem.detail ?
                <SelectDetail item={currentItem} category={select} />
                :
                <SelectItems item={currentItem} handleSelect={handleSelect} />
            }
        </Popup>
    );
}