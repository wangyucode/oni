import { View, Text } from "@tarojs/components";
import { Cell } from "@nutui/nutui-react-taro";
import { useShareAppMessage } from "@tarojs/taro";
import { sharedMessage } from "src/components/data";
import BackButton from "src/components/back/BackButton";

import './log.scss'

export default function Log() {

    useShareAppMessage(() => sharedMessage);

    return (
        <View className='page log flex flex-col gap-4'>

            {process.env.TARO_ENV === 'h5' && <BackButton />}
            <Cell.Group className="cells">
                <Cell title="1.0" extra='2025-09-07' description='提供《缺氧》产物平衡计算功能' />
                <Cell title="1.3" extra='2025-09-11' description='支持保留上次的选择/计算结果' />
                <Cell title="1.4" extra='2025-09-14' description='增加清空选择按钮' />
                <Cell title="1.5.0" extra='2025-09-14' description='新增显示单位切换功能' />
                <Cell title="2.0.0" extra='2026-01-21' description={
                    <>
                        <Text>• 调整首页显示，资源在上，选择在下，统一选择入口</Text>
                        <Text>• 新增滑动条支持数字方式输入</Text>
                        <Text>• 关于改为设置，将显示单位切换功能从首页移动到设置页</Text>
                        <Text>• 小动物支持选择额外蛋是否孵化</Text>
                        <Text>• 乔木树和漫殖藤支持选择枝桠数量</Text>
                        <Text>• 支持选择间歇泉和其产量</Text>
                        <Text>• 新增饥饿/功率难度设置</Text>
                    </>
                } />
            </Cell.Group>
        </View>
    )
}
