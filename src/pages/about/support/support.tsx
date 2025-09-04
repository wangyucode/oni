import { View, Text, Image } from "@tarojs/components";

import thanks from 'src/xiexie.jpg';
import './support.scss'
import { Cell } from "@nutui/nutui-react-taro";
import { ArrowRight } from "@nutui/icons-react-taro";

export default function Support() {
    return (
        <View className='root'>
            <View className="header">
                <Image className="thanks" src={thanks} />
                <Text className="desc">《oni产物计算器》的更新维护离不开您的支持！您可以通过以下方式支持我们。</Text>
            </View>
            <Cell.Group>
                <Cell title="分享给好友❤️" extra={<ArrowRight />} />
                <Cell title="打赏我" extra={<ArrowRight />} />
                <Cell title="意见反馈QQ群" extra={<Text selectable>1026563022</Text>} />
                <Cell title="联系我" extra={<Text selectable>wangyu@wycode.cn</Text>} />
            </Cell.Group>
        </View>
    )
}