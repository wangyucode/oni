import { View, Text } from '@tarojs/components';
import { Button } from '@nutui/nutui-react-taro';
import Taro from '@tarojs/taro';
import BackButton from '@/components/ui/BackButton';
import './oxygen.scss';

export default function Oxygen() {
  return (
    <View className='page oxygen p-8'>
      {process.env.TARO_ENV === 'h5' && <BackButton />}
      <View className='flex flex-col items-center justify-center' style={{ minHeight: '80vh' }}>
        <Text className='text-white text-lg'>制氧计算 (开发中)</Text>
        <Button className='mt-8' onClick={() => Taro.navigateBack()}>返回</Button>
      </View>
    </View>
  );
}
