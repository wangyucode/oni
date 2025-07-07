
import { useContext, useEffect, useState } from 'react';
import { View, Text } from '@tarojs/components'
import { Avatar, Badge, Collapse, Grid, Tabbar } from '@nutui/nutui-react-taro'

import Icon, { itemIcons } from 'src/components/icons'
import plus from 'src/components/icons/plus.png'
import Select from 'src/components/Select';
import { SelectionsContext } from 'src/components/SelectionsContext';
import { Resource } from 'src/components/data';

import './index.scss'

const selectionTypes = ['复制人/仿生人', '建筑', '动物', '植物']

function Index() {

  const [select, setSelect] = useState<string>('');
  const selections = useContext(SelectionsContext);
  const [resources, setResources] = useState<Array<Resource>>([])

  function handleSwitchTab(index: number) {
    // TODO: 切换Tabbar
    console.log(index);
  }

  function handleAdd(type) {
    setSelect(type);
  }

  function onClose() {
    setSelect('');
  }

  useEffect(() => {
    const newResources: Array<Resource> = [];
    selections.forEach(selection => {
      // 基础
      selection.item.detail!.resources.forEach(resource => {
        const resourceItem = newResources.find(r => r.name === resource.name);
        if (resourceItem) {
          resourceItem.value = resourceItem.value + resource.value;
        } else {
          newResources.push({ ...resource });
        }
      });
      // 模式
      selection.item.detail!.modes.forEach(mode => {
        const modeValue = selection.modes[mode.name] || 0;
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
      // 数量
      newResources.forEach(resource => resource.value = resource.value * selection.count);
    });
    setResources(newResources);
    console.log(newResources)
  }, [selections])

  return (
    <View className='nutui-react-demo'>
      <Collapse defaultActiveName={selectionTypes} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        {selectionTypes.map(type =>
          <Collapse.Item title={type} name={type} key={type} >
            <Avatar.Group gap='-4'>
              {selections.filter(s => s.type === type).map(({ count, item }) =>
                <Badge value={count} key={item.name}>
                  <Avatar
                    src={itemIcons[item.name]}
                    shape='square'
                  />
                </Badge>)}
            </Avatar.Group>
            <Avatar className='avatar-add' shape='square' src={plus} onClick={() => handleAdd(type)} style={{ backgroundColor: '#7F3D5E' }} />
          </Collapse.Item>)}
      </Collapse>

      <Collapse defaultActiveName={['resource', 'food', "power"]} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        <Collapse.Item title="资源" name='resource'>
          <Grid>
            {resources.map(resource => {
              return (
                <Grid.Item key={`${resource.name}`} >
                  <Avatar src={itemIcons[resource.name]} shape='square' />
                  <Text>{resource.name}</Text>
                  <Text className={`value ${resource.value < 0 ? "consume" : "produce"}`}>
                    {`${resource.value < 0 ? '' : '+'}${Math.round(resource.value)} g/s`}
                  </Text>
                </Grid.Item>
              )
            })}
          </Grid>
        </Collapse.Item>
        <Collapse.Item title="食物" name="food">
          暂不支持
        </Collapse.Item>
        <Collapse.Item title="电力" name="power">
          暂不支持
        </Collapse.Item>
      </Collapse>

      <Select select={select} onClose={onClose} />

      <Tabbar fixed onSwitch={handleSwitchTab}>
        <Tabbar.Item title="产物计算" icon={<Icon name='refine' width={24} height={24} />} />
        <Tabbar.Item title="关于" icon={<Icon name='ideaDisabled' width={24} height={24} />} />
      </Tabbar>
    </View>
  )
}

export default Index
