import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import FilteredImage from '@/components/ui/FilteredImage';
import './other-tools.scss';

const TOOLS = [
  { name: '制氧需求计算', icon: 'https://wycode.cn/upload/oni/v3/images/icon_category_oxygen.png', url: '/pages/other-tools/oxygen/oxygen' },
  { name: '食物需求计算', icon: 'https://wycode.cn/upload/oni/v3/images/icon_category_food.png', url: '/pages/other-tools/food/food' },
  { name: '火箭需求计算', icon: 'https://wycode.cn/upload/oni/v3/images/icon_category_rocketry.png', url: '/pages/other-tools/rocket/rocket' },
];

export default function OtherTools() {
  const handleItemClick = (url: string) => {
    Taro.navigateTo({ url });
  };

  return (
    <View className='page other-tools p-8'>
      <View className='large-link-grid'>
        {TOOLS.map((tool) => (
          <View
            key={tool.name}
            className='large-link bg-white p-8 flex flex-col items-center border border-gray rounded-4 gap-8'
            onClick={() => handleItemClick(tool.url)}
          >
            <FilteredImage src={tool.icon} className='h-64 w-64' mode='aspectFit' />
            <Text className='text-md'>{tool.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
