import { useContext, useEffect, useState } from "react";
import { Button, Cell, Divider, Grid, InputNumber, Popup, Radio, Image } from "@nutui/nutui-react-taro";
import { View, Text } from "@tarojs/components";

import { data, Item, Resources, Selection } from "./data";
import Icon, { itemIcons } from "./icons";
import { SelectionsContext, SelectionsDispatchContext } from "./SelectionsContext";

interface SelectProps {
    select: string;
    onClose: () => void;
    edit?: Item;
}

interface SelectItemsProps {
    item: Item;
    handleSelect: (params: { index: number }) => void;
}

interface SelectDetailProps {
    item: Item;
    category: string;
}

function SelectItems({ item, handleSelect }: SelectItemsProps) {

    return (
        <Grid columns={item.items.length >= 5 ? 5 : item.items.length} onClick={handleSelect}>
            {item.items.map((item, index) => (
                <Grid.Item key={index} text={item.name}>
                    <Icon width={48} height={48} name={item.name} />
                </Grid.Item>
            ))}
        </Grid>
    );
}

function SelectDetail({ item, category }: SelectDetailProps) {
    const selections = useContext(SelectionsContext);
    const dispatch = useContext(SelectionsDispatchContext);
    const [resources, setResources] = useState<Resources>({});
    const [selection, setSelection] = useState<Selection>(selections.find(selection => selection.item.name === item.name) || { item, count: 0, modes: new Map<string, number>(), category });

    useEffect(() => {
        if (!selection) return;
        const newResources: Resources = {};
        // 基础
        Object.entries(item.detail?.resources || {}).forEach(([name, value]) => {
            const resourceValue = selection.count * value;
            newResources[name] = (newResources[name] || 0) + resourceValue;
        });
        // 模式
        item.detail?.modes.forEach(mode => {
            const modeValue = selection?.modes[mode.name] || 0;
            const modeOption = mode.options[modeValue];
            Object.entries(modeOption.resources || {}).forEach(([name, value]) => {
                const resourceValue = selection.count * value;
                newResources[name] = (newResources[name] || 0) + resourceValue;
            });
        });
        setResources(newResources);
    }, [selections]);

    function handleCountChange(value: number) {
        const newSelection = { ...selection, count: value };
        setSelection(newSelection);
        dispatch({ type: value > 0 ? 'update' : 'remove', payload: newSelection });
    }

    function handleModeChange(name: string, value: number) {
        const newSelection = { ...selection, modes: { ...selection.modes, [name]: value } };
        setSelection(newSelection);
        dispatch({ type: newSelection.count > 0 ? 'update' : 'remove', payload: newSelection });
    }

    return (
        <Cell.Group className="select-detail">
            <Cell align="center">
                <Image src={itemIcons[item.name]} width={48} />
                <Text className="item-name">{item.name}</Text>
                <View style={{ flex: 1 }} />
                <InputNumber defaultValue={selection.count || 0} min={0} onChange={handleCountChange} />
            </Cell>
            {item.detail?.modes.map((mode, i) => (
                <Cell key={`mode-${i}`} className="mode" align="center">
                    <Text className="mode-name">{mode.name}:</Text>
                    <Radio.Group defaultValue={selection.modes[mode.name] || 0} direction="horizontal" onChange={v => handleModeChange(mode.name, v as number)}>
                        {mode.options.map((option, j) => (<Radio key={`option-${j}`} value={j} shape="button">{option.name}</Radio>))}
                    </Radio.Group>
                </Cell>))}
            <Cell>
                <Grid style={{ width: '100%' }} columns={Object.keys(resources).length >= 5 ? 5 : Object.keys(resources).length}>
                    {Object.entries(resources).map(([name, value]) => (
                        <Grid.Item key={name}>
                            <Image width={48} height={48} src={itemIcons[name]} />
                            <Text>{name}</Text>
                            <Text className={`value ${value < 0 ? "consume" : "produce"}`}>
                                {`${value < 0 ? '' : '+'}${Math.round(value)} g/s`}
                            </Text>
                        </Grid.Item>)
                    )}
                </Grid>
            </Cell>
        </Cell.Group>
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
            visible={!!item}
            position="bottom"
            title={select}
            left={canGoBack ? <Button onClick={goBack}>返回</Button> : null}
            onClose={onClose}
            closeable>
            <Divider />
            <View className="select-content">
                {currentItem.detail ?
                    <SelectDetail item={currentItem} category={select} /> :
                    <SelectItems item={currentItem} handleSelect={handleSelect} />}
            </View>
        </Popup>
    );
}