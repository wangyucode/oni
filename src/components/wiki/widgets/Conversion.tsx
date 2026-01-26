import { View, Text } from '@tarojs/components';
import { ConversionWidget, ORIGIN_BASE, ConversionItem as IConversionItem } from '@/types/data';
import FilteredImage from '@/components/ui/FilteredImage';
import { getFilter } from '@/utils/utils';

interface ConversionProps {
  data: ConversionWidget['data'];
  onPush: (url: string) => void;
}

const ConversionItem = ({ item, onPush, isFabricator = false }: { item: IConversionItem, onPush: (url: string) => void, isFabricator?: boolean }) => {
  return (
    <View
      className={`conversion-item flex flex-col items-center gap-1 ${item.link ? 'cursor-pointer active:opacity-70' : ''}`}
      onClick={() => item.link && onPush(item.link)}
    >
      <View className='relative'>
        <FilteredImage
          src={`${ORIGIN_BASE}/upload/oni/v3${item.icon}`}
          iconFilter={getFilter(item.style)}
          style={{ width: isFabricator ? 64 : 40, height: isFabricator ? 64 : 40 }}
          mode="aspectFit"
        />
        {item.value && (
          <Text className='absolute -bottom-1 -right-1 text-[10px] bg-black/60 text-white px-1 rounded-sm'>
            {item.value}
          </Text>
        )}
      </View>
      <Text className={`text-[10px] text-center leading-tight ${isFabricator ? 'font-bold' : ''}`}>{item.name}</Text>
    </View>
  );
};

const Conversion = ({ data, onPush }: ConversionProps) => {
  return (
    <View className='conversion-panel flex flex-row items-center justify-around w-full border border-solid border-[#eee] rounded-lg p-3 my-2 bg-[#f9f9f9]'>
      <View className='flex-1 flex flex-row flex-wrap justify-center gap-2'>
        {data.from.map((item, idx) => (
          <ConversionItem key={idx} item={item} onPush={onPush} />
        ))}
      </View>

      <View className='flex flex-col items-center mx-2 gap-1'>
        <Text className='text-[#999] text-xs'>➜</Text>
        <ConversionItem item={data.fabricator} onPush={onPush} isFabricator />
        <Text className='text-[#999] text-xs'>➜</Text>
      </View>

      <View className='flex-1 flex flex-row flex-wrap justify-center gap-2'>
        {data.to.map((item, idx) => (
          <ConversionItem key={idx} item={item} onPush={onPush} />
        ))}
      </View>
    </View>
  );
};

export default Conversion;
