import { useContext, useEffect, useState } from "react";
import { Button, Cell, Divider, Grid, InputNumber, Popup, Radio, Image, Range } from "@nutui/nutui-react-taro";
import { View, Text, Slider } from "@tarojs/components";

import { data, Item, Resources, Selection } from "./data";
import Icon, { itemIcons } from "./icons";
import { SelectionsContext, SelectionsDispatchContext } from "./SelectionsContext";
import ModeError from "./ModeError";

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
        <Grid columns={item.items && item.items.length >= 5 ? 5 : item.items?.length || 0} onClick={handleSelect}>
            {item.items?.map((item, index) => (
                <Grid.Item key={index} text={item.name}>
                    <Icon width={48} height={48} name={item.name} mode="aspectFit" />
                </Grid.Item>
            ))}
        </Grid>
    );
}

function SelectDetail({ item, category }: SelectDetailProps) {
    const selections = useContext(SelectionsContext);
    const dispatch = useContext(SelectionsDispatchContext);
    const [resources, setResources] = useState<Resources>({});

    function getDefaultModes(): Array<Map<string, number>> {
        const modes = item.detail!.modes.map(mode => {
            return new Map<string, number>(
                mode.options.map((option, index) => [option.name, index ? 0 : 100])
            );
        });
        return modes;
    }

    const [selection, setSelection] = useState<Selection>(
        selections.find(s => s.item.name === item.name) ||
        { item, count: 0, modes: getDefaultModes(), category }
    );

    // 资源单位映射表
    const unitMap = {
        '复制人/仿生人': '个',
        '建筑': '台',
        '植物': '棵',
        '动物': '只',
        '相变': 'kg'
    };

    let unit = unitMap[category || selection.category] || '';
    if (unit === 'kg' && item.name === '污染水' && item.parent?.name === '挥发') {
        unit = '吨';
    }

    useEffect(() => {
        if (!selection) return;
        const newResources: Resources = {};
        // 基础资源计算
        Object.entries(item.detail?.resources || {}).forEach(([name, value]) => {
            const resourceValue = selection.count * value;
            newResources[name] = (newResources[name] || 0) + resourceValue;
        });

        // 模式资源计算（支持百分比）
        item.detail!.modes.forEach((mode, i) => {
            const optionSelectionMap = selection.modes[i];

            mode.options.forEach(option => {
                const percentage = optionSelectionMap.get(option.name) || 0;

                const factor = percentage / 100;
                Object.entries(option.resources || {}).forEach(([name, value]) => {
                    const resourceValue = selection.count * value * factor;
                    if (!resourceValue) return;
                    newResources[name] = (newResources[name] || 0) + resourceValue;
                });
            });
        });
        setResources(newResources);
    }, [selections, selection.count, selection.modes]);

    function handleCountChange(value: number) {
        const newSelection = { ...selection, count: value };
        setSelection(newSelection);
        dispatch({ type: value > 0 ? 'update' : 'remove', payload: newSelection });
    }

    function handleModePercentageChange(modeIndex: number, option: string, value: number) {
        selection.modes[modeIndex].set(option, value);

        const newSelection = { ...selection };
        setSelection(newSelection);
        dispatch({ type: newSelection.count > 0 ? 'update' : 'remove', payload: newSelection });
    }

    return (
        <Cell.Group className="select-detail">
            <Cell align="center">
                <Image src={itemIcons[item.name]} width={48} height={48} mode="aspectFit" />
                <Text className="item-name">{item.name}</Text>
                <View style={{ flex: 1 }} />
                <InputNumber defaultValue={selection.count || 0} min={0} onChange={handleCountChange} />
                <Text style={{ marginLeft: '8px' }}>{unit}</Text>
            </Cell>
            <Cell align="center">
                <Text className="item-power">电力：{item.detail?.power || 0}W</Text>
                <View style={{ flex: 1 }} />
                <Text className="item-heat">热量：{item.detail?.heat || 0}复制热</Text>
            </Cell>
            {item.detail?.modes.map((mode, i) => (
                <Cell key={`mode-${i}`} className="mode">
                    <ModeError optionValueMap={selection.modes[i]} modeName={mode.name} />
                    <Text className="mode-name">{mode.name}:</Text>
                    {mode.options.map((option, j) => (
                        <View key={`option-${j}`} className="mode-item">
                            <Text className="option-name">{option.name}:</Text>
                            <Range
                                className="slider"
                                defaultValue={[selection.modes[i]?.get(option.name) || 0]}
                                minDescription={null}
                                maxDescription={null}
                                max={100}
                                min={0}
                                step={1}
                                onChange={(value) => handleModePercentageChange(i, option.name, value as number)}
                                currentDescription={val => `${val}%`}
                            />
                        </View>
                    ))}
                </Cell>
            ))}
            <Cell>
                <Grid
                    style={{ width: '100%' }}
                    columns={Object.keys(resources).length >= 5 ? 5 : Object.keys(resources).length}>
                    {Object.entries(resources).map(([name, value]) => (
                        <Grid.Item key={name}>
                            <Image width={48} src={itemIcons[name]} />
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
        const nextItem = currentItem.items![index];
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