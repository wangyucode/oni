import { View } from "@tarojs/components";
import { Cell } from "@nutui/nutui-react-taro";
import { useShareAppMessage } from "@tarojs/taro";
import { sharedMessage } from "src/components/data";

export default function Log() {

    useShareAppMessage(() => sharedMessage);

    return (
        <View className='root'>
            <Cell.Group>
                <Cell title="1.0" extra='2025-09-07' description='提供《缺氧》产物平衡计算功能' />
                <Cell title="1.3" extra='2025-09-11' description='支持保留上次的选择/计算结果' />
            </Cell.Group>
        </View>
    )
}