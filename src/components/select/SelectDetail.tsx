import { useContext, useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Cell, InputNumber, Range, Grid } from "@nutui/nutui-react-taro";

import { Item, Resources, Selection } from "../data";
import Icon from "../icons";
import { SelectionsContext, SelectionsDispatchContext } from "../SelectionsContext";
import ModeError from "../ModeError";
import { useUnit } from '../UnitContext';
import { DataContext } from '../DataContext';

import './SelectDetail.scss';

interface SelectDetailProps {
    item: Item;
    category: string;
}

function SelectDetail({ item, category }: SelectDetailProps) {
    const selections = useContext(SelectionsContext);
    const dispatch = useContext(SelectionsDispatchContext);
    const { plantNames } = useContext(DataContext);
    const [resources, setResources] = useState<Resources>({});
    const { unitType } = useUnit();

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

    const unit = unitMap[category || selection.category] || '';

    useEffect(() => {
        if (!selection) return;
        const newResources: Resources = {};
        let totalFactor = 0;
        // 模式资源计算（支持百分比）
        item.detail!.modes.forEach((mode, i) => {
            const optionSelectionMap = selection.modes[i];

            mode.options.forEach(option => {
                const percentage = optionSelectionMap.get(option.name) || 0;

                const factor = percentage / 100;
                totalFactor += factor;
                Object.entries(option.resources || {}).forEach(([name, value]) => {
                    const resourceValue = selection.count * value * factor;
                    if (!resourceValue) return;
                    newResources[name] = (newResources[name] || 0) + resourceValue;
                });
            });
        });
        // 基础资源计算
        Object.entries(item.detail?.resources || {}).forEach(([name, value]) => {
            const resourceValue = selection.count * value * totalFactor;
            newResources[name] = (newResources[name] || 0) + resourceValue;
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

    // 单位转换函数 - 修改为统一处理植物单位
    const convertValue = (value: number, name: string): { convertedValue: number, unit: string } => {
        if (unitType === 'g/s') {
            const isPlant = plantNames.includes(name);
            const unit = isPlant ? '棵/s' : 'g/s';
            if (isPlant) return { convertedValue: value / 1000, unit };
            return { convertedValue: value, unit };
        } else {
            // 转换为kg/周期: 1周期=600秒，1000g=1kg
            const convertedValue = value * 600 / 1000;
            const unit = plantNames.includes(name) ? '棵/周期' : 'kg/周期';
            return { convertedValue, unit };
        }
    };

    return (
        <Cell.Group className="select-detail">
            <Cell align="center">
                <Icon name={item.name} width={48} height={48} />
                <Text className="item-name">{item.name}</Text>
                <View style={{ flex: 1 }} />
                <InputNumber defaultValue={selection.count || 0} min={0} onChange={handleCountChange} />
                <Text className="item-unit">{unit}</Text>
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
                    {Object.entries(resources).map(([name, value]) => {
                        const { convertedValue, unit } = convertValue(value, name); // 修改调用，传入name参数
                        return (
                            <Grid.Item key={name}>
                                <Icon name={name} width={48} height={48} />
                                <Text className="resource-name">{name}</Text>
                                <Text className={`value ${convertedValue < 0 ? "consume" : "produce"}`}>
                                    {`${convertedValue < 0 ? Math.floor(convertedValue) : '+' + Math.floor(convertedValue)} ${unit}`}
                                </Text>
                            </Grid.Item>
                        )
                    })}
                </Grid>
            </Cell>
        </Cell.Group>
    );
}

export default SelectDetail;
