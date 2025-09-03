
import { useContext, useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components'
import { Avatar, Badge, Collapse, Grid, Tabbar } from '@nutui/nutui-react-taro'

import Icon, { itemIcons } from 'src/components/icons'
import plus from 'src/components/icons/plus.png'
import Select from 'src/components/Select';
import { SelectionsContext } from 'src/components/SelectionsContext';
import { Item, Resources, foodCalorieMap, plants } from 'src/components/data';

import './index.scss'

const selectionCategories = ['复制人/仿生人', '建筑', '动物', '植物', '相变'];
const resultCategories = ['资源', '食物', '电力', '热量'];

function Index() {

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

        // 筛选食物资源
        const foodKeywords = Object.keys(foodCalorieMap);
        if (foodKeywords.some(keyword => name.includes(keyword))) {
          newFoodResources[name] = (newFoodResources[name] || 0) + resourceValue;
        }
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
      if (plants.includes(name)) {
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

    // 计算总卡路里
    const newTotalCalories = Object.entries(newFoodResources)
      .reduce((sum, [name, value]) => {
        const caloriePerGram = foodCalorieMap[name] || 0;
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

  function handleSwitchTab(index: number) {
    // TODO: 切换Tabbar
    console.log(index);
  }

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
      return '动物按精养数量计算，加上散养实际产量通常略高于理论值';
    } else if (category === '植物') {
      return '植物无法立即被收获，实际产量通常略低于理论值';
    } else if (category === '复制人/仿生人') {
      return '物质转化包含呼吸/上厕所/粘渣/润滑，未包含洗澡';
    } else {
      return '';
    }
  }

  return (
    <View className='nutui-react-demo'>
      <Collapse defaultActiveName={selectionCategories} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        {selectionCategories.map(category =>
          <Collapse.Item title={category} name={category} key={category} >
            <Text className='tips'>{getTips(category)}</Text>
            <View className='avatar-container'>
              <Avatar.Group gap="8">
                {selections.filter(s => s.category === category).map(({ count, item }) =>
                  <Badge value={count} key={item.name}>
                    <Avatar
                      src={itemIcons[item.name]}
                      shape='square'
                      size='48'
                      onClick={() => handleItemClick(item)}
                    />
                  </Badge>)}
              </Avatar.Group>
              <Avatar className='avatar-add' size='48' shape='square' src={plus} onClick={() => handleAdd(category)} style={{ backgroundColor: '#7F3D5E' }} />
            </View>
          </Collapse.Item>)}
      </Collapse>

      <Collapse defaultActiveName={resultCategories} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        <Collapse.Item title="资源" name='资源'>
          <Grid style={{ width: '100%' }} columns={Object.keys(resources).length >= 5 ? 5 : Object.keys(resources).length}>
            {Object.entries(resources).map(([name, value]) => {
              const unit = plants.includes(name) ? '棵' : 'g/s';
              const valueStr = value < 0 ? Math.floor(value) : '+' + Math.ceil(value);
              return (
                <Grid.Item key={name}>
                  <Avatar src={itemIcons[name]} shape='square' />
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
              {`${totalCalories < 0 ? '' : '+'}${Math.round(totalCalories)} 卡路里/秒`}
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
            <Text className={`value ${totalHeat < 0 ? "consume" : "produce"}`}>{(totalHeat / 1000).toFixed(1)} 千复制热/秒</Text>
          </View>
        </Collapse.Item>
      </Collapse>

      <Select select={select} onClose={onClose} edit={edit} />

      <Tabbar fixed onSwitch={handleSwitchTab}>
        <Tabbar.Item title="产物计算" icon={<Icon name='refine' width={24} height={24} />} />
        <Tabbar.Item title="关于" icon={<Icon name='ideaDisabled' width={24} height={24} />} />
      </Tabbar>
    </View>
  )
}

export default Index
