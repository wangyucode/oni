import { Button, Divider, Grid, Popup } from "@nutui/nutui-react-taro";
import { data, Detail, Item } from "./data";
import Icon from "./icons";
import { useRef, useState } from "react";

interface SelectProps {
    select: string;
    onClose: () => void;
    edit?: Item;
}

function SelectItems({ item, handleSelect }: { item: Item, handleSelect: (params: { index: number }) => void }) {

    return (
        <Grid columns={5} onClick={handleSelect}>
            {item.items.map((item, index) => (
                <Grid.Item key={index} text={item.name} data-index={index}>
                    <Icon width={24} height={24} name={item.icon} />
                </Grid.Item>
            ))}
        </Grid>
    );
}

function SelectDetail({ item }: { item: Item }) {
    return (
        <div>detail of {item.name}</div>
    );
}

export default function Select({ select, onClose, edit }: SelectProps) {

    let item = edit;
    if (select) item = data.items.find(item => item.name === select);

    if (!item) return null;

    const [canGoBack, setCanGoBack] = useState(false);
    const [currentItem, setCurrentItem] = useState<Item>(item);

    function goBack() {
        if (!currentItem.parent?.parent) setCanGoBack(false);
        if (currentItem.parent) setCurrentItem(currentItem.parent);
    }

    function handleSelect({ index }: { index: number }) {
        const nextItem = currentItem.items[index];
        nextItem.parent = currentItem;
        setCurrentItem(nextItem);
        setCanGoBack(true);
    }

    return (
        <Popup
            visible={!!select}
            position="bottom"
            title={select}
            left={canGoBack ? <Button onClick={goBack}>返回</Button> : null}
            onClose={onClose}
            closeable>
            {currentItem.detail ?
                <SelectDetail item={currentItem} /> :
                <SelectItems item={currentItem} handleSelect={handleSelect} />}
        </Popup>
    );
}