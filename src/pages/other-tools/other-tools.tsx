import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import MenuGrid from '@/components/ui/MenuGrid';
import GlobalSvgFilters from '@/components/ui/GlobalSvgFilters';
import './other-tools.scss';

const TOOLS = [
  { name: '制氧计算', icon: 'Oxygen', url: '/pages/other-tools/oxygen/oxygen' },
  { name: '食物计算', icon: 'Food', url: '/pages/other-tools/food/food' },
  { name: '火箭计算', icon: 'Rocket', url: '/pages/other-tools/rocket/rocket' },
];

export default function OtherTools() {
  const handleItemClick = (item: (typeof TOOLS)[0]) => {
    Taro.navigateTo({ url: item.url });
  };

  return (
    <View className='page other-tools p-8'>
      <MenuGrid items={TOOLS} onItemClick={handleItemClick} columns={3} />
      <GlobalSvgFilters />
    </View>
  );
}
