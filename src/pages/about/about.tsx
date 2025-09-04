import { View, Text } from "@tarojs/components";
import { Avatar, Cell, Tabbar } from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";

import Icon from "src/components/icons";
import icon from 'src/icon.png'
import './about.scss'
import { ArrowRight } from "@nutui/icons-react-taro";

export default function About() {

    function handleSwitchTab(index: number) {
        if (index === 0) {
            Taro.redirectTo({
                url: '/pages/index/index',
            });
        }
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
            <View className="about-header">
                <Avatar src={icon} size="large" />
                <Text className="title">ONI产物计算器1.0</Text>
                <Text className="desc">本小程序提供《缺氧》产物平衡计算功能，仅作交流学习使用。所使用的物品名称，图标等版权归科雷娱乐所有。</Text>
            </View>
            <Cell.Group>
                <Cell title="更新日志" extra={<ArrowRight />} onClick={handleLogClick} clickable />
                <Cell title="支持运营" extra={<ArrowRight />} onClick={handleSupportClick} clickable />
            </Cell.Group>
            <Tabbar fixed onSwitch={handleSwitchTab} defaultValue={1}>
                <Tabbar.Item title="产物计算" icon={<Icon name='refineDisabled' width={24} height={24} mode="aspectFit" />} />
                <Tabbar.Item title="关于" icon={<Icon name='idea' width={24} height={24} mode="aspectFit" />} />
            </Tabbar>
        </View>
    )
}