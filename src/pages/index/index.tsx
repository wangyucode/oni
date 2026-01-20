
import { useState } from 'react';
import { useShareAppMessage } from '@tarojs/taro';
import { View, Text } from '@tarojs/components'
import { Badge, Button, Collapse } from '@nutui/nutui-react-taro'

import Icon from 'src/components/icons'
import SelectPopup from 'src/components/SelectPopup';
import ResourceGrid from 'src/components/ResourceGrid';
import { useUnit } from 'src/components/UnitContext';
import { useSelections, useSelectionsActions } from 'src/components/SelectionsContext';
import { sharedMessage } from 'src/components/data';
import FilteredImage from 'src/components/FilteredImage';

import './index.scss'
import { Add } from '@nutui/icons-react-taro';
import GlobalSvgFilters from 'src/components/GlobalSvgFilters';

const resultCategories = ['资源', '食物', '电力', '热量'];

function Index() {

  useShareAppMessage(() => sharedMessage);
  const { timeUnit } = useUnit();
  const [isShowSelectPopup, setIsShowSelectPopup] = useState(false);
  const { selections, summary } = useSelections();
  const { clear } = useSelectionsActions();
  const { resourceItems, totalCalories, totalPower, totalHeat } = summary;

  function handleAdd() {
    setIsShowSelectPopup(true);
  }

  function onPopupClose() {
    setIsShowSelectPopup(false);
  }

  function reset() {
    clear();
  }

  const convertCalories = (calories: number): { convertedValue: number, unit: string } => {
    if (timeUnit === '秒') {
      return { convertedValue: calories / 600 * 1000, unit: '卡路里/秒' };
    }
    return { convertedValue: calories, unit: '千卡/周期' };
  };

  const convertHeat = (heat: number): { convertedValue: number, unit: string } => {
    const kHeat = heat / 1000;
    if (timeUnit === '周期') {
      return { convertedValue: kHeat * 600, unit: '千复制热/周期' };
    }
    return { convertedValue: kHeat, unit: '千复制热/秒' };
  };

  const { convertedValue: convertedCalories, unit: caloriesUnit } = convertCalories(totalCalories);
  const { convertedValue: convertedHeat, unit: heatUnit } = convertHeat(totalHeat);

  return (
    <View className='root index'>
      <View className='result'>
        <Collapse defaultActiveName={resultCategories} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
          <Collapse.Item title="资源" name='资源'>
            <ResourceGrid items={resourceItems} />
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

        <Collapse
          className='selection'
          defaultActiveName={['选择']}
          expandIcon={<Icon width={12} height={16} name='rightArrow' />}
          rotate={90}>
          <Collapse.Item title="选择" name="选择" extra={<Button className='reset' fill='outline' color='#fff' onClick={reset}>清空</Button>}>
            <View className='avatar-container'>
              {selections.map(({ key, count, detail }) =>
                <Badge value={count} key={key} max={999}>
                  {detail.icon ? (
                    <FilteredImage
                      src={detail.icon}
                      iconFilter={detail.iconFilter}
                      style={{ width: 48, height: 48 }}
                      mode="aspectFit"
                    />
                  ) : (
                    <Icon name={detail.name} width={48} height={48} />
                  )}
                </Badge>)}
              <Button className='add' onClick={handleAdd}><Add width={24} height={24} color='#7f3d5e' /></Button>
            </View>
          </Collapse.Item>
        </Collapse>
      </View>
      <SelectPopup visible={isShowSelectPopup} onClose={onPopupClose} />
      <GlobalSvgFilters />
    </View>
  )
}

export default Index
