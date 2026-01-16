import { useContext } from "react";
import { Image, View } from "@tarojs/components";
import { Popup, Grid } from "@nutui/nutui-react-taro";
import { API_BASE, Menu } from "./data";
import { DataContext } from "./DataContext";

import './SelectPopup.scss';

interface SelectPopupProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (menu: Menu) => void;
}

export default function SelectPopup({ visible, onClose, onSelect }: SelectPopupProps) {
    const { menus } = useContext(DataContext);

    return (
        <Popup
            className="select-popup"
            visible={visible}
            position="bottom"
            title="选择类别"
            onClose={onClose}
            closeable
            style={{ height: '50%', paddingBottom: process.env.TARO_ENV === 'h5' ? 50 : 0 }}
        >
            <Grid columns={3} gap={0}>
                {menus.map((menu) => (
                    <Grid.Item
                        key={menu.name}
                        onClick={() => onSelect(menu)}
                        text={menu.name}
                    >
                        <Image src={`https://wycode.cn/upload/oni/v3${menu.icon}`} style={{ width: 64, height: 64 }} mode="aspectFit" />
                    </Grid.Item>
                ))}
            </Grid>
        </Popup>
    );
}
