
import { useState } from 'react';
import { View } from '@tarojs/components'
import { Avatar, Badge, Collapse, Tabbar, Table } from '@nutui/nutui-react-taro'

import Icon from 'src/components/icons'
import plus from '../../components/icons/plus.png'
import dupe from '../../components/icons/dupe.png'
import './index.scss'
import Select from 'src/components/Select';

function Index() {

  const [select, setSelect] = useState<string>('')

  function handleSwitchTab(index: number) {
    // TODO: 切换Tabbar
    console.log(index)

  }

  function handleAddDupe() {
    setSelect('复制人/仿生人');
  }

  function onClose() {
    setSelect('');
  }

  const resourceColumns = [
    {
      title: '资源',
      key: 'name',
    },
    {
      title: '消耗(kg/s)',
      key: 'input',
    },
    {
      title: '产出(kg/s)',
      key: 'output',
    },
    {
      title: '总计(kg/s)',
      key: 'level',
    }
  ]

  return (
    <View className='nutui-react-demo'>
      <Collapse defaultActiveName={['dupe', 'building', "creature", "plant"]} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        <Collapse.Item title="复制人/仿生人" name='dupe'>
          <Avatar.Group gap='-4'>
            <Badge value="8">
              <Avatar
                src={dupe}
              />
            </Badge>

          </Avatar.Group>

          <Avatar src={plus} onClick={handleAddDupe} style={{ marginLeft: 10, backgroundColor: '#7F3D5E' }} />

        </Collapse.Item>
        <Collapse.Item title="建筑" name="building">
          建筑
        </Collapse.Item>
        <Collapse.Item title="动物" name="creature">
          动物
        </Collapse.Item>
        <Collapse.Item title="植物" name="plant">
          植物
        </Collapse.Item>
      </Collapse>
      <Collapse defaultActiveName={['resource', 'food', "power"]} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
        <Collapse.Item title="资源" name='resource'>
          <Table columns={resourceColumns}></Table>
        </Collapse.Item>
        <Collapse.Item title="食物" name="food">
          食物
        </Collapse.Item>
        <Collapse.Item title="电力" name="power">
          电力
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
