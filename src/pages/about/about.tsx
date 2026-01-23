import Taro, { useShareAppMessage } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { Avatar, Cell, Switch } from "@nutui/nutui-react-taro";
import { ArrowRight } from "@nutui/icons-react-taro";

import icon from 'src/icon.png'
import { sharedMessage } from "src/components/data";
import { useUnit } from "src/components/UnitContext";



export default function About() {

    const { timeUnit, toggleTimeUnit } = useUnit();

    useShareAppMessage(() => sharedMessage);

    const isCycle = timeUnit === '周期';

    const toggleMode = () => {
        toggleTimeUnit();
    }

    function handleLogClick() {
        Taro.navigateTo({
            url: '/pages/about/log/log',
        });
    }

    function handleSupportClick() {
        Taro.navigateTo({
            url: '/pages/about/support/support',
        });
    }

    return (
        <View className='root'>
            <View className="flex flex-col items-center bg-white border border-black gap-8 p-16 rounded-6">
                <Avatar src={icon} size="large" />
                <Text className="text-base font-bold text-black">ONI产物计算器{process.env.TARO_APP_VERSION}</Text>
                <Text className="text-13 text-gray">本小程序提供《缺氧》产物平衡计算功能，仅作交流学习使用。所使用的物品名称，图标等版权归科雷娱乐所有。</Text>
            </View>
            <Cell.Group className="about-cells">
                <Cell title="更新日志" extra={<ArrowRight size={16} />} onClick={handleLogClick} align="center" clickable />
                <Cell title="支持运营" extra={<ArrowRight size={16} />} onClick={handleSupportClick} align="center" clickable />
            </Cell.Group>

            <Cell.Group className="about-cells">
                <Cell className='border border-black shadow-none' align="center" title="切换时间单位" extra={
                      <>
                        <Text className='text-primary font-bold mr-4'>{isCycle ? '周期' : '秒'}</Text>
                        <Switch checked={isCycle} onChange={toggleMode} />
                      </>
                    } />
            </Cell.Group>          

        </View>
    )
}