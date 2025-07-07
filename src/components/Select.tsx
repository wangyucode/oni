import { Avatar, Button, Cell, Divider, Grid, InputNumber, Popup, Radio, Image } from "@nutui/nutui-react-taro";
import { data, Item, Resource } from "./data";
import Icon, { itemIcons } from "./icons";
import { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";

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

function SelectDetail({ item }: SelectDetailProps) {

    const [resources, setResources] = useState<Array<Resource>>(item.detail?.resources || []);
    const [count, setCount] = useState<number>(item.detail?.count || 1);
    const [modes, setModes] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        const newResources = item.detail?.resources.map(resource => ({ ...resource })) || [];
        item.detail?.modes.forEach(mode => {
            const modeValue = modes[mode.name] || 0;
            const modeOption = mode.options[modeValue];
            modeOption.resources.forEach(resource => {
                const resourceItem = newResources.find(r => r.name === resource.name);
                if (resourceItem) {
                    resourceItem.value = resourceItem.value + resource.value;
                } else {
                    newResources.push({ ...resource });
                }
            });
        });
        newResources.forEach(resource => resource.value = resource.value * count);
        setResources(newResources);
    }, [count, modes])

    function handleAdd() {
        // TODO: 处理添加逻辑 
    }

    return (
        <Cell.Group className="select-detail">
            <Cell align="center">
                <Image src={itemIcons[item.name]} width={48} />
                <Text className="item-name">{item.name}</Text>
                <View style={{ flex: 1 }} />
                <InputNumber defaultValue={count} min={0} onChange={setCount as any} />
            </Cell>
            {item.detail?.modes.map((mode, i) => (
                <Cell key={`mode-${i}`} className="mode" align="center">
                    <Text className="mode-name">{mode.name}:</Text>
                    <Radio.Group defaultValue={modes[mode.name] || 0} direction="horizontal" onChange={v => { setModes({ ...modes, [mode.name]: v as number }) }}>
                        {mode.options.map((option, j) => (<Radio key={`option-${j}`} value={j} shape="button">{option.name}</Radio>))}
                    </Radio.Group>
                </Cell>))}
            <Cell>
                <Grid style={{ width: '100%' }} columns={resources.length >= 5 ? 5 : resources.length}>
                    {resources.map(resource => (
                        <Grid.Item key={`${resource.name}`} >
                            <Image width={48} height={48} src={itemIcons[resource.name]} />
                            <Text>{resource.name}</Text>
                            <Text className={`value ${resource.value < 0 ? "consume" : "produce"}`}>
                                {`${resource.value < 0 ? '' : '+'}${resource.value.toFixed(3)} kg/s`}
                            </Text>
                        </Grid.Item>)
                    )}
                </Grid>
            </Cell>
            <Cell align="center"><Button className="add" onClick={handleAdd} type="primary">确定</Button></Cell>
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
            visible={!!select}
            position="bottom"
            title={select}
            left={canGoBack ? <Button onClick={goBack}>返回</Button> : null}
            onClose={onClose}
            closeable>
            <Divider />
            <View className="select-content">
                {currentItem.detail ?
                    <SelectDetail item={currentItem} /> :
                    <SelectItems item={currentItem} handleSelect={handleSelect} />}
            </View>
        </Popup>
    );
}