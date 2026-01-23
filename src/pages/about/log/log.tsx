import { View, Text } from "@tarojs/components";
import { Cell } from "@nutui/nutui-react-taro";
import { useShareAppMessage } from "@tarojs/taro";
import { sharedMessage } from "src/components/data";
import BackButton from "src/components/back/BackButton";




export default function Log() {

    useShareAppMessage(() => sharedMessage);

    return (
        <View className='root page-log flex flex-col gap-4'>

            {process.env.TARO_ENV === 'h5' && <BackButton />}
            <Cell.Group className="cells">
                <Cell title="1.0" extra='2025-09-07' description='提供《缺氧》产物平衡计算功能' />
                <Cell title="1.3" extra='2025-09-11' description='支持保留上次的选择/计算结果' />
                <Cell title="1.4" extra='2025-09-14' description='增加清空选择按钮' />
                <Cell title="1.5.0" extra='2025-09-14' description='新增显示单位切换功能' />
                <Cell title="2.0.0" extra='2026-01-21' description={
                    <>
                        <Text>• 重构整个项目，实现大家的反馈建议</Text>
                        <Text>• 调整首页显示，资源在上，选择在下</Text>
                        <Text>• 新增滑动条支持数字方式输入</Text>
                    </>
                } />
            </Cell.Group>
        </View>
    )
}
