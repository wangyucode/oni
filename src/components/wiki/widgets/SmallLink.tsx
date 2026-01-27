import { View, Text } from '@tarojs/components';
import { LargeLinkWidget, ORIGIN_BASE } from '@/types/data';
import FilteredImage from '@/components/ui/FilteredImage';
import { getFilter } from '@/utils/utils';

interface LargeLinkProps {
  data: LargeLinkWidget['data'];
  onPush: (url: string) => void;
}

const SmallLink = ({ data, onPush }: LargeLinkProps) => {
  return (
    <View
      className='small-link bg-white px-8 flex items-center border border-gray rounded-4 gap-4 w-fit'
      onClick={() => onPush(data.link)}
    >
      {data.icon && (
        <FilteredImage
          src={`${ORIGIN_BASE}/upload/oni/v3${data.icon}`}
          iconFilter={getFilter(data.style)}
          style={{ width: 32, height: 32 }}
          mode="aspectFit" />
      )}
      <Text className='text-md'>{data.text}</Text>
    </View>
  );
};

export default SmallLink;
