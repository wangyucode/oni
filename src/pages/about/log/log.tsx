import { View } from "@tarojs/components";
import { Cell } from "@nutui/nutui-react-taro";

export default function Log() {
    return (
        <View className='root'>
            <Cell.Group>
                <Cell title="1.0" extra='2025-09-05' description='提供《缺氧》产物平衡计算功能' />
            </Cell.Group>
        </View>
    )
}