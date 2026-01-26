import { useEffect, useState } from "react";
import { View, Text, Image, Button, Navigator } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { Cell } from "@nutui/nutui-react-taro";
import { ArrowRight } from "@nutui/icons-react-taro";
import BackButton from "src/components/ui/BackButton";
import { sharedMessage, API_BASE } from "src/types/data";
import icon from 'src/icon.png';

import './support.scss';

export default function Support() {

    useShareAppMessage(() => sharedMessage);

    const [apps, setApps] = useState([]);

    useEffect(() => {
        Taro.showLoading({
            title: '加载中',
        });

        Taro.request({
            url: `${API_BASE}/api/v1/wechat/apps`,
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
        <View className='page support flex flex-col gap-4'>
            {process.env.TARO_ENV === 'h5' && <BackButton />}
            <View className="flex flex-col items-center bg-white gap-8 p-16 rounded-6">
                <Image className="w-64 h-64" src={icon} />
                <Text className="text-sm text-gray">《oni产物计算器》的更新维护离不开您的支持！您可以通过以下方式支持我。</Text>
            </View>
            <Cell.Group className="cells">
                <Cell className="px-13 py-0" clickable>
                    <Button openType="share" className="btn-share flex items-center justify-between w-full h-42 p-0 bg-transparent">
                        <Text className="text-sm text-gray">分享给好友❤️</Text>
                        <ArrowRight size={16} />
                    </Button>
                </Cell>
                {
                    apps.map((item: any) => (
                        <Cell key={item._id} className="p-0">
                            <Navigator className="flex items-center justify-between w-full gap-8 px-16 py-13" openType="navigate" target="miniProgram" appId={item.appid} version="release">
                                <Image className="w-64 h-64" src={item.img} />
                                <View className="flex flex-col items-start justify-center flex-1 gap-8">
                                    <Text className="text-md text-ink font-bold">{item.name}</Text>
                                    <Text className="text-xs text-gray-500">{item.note}</Text>
                                </View>
                                <ArrowRight size={16} />
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