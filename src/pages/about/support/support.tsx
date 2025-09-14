import { useEffect, useState } from "react";
import { View, Text, Image, Button, Navigator } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { Cell } from "@nutui/nutui-react-taro";
import { ArrowRight } from "@nutui/icons-react-taro";
import BackButton from "src/components/back/BackButton";
import { sharedMessage } from "src/components/data";
import icon from 'src/icon.png';

import './support.scss'

export default function Support() {

    useShareAppMessage(() => sharedMessage);

    const [apps, setApps] = useState([]);

    useEffect(() => {
        Taro.showLoading({
            title: '加载中',
        });

        Taro.request({
            url: 'https://wycode.cn/api/v1/wechat/apps',
            method: 'GET',
            success: (res) => {
                console.log(res);
                if (res.data.success) {
                    setApps(res.data.payload);
                }
            },
            complete: () => {
                Taro.hideLoading();
            }
        })
    }, []);

    return (
        <View className='root support'>
            {process.env.TARO_ENV === 'h5' && <BackButton />}
            <View className="header">
                <Image className="icon" src={icon} />
                <Text className="desc">《oni产物计算器》的更新维护离不开您的支持！您可以通过以下方式支持我。</Text>
            </View>
            <Cell.Group className="cells">
                <Cell className="share-cell" clickable>
                    <Button openType="share" className="share">
                        <Text className="share-title">分享给好友❤️</Text>
                        <ArrowRight />
                    </Button>
                </Cell>
                {
                    apps.map((item: any) => (
                        <Cell key={item._id} className="app-cell">
                            <Navigator className="app-navigator" openType="navigate" target="miniProgram" appId={item.appid} version="release">
                                <Image className="app-img" src={item.img} />
                                <View className="app-info">
                                    <Text className="app-name">{item.name}</Text>
                                    <Text className="app-desc">{item.note}</Text>
                                </View>
                                <ArrowRight />
                            </Navigator>
                        </Cell>
                    ))
                }
                <Cell title="意见反馈QQ群" extra={<Text selectable>1026563022</Text>} />
                <Cell title="联系我" extra={<Text selectable>wangyu@wycode.cn</Text>} />
            </Cell.Group>
        </View>
    )
}