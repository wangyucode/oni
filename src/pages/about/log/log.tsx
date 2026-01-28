import { View, Text, AdCustom } from "@tarojs/components";
import { Cell } from "@nutui/nutui-react-taro";
import { useShareAppMessage } from "@tarojs/taro";
import { sharedMessage } from "@/types/data";
import BackButton from "@/components/ui/BackButton";

import './log.scss'

export default function Log() {

    useShareAppMessage(() => sharedMessage);

    return (
        <View className='page log flex flex-col gap-4'>

            {process.env.TARO_ENV === 'h5' && <BackButton />}
            <Cell.Group>
                <Cell title="1.0" extra='2025-09-07' description='提供《缺氧》产物平衡计算功能' />
                <Cell title="1.3" extra='2025-09-11' description='支持保留上次的选择/计算结果' />
                <Cell title="1.4" extra='2025-09-14' description='增加清空选择按钮' />
                <Cell title="1.5.0" extra='2025-09-14' description='新增显示单位切换功能' />
                <Cell title="2.0.0" extra='2026-01-29' description={
                    <>
                        <Text>• 感谢大家的支持，反馈和建议</Text>
                        <Text>• 优化资源显示，统一资源选择方式</Text>
                        <Text>• 智能切换重量单位</Text>
                        <Text>• 小动物支持选择额外蛋是否孵化</Text>
                        <Text>• 复制人支持特质选项</Text>
                        <Text>• 乔木树和漫殖藤支持选择枝桠数量</Text>
                        <Text>• 支持选择间歇泉和其产量</Text>
                        <Text>• 新增饥饿/功率难度设置</Text>
                        <Text>• 新增数据库/百科功能</Text>
                    </>
                } />
            </Cell.Group>
            {process.env.TARO_ENV === 'weapp' && <AdCustom unitId='adunit-737af672508ba1fa' adIntervals={30} />}
        </View>
    )
}
