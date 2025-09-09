import Taro, { useShareAppMessage } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { Avatar, Cell } from "@nutui/nutui-react-taro";
import { ArrowRight } from "@nutui/icons-react-taro";

import icon from 'src/icon.png'
import { sharedMessage } from "src/components/data";
import './about.scss'

export default function About() {

    useShareAppMessage(() => sharedMessage);

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
            <View className="about-header">
                <Avatar src={icon} size="large" />
                <Text className="title">ONI产物计算器1.2</Text>
                <Text className="desc">本小程序提供《缺氧》产物平衡计算功能，仅作交流学习使用。所使用的物品名称，图标等版权归科雷娱乐所有。</Text>
            </View>
            <Cell.Group className="about-cells">
                <Cell title="更新日志" extra={<ArrowRight />} onClick={handleLogClick} clickable />
                <Cell title="支持运营" extra={<ArrowRight />} onClick={handleSupportClick} clickable />
            </Cell.Group>
        </View>
    )
}