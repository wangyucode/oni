
import { MouseEvent, useContext, useState } from 'react';
import { useShareAppMessage } from '@tarojs/taro';
import { View, Text } from '@tarojs/components'
import { Badge, Button, Collapse, Cell, Picker, PickerOption, PickerOptions, PickerOnChangeCallbackParameter, PickerValue } from '@nutui/nutui-react-taro'
import { Add, ArrowRight } from '@nutui/icons-react-taro';

import Icon from 'src/components/icons'
import SelectPopup from 'src/components/SelectPopup';
import ResourceGrid from 'src/components/ResourceGrid';
import { HUNGER_OPTIONS, TIME_UNIT_OPTIONS, useUnit, HungerLevel, TimeUnit } from 'src/components/UnitContext';
import { useSelections, useSelectionsActions } from 'src/components/SelectionsContext';
import { sharedMessage } from 'src/components/data';
import FilteredImage from 'src/components/FilteredImage';
import EditPopup from 'src/components/EditPopup';
import { DataContext } from 'src/components/DataContext';
import { getIconData } from 'src/components/utils';
import GlobalSvgFilters from 'src/components/GlobalSvgFilters';

import './index.scss'

const resultCategories = ['资源', '食物', '电力', '热量'];

function Index() {

  useShareAppMessage(() => sharedMessage);
  const { timeUnit, setTimeUnit, hungerLevel, setHungerLevel } = useUnit();
  const [isShowSelectPopup, setIsShowSelectPopup] = useState(false);
  const [isShowEditPopup, setIsShowEditPopup] = useState(false);
  const [setting, setSetting] = useState({
    isShowSettingsPicker: false,
    title: '',
    options: [] as PickerOptions[],
    value: [] as PickerValue[],
  });

  const onSettingConfirm = (selectedOptions: PickerOption[]) => {
    const val = selectedOptions[0]?.value;
    if (val === undefined) return;
    if (setting.title === '饥饿/电力难度') {
      setHungerLevel(val as HungerLevel);
    } else if (setting.title === '时间单位') {
      setTimeUnit(val as TimeUnit);
    }
    setSetting({ ...setting, isShowSettingsPicker: false, value: [val] });
  };

  const showTimeUnitPicker = () => {
    setSetting({
      isShowSettingsPicker: true,
      title: '时间单位',
      options: [TIME_UNIT_OPTIONS],
      value: [timeUnit],
    });
  };

  const showHungerPicker = () => {
    setSetting({
      isShowSettingsPicker: true,
      title: '饥饿/电力难度',
      options: [HUNGER_OPTIONS.map(o => ({ label: o.label, value: o.label }))],
      value: [hungerLevel],
    });
  };

  const { selections, groupedSelections, summary } = useSelections();
  const { clear } = useSelectionsActions();
  const { resourceItems, totalCalories, totalPower, totalHeat } = summary;
  const { iconMap } = useContext(DataContext);

  function handleAdd() {
    setIsShowSelectPopup(true);
  }

  function onPopupClose() {
    setIsShowSelectPopup(false);
  }

  function onEditPopupClose() {
    setIsShowEditPopup(false);
  }

  function reset(e: MouseEvent) {
    clear();
    e.stopPropagation();
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
    <View className='page index'>
      <View className='flex flex-col flex-1 gap-8'>
        <Collapse defaultActiveName={resultCategories} expandIcon={<Icon width={12} height={16} name='rightArrow' />} rotate={90}>
          <Collapse.Item title="资源" name='资源'>
            <ResourceGrid items={resourceItems} />
          </Collapse.Item>
          <Collapse.Item title="食物" name="食物">
            <View className="text-center">
              <Text className={`text-sm font-bold ${convertedCalories < 0 ? "consume" : "produce"}`}>
                {`${convertedCalories < 0 ? Math.floor(convertedCalories) : '+' + Math.floor(convertedCalories)} ${caloriesUnit}`}
              </Text>
            </View>
          </Collapse.Item>
          <Collapse.Item title="电力" name="电力">
            <View className="text-center">
              <Text className={`text-sm font-bold ${totalPower < 0 ? "consume" : "produce"}`}>
                {`${totalPower < 0 ? Math.floor(totalPower) : '+' + Math.floor(totalPower)} 瓦`}
              </Text>
            </View>
          </Collapse.Item>
          <Collapse.Item title="热量" name="热量">
            <View className="text-center">
              <Text className={`text-sm font-bold ${convertedHeat < 0 ? "consume" : "produce"}`}>
                {`${convertedHeat < 0 ? Math.floor(convertedHeat) : '+' + Math.floor(convertedHeat)} ${heatUnit}`}
              </Text>
            </View>
          </Collapse.Item>
        </Collapse>

        <Collapse
          className='flex flex-col'
          defaultActiveName={['选择']}
          expandIcon={<Icon width={12} height={16} name='rightArrow' />}
          rotate={90}>
          <Collapse.Item title="选择" name="选择" extra={<Button className='rounded-4 text-white' fill='outline' color='#fff' onClick={reset}>清空</Button>}>
            <View className='flex flex-wrap gap-8 mt-8'>
              {groupedSelections.map((selection) =>
                <View
                  key={selection.key}
                  onClick={() => {
                    setIsShowEditPopup(true);
                  }}
                >
                  <Badge value={selection.count} max={999}>
                    {(() => {
                      const iconData = getIconData(iconMap, selection.name);
                      if (!iconData?.icon) return <Icon name={selection.name} width={48} height={48} />;
                      return (
                        <FilteredImage
                          src={iconData.icon}
                          iconFilter={iconData.iconFilter}
                          style={{ width: 48, height: 48 }}
                          mode="aspectFit"
                        />
                      );
                    })()}
                  </Badge>
                </View>)}
              <Button className='w-48 h-48 rounded-4 border border-primary ml-4 p-0' onClick={handleAdd}><Add width={24} height={24} color='#7f3d5e' /></Button>
            </View>
          </Collapse.Item>
        </Collapse>

        <Cell.Group className="settings">
          <Cell align="center" title="时间单位" clickable onClick={showTimeUnitPicker} extra={
            <>
              <Text className='text-primary font-bold mr-4'>{timeUnit}</Text>
              <ArrowRight size={16} />
            </>
          } />
          <Cell align="center" title="饥饿/电力难度" clickable onClick={showHungerPicker} extra={
            <>
              <Text className='text-primary font-bold mr-4'>{hungerLevel}</Text>
              <ArrowRight size={16} />
            </>
          }  />
        </Cell.Group>
      </View>
      <Picker
        visible={setting.isShowSettingsPicker}
        title={setting.title}
        options={setting.options}
        value={setting.value}
        onConfirm={onSettingConfirm}
        onChange={(param: PickerOnChangeCallbackParameter) => setSetting({ ...setting, value: param.value })}
        onCancel={() => setSetting({ ...setting, isShowSettingsPicker: false })}
      />
      <SelectPopup visible={isShowSelectPopup} onClose={onPopupClose} />
      <EditPopup
        visible={isShowEditPopup}
        selections={selections}
        onClose={onEditPopupClose}
      />
      <GlobalSvgFilters />
    </View>
  )
}

export default Index
