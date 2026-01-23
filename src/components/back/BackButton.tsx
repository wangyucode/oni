import { ArrowLeft } from "@nutui/icons-react-taro";
import { Button } from "@nutui/nutui-react-taro";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";


export default function BackButton() {
    return (
        <Button className="btn-back" size="large" onClick={() => Taro.navigateBack()}>
            <View className="flex items-center gap-4">
                <ArrowLeft />
                返回
            </View>
        </Button>
    )
}