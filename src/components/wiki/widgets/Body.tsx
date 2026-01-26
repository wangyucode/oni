import { View, Text } from '@tarojs/components';
import { BodyWidget } from '@/types/data';

interface BodyProps {
  data: BodyWidget['data'];
  onPush?: (url: string) => void;
}

const Body = ({ data, onPush }: BodyProps) => {
  return (
    <View className='body-widget my-4 text-sm'>
      {data.map((segment, index) => {
        const { type, data: segmentData } = segment;
        switch (type) {
          case 'text':
            return (
              <Text key={index} className=''>
                {segmentData.text}
              </Text>
            );
          case 'bold':
            return (
              <Text key={index} className='font-bold'>
                {segmentData.text}
              </Text>
            );
          case 'link':
            return (
              <Text
                key={index}
                className='text-primary mx-2'
                style={{ textDecoration: 'underline' }}
                onClick={() => segmentData.link && onPush?.(segmentData.link)}
              >
                {segmentData.text}
              </Text>
            );
          default:
            return null;
        }
      })}
    </View>
  );
};

export default Body;
