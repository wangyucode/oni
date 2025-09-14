
import { useContext, useEffect, useState } from 'react';
import Taro, { useShareAppMessage } from '@tarojs/taro';
import { View, Text } from '@tarojs/components'
import { Badge, Button, Cell, Collapse, Grid, Switch } from '@nutui/nutui-react-taro'

import Icon from 'src/components/icons'
import Select from 'src/components/Select';
import { DataContext } from 'src/components/DataContext';
import { useUnit } from 'src/components/UnitContext';
import { SelectionsContext, SelectionsDispatchContext } from 'src/components/SelectionsContext';
import { Item, Resources, sharedMessage } from 'src/components/data';

import './index.scss'
import { Add } from '@nutui/icons-react-taro';

const selectionCategories = ['复制人/仿生人', '建筑', '动物', '植物', '相变'];
const resultCategories = ['资源', '食物', '电力', '热量'];

function Index() {

  useShareAppMessage(() => sharedMessage);
  const { plantNames, foodCalories } = useContext(DataContext);
  const { unitType, toggleUnitType } = useUnit();
  const [select, setSelect] = useState<string>('');
  const [edit, setEdit] = useState<Item | undefined>(undefined);
  const selections = useContext(SelectionsContext);
  const dispatch = useContext(SelectionsDispatchContext);
  const [resources, setResources] = useState<Resources>({});
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [totalPower, setTotalPower] = useState<number>(0);
  const [totalHeat, setTotalHeat] = useState<number>(0);

  useEffect(() => {
    const newResources: Resources = {};
    const newFoodResources: Resources = {};
    let newTotalPower = 0;
    let newTotalHeat = 0;

    selections.forEach(selection => {
      let totalFactor = 0;
      // 模式资源计算（支持百分比）
      selection.item.detail!.modes.forEach((mode, i) => {
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
      Object.entries(selection.item.detail!.resources).forEach(([name, value]) => {
        const resourceValue = selection.count * value * totalFactor;
        newResources[name] = (newResources[name] || 0) + resourceValue;
      });

      // 电力计算
      if (selection.item.detail?.power) {
        newTotalPower += selection.count * selection.item.detail.power * totalFactor;
      }

      // 热量计算
      if (selection.item.detail?.heat) {
        newTotalHeat += selection.count * selection.item.detail.heat * totalFactor;
      }

    });

    // 处理小动物吃植物
    Object.entries(newResources).forEach(([name, value]) => {
      if (plantNames.includes(name)) {
        const selection = selections.find(s => s.item.name === name);
        if (selection) {
          Object.entries(selection.item.detail!.resources).forEach(([n, v]) => {
            newResources[n] = (newResources[n] || 0) + v * value;
          });
          delete newResources[name];
        }
      }
    });

    setResources(newResources);
    setTotalPower(newTotalPower);
    setTotalHeat(newTotalHeat);


    // 处理食物
    Object.entries(newResources).forEach(([name, value]) => {
      // 筛选食物资源
      const foodKeywords = Object.keys(foodCalories);
      if (foodKeywords.some(keyword => name.includes(keyword)) && value > 0) {
        newFoodResources[name] = (newFoodResources[name] || 0) + value;
      }
    });

    // 计算总卡路里
    const newTotalCalories = Object.entries(newFoodResources)
      .reduce((sum, [name, value]) => {
        const caloriePerGram = foodCalories[name] || 0;
        return sum + (value * caloriePerGram);
      }, 0);

    // 计算复制人消耗卡路里 (每个复制人每秒消耗 1000/600 卡路里)
    const dupeCount = selections
      .filter(s => s.item.name === '复制人')
      .reduce((total, s) => total + s.count, 0);
    const caloriesConsumed = dupeCount * (1000 / 600);
    const netCalories = newTotalCalories - caloriesConsumed;

    setTotalCalories(netCalories);
  }, [selections])

  function handleAdd(category: string) {
    setSelect(category);
  }

  function onClose() {
    setSelect('');
    setEdit(undefined);
  }

  function handleItemClick(item: Item) {
    setSelect('');
    setEdit({ ...item });
  }

  function reset() {
    dispatch({ type: 'replace', payload: [] });
    Taro.removeStorage({ key: 'selections' });
  }

  function getTips(category: string) {
    if (category === '建筑') {
      return '建筑效率实际通常无法达到100%，实际产量通常略低于理论值';
    } else if (category === '动物') {
      return '动物按精养数量计算，加上散养实际产量通常略高于理论值；除帕库鱼和树鼠选择产蛋外，其它动物选择产肉';
    } else if (category === '植物') {
      return '植物无法立即被收获，实际产量通常略低于理论值';
    } else if (category === '复制人/仿生人') {
      return '物质转化包含呼吸/上厕所/粘渣/润滑，未包含洗澡';
    } else if (category === '相变') {
      return '包括所有物质的相态转化，包括挥发、液化、凝固、熔化、凝结、升华';
    } else {
      return '';
    }
  }

  // 单位转换函数
  const convertResourceValue = (value: number, name: string): { convertedValue: number, unit: string } => {
    if (unitType === 'g/s') {
      const unit = plantNames.includes(name) ? '棵/s' : 'g/s';
      return { convertedValue: value, unit };
    } else {
      // 转换为kg/周期: 1周期=600秒，1000g=1kg
      const convertedValue = value * 600 / 1000;
      const unit = plantNames.includes(name) ? '棵/周期' : 'kg/周期';
      return { convertedValue, unit };
    }
  };

  const convertCalories = (calories: number): { convertedValue: number, unit: string } => {
    if (unitType === 'g/s') {
      return { convertedValue: calories, unit: '千卡/秒' };
    } else {
      return { convertedValue: calories * 600, unit: '千卡/周期' };
    }
  };

  const convertHeat = (heat: number): { convertedValue: number, unit: string } => {
    if (unitType === 'g/s') {
      return { convertedValue: heat / 1000, unit: '千复制热/秒' };
    } else {
      return { convertedValue: heat * 600 / 1000, unit: '千复制热/周期' };
    }
  };

  const { convertedValue: convertedCalories, unit: caloriesUnit } = convertCalories(totalCalories);
  const { convertedValue: convertedHeat, unit: heatUnit } = convertHeat(totalHeat);

  return (
    <View className={`root index ${select || edit ? 'select-open' : ''}`}>
      <Collapse className='selection' defaultActiveName={selectionCategories} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        {selectionCategories.map(category =>
          <Collapse.Item title={category} name={category} key={category} >
            <Text className='tips'>{getTips(category)}</Text>
            <View className='avatar-container'>
              {selections.filter(s => s.category === category).map(({ count, item }) =>
                <Badge value={count} key={item.name} max={999}>
                  <Icon
                    name={item.name}
                    width={48}
                    height={48}
                    onClick={() => handleItemClick(item)}
                  />
                </Badge>)}
              <Button className='add' onClick={() => handleAdd(category)}><Add width={24} height={24} color='#7f3d5e' /></Button>
            </View>
          </Collapse.Item>)}
      </Collapse>
      <View className='result'>
        <Collapse defaultActiveName={resultCategories} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
          <Collapse.Item title="资源" name='资源'>
            <Grid className='resource-grid' columns={Object.keys(resources).length >= 5 ? 5 : Object.keys(resources).length}>
              {Object.entries(resources).map(([name, value]) => {
                const { convertedValue, unit } = convertResourceValue(value, name);
                const valueStr = convertedValue < 0 ? Math.floor(convertedValue) : '+' + Math.floor(convertedValue);
                return (
                  <Grid.Item key={name}>
                    <Icon name={name} width={48} height={48} />
                    <Text className='resource-name'>{name}</Text>
                    <Text className={`value ${convertedValue < 0 ? "consume" : "produce"}`}>
                      {`${valueStr} ${unit}`}
                    </Text>
                  </Grid.Item>
                )
              })}
            </Grid>
          </Collapse.Item>
          <Collapse.Item title="食物" name="食物">
            <View className="power-heat-container">
              <Text className={`value ${convertedCalories < 0 ? "consume" : "produce"}`}>
                {`${convertedCalories < 0 ? Math.floor(convertedCalories) : '+' + Math.floor(convertedCalories)} ${caloriesUnit}`}
              </Text>
            </View>
          </Collapse.Item>
          <Collapse.Item title="电力" name="电力">
            <View className="power-heat-container">
              <Text className={`value ${totalPower < 0 ? "consume" : "produce"}`}>
                {`${totalPower < 0 ? Math.floor(totalPower) : '+' + Math.floor(totalPower)} W`}
              </Text>
            </View>
          </Collapse.Item>
          <Collapse.Item title="热量" name="热量">
            <View className="power-heat-container">
              <Text className={`value ${convertedHeat < 0 ? "consume" : "produce"}`}>
                {`${convertedHeat < 0 ? Math.floor(convertedHeat) : '+' + Math.floor(convertedHeat)} ${heatUnit}`}
              </Text>
            </View>
          </Collapse.Item>
        </Collapse>
        <Cell className='unit-cell' title="切换显示单位" radius={0} extra={
          <>
            <Text className='unit-text'>{unitType === 'g/s' ? 'g/s' : 'kg/周期'}</Text>
            <Switch checked={unitType === 'kg/周期'} onChange={toggleUnitType} />
          </>
        } />
        <Button className='reset' size="xlarge" onClick={reset}>清空选择</Button>
      </View>

      {select || edit ? <Select select={select} onClose={onClose} edit={edit} /> : null}
    </View>
  )
}

export default Index
