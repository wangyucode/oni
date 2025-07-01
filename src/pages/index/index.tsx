
import { useState } from 'react';
import { View } from '@tarojs/components'
import { Collapse, Tabbar, Table } from '@nutui/nutui-react-taro'

import './index.scss'
import { IconRefine, IconRefineDisabled, IconIdea, IconIdeaDisabled, IconRightArrow } from 'src/components/icons'

function Index() {

  const [activeTab, setActiveTab] = useState(0);

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
      <Collapse defaultActiveName={['dupe', 'building', "creature", "plant"]} expandIcon={<IconRightArrow />} rotate={90}>
        <Collapse.Item title="复制人/仿生人" name='dupe'>

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
      <Collapse defaultActiveName={['resource', 'food', "power"]} expandIcon={<IconRightArrow />} rotate={90}>
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
      <Tabbar fixed value={activeTab} onSwitch={setActiveTab}>
        <Tabbar.Item title="产物计算" icon={(activeTab === 0 ? <IconRefine /> : <IconRefineDisabled />)} />
        <Tabbar.Item title="关于" icon={(activeTab === 1 ? <IconIdea /> : <IconIdeaDisabled />)} />
      </Tabbar>
    </View>
  )
}

export default Index
