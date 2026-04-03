import { View, Text } from '@tarojs/components';
import { ConversionWidget, ORIGIN_BASE, ConversionItem as IConversionItem } from '@/types/data';
import FilteredImage from '@/components/ui/FilteredImage';
import { getFilter } from '@/utils/utils';
import { ArrowRight } from '@nutui/icons-react-taro';

interface ConversionProps {
  data: ConversionWidget['data'];
  onPush: (url: string) => void;
}

const ConversionItem = ({ item, onPush, isFabricator = false }: { item: IConversionItem, onPush: (url: string) => void, isFabricator?: boolean }) => {
  return (
    <View
      className={`conversion-item flex flex-col items-center gap-4 rounded-8 p-8 ${item.link ? 'cursor-pointer' : ''} ${isFabricator ? '' : 'border border-gray'}`}
      onClick={() => item.link && onPush(item.link)}
    >
      <FilteredImage
        src={`${ORIGIN_BASE}/upload/oni/v3${item.icon}`}
        iconFilter={getFilter(item.style)}
        style={{ width: isFabricator ? 32 : 40, height: isFabricator ? 32 : 40 }}
        mode='aspectFit'
      />
      <Text className={`text-sm ${isFabricator ? 'font-bold' : ''}`}>{item.name}</Text>
      {item.value && (
        <Text className='text-xs text-gray-500'>
          {item.value}
        </Text>
      )}
    </View>
  );
};

const Conversion = ({ data, onPush }: ConversionProps) => {
  return (
    <View className='conversion-panel flex flex-row items-center justify-between gap-4'>
      <View className='from flex-1 flex flex-row flex-wrap justify-center gap-4'>
        {data.from.map((item, idx) => (
          <ConversionItem key={idx} item={item} onPush={onPush} />
        ))}
      </View>

      {data.from.length > 0 && <ArrowRight size={24} />}

      <View className='flex flex-col items-center mx-2 gap-4'>
        <ConversionItem item={data.fabricator} onPush={onPush} isFabricator />
      </View>

      {data.to.length > 0 && <ArrowRight size={24} />}

      <View className='to flex-1 flex flex-row flex-wrap justify-center gap-4'>
        {data.to.map((item, idx) => (
          <ConversionItem key={idx} item={item} onPush={onPush} />
        ))}
      </View>
    </View>
  );
};

export default Conversion;
