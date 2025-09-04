import { useEffect, useState } from "react";
import { View, Text, Image, Button } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { Cell } from "@nutui/nutui-react-taro";
import { ArrowRight } from "@nutui/icons-react-taro";

import thanks from 'src/xiexie.jpg';
import './support.scss'

export default function Support() {

    useShareAppMessage(() => ({
        title: 'oni产物计算器',
        path: '/pages/index/index',
        imageUrl: 'https://oxygennotincluded.wiki.gg/zh/images/e/ea/%E8%B6%85%E7%BA%A7%E8%AE%A1%E7%AE%97%E6%9C%BA.png',
    }));

    // const [apps, setApps] = useState([]);

    // useEffect(() => {
    //     Taro.showLoading({
    //         title: '加载中',
    //     });

    //     Taro.request({
    //         url: 'https://wycode.cn/api/v1/wechat/apps',
    //         method: 'GET',
    //         success: (res) => {
    //             console.log(res);
    //             if (res.data.success) {
    //                 setApps(res.data.payload);
    //             }
    //         },
    //         complete: () => {
    //             Taro.hideLoading();
    //         }
    //     })
    // }, []);

    function handleReward() {
        Taro.previewImage({ urls: ["https://wycode.cn/upload/image/fish/reward.jpg"] });
    }

    return (
        <View className='root'>
            <View className="header">
                <Image className="thanks" src={thanks} />
                <Text className="desc">《oni产物计算器》的更新维护离不开您的支持！您可以通过以下方式支持我们。</Text>
            </View>
            <Cell.Group>
                <Cell>
                    <Button openType="share" className="share">
                        <Text className="share-title">分享给好友❤️</Text>
                        <ArrowRight />
                    </Button>
                </Cell>
                <Cell title="打赏我" extra={<ArrowRight />} onClick={handleReward} />
                <Cell title="意见反馈QQ群" extra={<Text selectable>1026563022</Text>} />
                <Cell title="联系我" extra={<Text selectable>wangyu@wycode.cn</Text>} />
            </Cell.Group>
        </View>
    )
}