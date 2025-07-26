
import { useContext, useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components'
import { Avatar, Badge, Collapse, Grid, Tabbar } from '@nutui/nutui-react-taro'

import Icon, { itemIcons } from 'src/components/icons'
import plus from 'src/components/icons/plus.png'
import Select from 'src/components/Select';
import { SelectionsContext } from 'src/components/SelectionsContext';
import { Item, Resources } from 'src/components/data';

import './index.scss'

const selectionCategories = ['复制人/仿生人', '建筑', '动物', '植物', '相变'];
const resultCategories = ['资源', '食物', '电力', '热量'];

function Index() {

  const [select, setSelect] = useState<string>('');
  const [edit, setEdit] = useState<Item | undefined>(undefined);
  const selections = useContext(SelectionsContext);
  const [resources, setResources] = useState<Resources>({});

  useEffect(() => {
    const newResources: Resources = {};
    selections.forEach(selection => {
      // 基础
      Object.entries(selection.item.detail!.resources).forEach(([name, value]) => {
        const resourceValue = selection.count * value;
        newResources[name] = (newResources[name] || 0) + resourceValue;
      });
      // 模式
      selection.item.detail!.modes.forEach(mode => {
        const modeValue = selection.modes[mode.name] || 0;
        const modeOption = mode.options[modeValue];
        Object.entries(modeOption.resources).forEach(([name, value]) => {
          const resourceValue = selection.count * value;
          newResources[name] = (newResources[name] || 0) + resourceValue;
        });
      });
    });
    console.table(Object.entries(newResources).map(([name, value]) => ({
      resource: name,
      value: Math.round(value),
      unit: 'g/s'
    })));
    setResources(newResources);
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

  return (
    <View className='nutui-react-demo'>
      <Collapse defaultActiveName={selectionCategories} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        {selectionCategories.map(category =>
          <Collapse.Item title={category} name={category} key={category} >
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
          </Collapse.Item>)}
      </Collapse>

      <Collapse defaultActiveName={resultCategories} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        <Collapse.Item title="资源" name='资源'>
          <Grid style={{ width: '100%' }} columns={Object.keys(resources).length >= 5 ? 5 : Object.keys(resources).length}>
            {Object.entries(resources).map(([name, value]) => {
              return (
                <Grid.Item key={name}>
                  <Avatar src={itemIcons[name]} shape='square' />
                  <Text className='resource-name'>{name}</Text>
                  <Text className={`value ${value < 0 ? "consume" : "produce"}`}>
                    {`${value < 0 ? '' : '+'}${Math.round(value)} g/s`}
                  </Text>
                </Grid.Item>
              )
            })}
          </Grid>
        </Collapse.Item>
        <Collapse.Item title="食物" name="食物">
          暂不支持
        </Collapse.Item>
        <Collapse.Item title="电力" name="电力">
          暂不支持
        </Collapse.Item>
        <Collapse.Item title="热量" name="热量">
          暂不支持
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
