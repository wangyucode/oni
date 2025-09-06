
import { useContext, useEffect, useState } from 'react';
import { useShareAppMessage } from '@tarojs/taro';
import { View, Text } from '@tarojs/components'
import { Avatar, Badge, Collapse, Grid, Image } from '@nutui/nutui-react-taro'

import Icon, { itemIcons } from 'src/components/icons'
import plus from 'src/components/icons/plus.png'
import Select from 'src/components/Select';
import { SelectionsContext } from 'src/components/SelectionsContext';
import { Item, Resources, sharedMessage } from 'src/components/data';

import './index.scss'
import { DataContext } from 'src/components/DataContext';

const selectionCategories = ['复制人/仿生人', '建筑', '动物', '植物', '相变'];
const resultCategories = ['资源', '食物', '电力', '热量'];

function Index() {

  useShareAppMessage(() => sharedMessage);
  const { plantNames, foodCalories } = useContext(DataContext);

  const [select, setSelect] = useState<string>('');
  const [edit, setEdit] = useState<Item | undefined>(undefined);
  const selections = useContext(SelectionsContext);
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
      // 基础资源计算
      Object.entries(selection.item.detail!.resources).forEach(([name, value]) => {
        const resourceValue = selection.count * value;
        newResources[name] = (newResources[name] || 0) + resourceValue;
      });

      // 电力计算
      if (selection.item.detail?.power) {
        newTotalPower += selection.count * selection.item.detail.power;
      }

      // 热量计算
      if (selection.item.detail?.heat) {
        newTotalHeat += selection.count * selection.item.detail.heat;
      }

      // 模式资源计算（支持百分比）
      selection.item.detail!.modes.forEach((mode, i) => {
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
      return '包括污染水挥发污染氧；数据待补充';
    } else {
      return '';
    }
  }

  return (
    <View className='root'>
      <Collapse defaultActiveName={selectionCategories} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        {selectionCategories.map(category =>
          <Collapse.Item title={category} name={category} key={category} >
            <Text className='tips'>{getTips(category)}</Text>
            <View className='avatar-container'>
              {selections.filter(s => s.category === category).map(({ count, item }) =>
                <Badge value={count} key={item.name} max={999}>
                  <Image
                    src={itemIcons[item.name]}
                    width={48}
                    height={48}
                    mode='aspectFit'
                    onClick={() => handleItemClick(item)}
                  />
                </Badge>)}
              <Image className='avatar-add' width={48} height={48} src={plus} onClick={() => handleAdd(category)} />
            </View>
          </Collapse.Item>)}
      </Collapse>

      <Collapse defaultActiveName={resultCategories} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        <Collapse.Item title="资源" name='资源'>
          <Grid className='resource-grid' columns={Object.keys(resources).length >= 5 ? 5 : Object.keys(resources).length}>
            {Object.entries(resources).map(([name, value]) => {
              const unit = plantNames.includes(name) ? '棵' : 'g/s';
              const valueStr = value < 0 ? Math.floor(value) : '+' + Math.ceil(value);
              return (
                <Grid.Item key={name}>
                  <Image src={itemIcons[name]} width={48} height={48} mode='aspectFit' />
                  <Text className='resource-name'>{name}</Text>
                  <Text className={`value ${value < 0 ? "consume" : "produce"}`}>
                    {`${valueStr} ${unit}`}
                  </Text>
                </Grid.Item>
              )
            })}
          </Grid>
        </Collapse.Item>
        <Collapse.Item title="食物" name="食物">
          <View className="power-heat-container">
            <Text className={`value ${totalCalories < 0 ? "consume" : "produce"}`}>
              {`${totalCalories < 0 ? Math.floor(totalCalories) : '+' + Math.ceil(totalCalories)} 千卡/秒`}
            </Text>
          </View>
        </Collapse.Item>
        <Collapse.Item title="电力" name="电力">
          <View className="power-heat-container">
            <Text className={`value ${totalPower < 0 ? "consume" : "produce"}`}>{totalPower} W</Text>
          </View>
        </Collapse.Item>
        <Collapse.Item title="热量" name="热量">
          <View className="power-heat-container">
            <Text className={`value ${totalHeat < 0 ? "consume" : "produce"}`}>{Math.ceil(totalHeat / 1000)} 千复制热/秒</Text>
          </View>
        </Collapse.Item>
      </Collapse>

      <Select select={select} onClose={onClose} edit={edit} />
    </View>
  )
}

export default Index
