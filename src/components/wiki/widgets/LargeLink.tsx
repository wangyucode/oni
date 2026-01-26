import { View, Text } from '@tarojs/components';
import { LargeLinkWidget, ORIGIN_BASE } from '@/types/data';
import FilteredImage from '@/components/ui/FilteredImage';
import { getFilter } from '@/utils/utils';

interface LargeLinkProps {
  data: LargeLinkWidget['data'];
  onPush: (url: string) => void;
}

const LargeLink = ({ data, onPush }: LargeLinkProps) => {
  console.log(data);
  return (
    <View
      className='large-link bg-white p-8 flex flex-col items-center border border-gray rounded-4 gap-4'
      onClick={() => onPush(data.link)}
    >
      {data.icon && (
        <FilteredImage
          src={`${ORIGIN_BASE}/upload/oni/v3${data.icon}`}
          iconFilter={getFilter(data.style)}
          style={{ width: 64, height: 64 }}
          mode="aspectFit" />
      )}
      <Text className='text-md'>{data.text}</Text>
    </View>
  );
};

export default LargeLink;
