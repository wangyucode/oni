import { ArrowLeft } from "@nutui/icons-react-taro";
import { Button } from "@nutui/nutui-react-taro";

import './BackButton.scss'
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";


export default function BackButton() {
    return (
        <Button className="back" size="large" onClick={() => Taro.navigateBack()}>
            <View className="content">
                <ArrowLeft />
                返回
            </View>
        </Button>
    )
}