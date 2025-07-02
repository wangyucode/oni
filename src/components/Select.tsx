import { Avatar, Button, Cell, Divider, Grid, InputNumber, Popup, Radio, Image } from "@nutui/nutui-react-taro";
import { data, elementIcons, Item, Resource } from "./data";
import Icon, { icons } from "./icons";
import { useState } from "react";
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
        <Grid columns={5} onClick={handleSelect}>
            {item.items.map((item, index) => (
                <Grid.Item key={index} text={item.name}>
                    <Icon width={24} height={24} name={item.icon} />
                </Grid.Item>
            ))}
        </Grid>
    );
}

function SelectDetail({ item }: SelectDetailProps) {

    const [resources, setResources] = useState<Array<Resource>>(item.detail?.resources || []);

    function handleAdd() {
        // TODO: 处理添加逻辑 
    }


    return (
        <Cell.Group className="select-detail">
            <Cell>
                <Avatar src={icons[item.icon]} />
                <Text className="item-name">{item.name}</Text>
                <View style={{ flex: 1 }} />
                <InputNumber defaultValue={1} min={0} />
            </Cell>
            {item.detail?.modes.map((mode, i) => (
                <Cell key={`mode-${i}`} className="mode">
                    <Text className="mode-name">{mode.name}:</Text>
                    <Radio.Group defaultValue={mode.options[0].name} direction="horizontal">
                        {mode.options.map((option, j) => (<Radio key={`option-${j}`} value={option.name} shape="button">{option.name}</Radio>))}
                    </Radio.Group>
                </Cell>))}
            <Cell>
                <Grid style={{ width: '100%' }}>
                    {resources.map((resource, i) => {
                        const icon = elementIcons.find(e => e.name === resource.name)?.icon;
                        return (
                            <Grid.Item key={`resource-${i}`}>
                                <Image width={32} height={32} src={`https://oxygennotincluded.wiki.gg/zh/images/${icon}/${resource.name}.png`} />
                                <Text>{resource.name}</Text>
                                <Text className={`value ${resource.value < 0 ? "consume" : "produce"}`}>{`${resource.value < 0 ? '' : '+'}${resource.value} kg/s`}</Text>
                            </Grid.Item>)
                    })}
                </Grid>
            </Cell>
            <Cell align="center"><Button className="add" onClick={handleAdd} type="primary">添加</Button></Cell>
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