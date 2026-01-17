import { useContext, useEffect, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import { Button, Grid, Popup } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";
import { Menu } from "./data";
import { CalculatorGridItem, CalculatorGridModel, DataContext } from "./DataContext";

import './SelectPopup.scss';

interface SelectPopupProps {
    visible: boolean;
    onClose: () => void;
    onSelectItem?: (item: CalculatorGridItem, menu: Menu) => void;
}


export default function SelectPopup({ visible, onClose, onSelectItem }: SelectPopupProps) {
    const { menus, getMenuModel } = useContext(DataContext);
    const [view, setView] = useState<"menu" | "grid">("menu");
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [model, setModel] = useState<CalculatorGridModel | null>(null);

    useEffect(() => {
        if (!visible) {
            setView("menu");
            setSelectedMenu(null);
            setModel(null);
        }
    }, [visible]);

    function handleClose() {
        setView("menu");
        setSelectedMenu(null);
        onClose();
    }

    function goBack() {
        setView("menu");
        setSelectedMenu(null);
        setModel(null);
    }

    function handleSelectMenu(menu: Menu) {
        setSelectedMenu(menu);
        setView("grid");
        setModel(null);
        void getMenuModel(menu.file).then(setModel).catch(() => { });
    }

    return (
        <Popup
            className="select-popup"
            visible={visible}
            position="bottom"
            title={view === "menu" ? "选择类别" : (model?.title || selectedMenu?.name || "加载...")}
            left={view === "grid" ? <Button className="back" onClick={goBack}><ArrowLeft size={16} />返回</Button> : null}
            onClose={handleClose}
            closeable
            style={{ height: '50%', paddingBottom: process.env.TARO_ENV === 'h5' ? 50 : 0 }}
        >
            {view === "menu" ? (
                <Grid columns={3} gap={0}>
                    {menus.map((menu) => (
                        <Grid.Item
                            key={menu.name}
                            onClick={() => handleSelectMenu(menu)}
                            text={menu.name}
                        >
                            <Image src={menu.icon} style={{ width: 64, height: 64 }} mode="aspectFit" />
                        </Grid.Item>
                    ))}
                </Grid>
            ) : (
                <View style={{ flex: 1 }}>
                    {!model ? (
                        <View style={{ padding: 16 }}>
                            <Text>加载中...</Text>
                        </View>
                    ) : null}
                    {model ? (
                        <Grid columns={model.columns || 3} gap={0}>
                            {model.items.map((item) => (
                                <Grid.Item
                                    key={item.name}
                                    text={item.name}
                                    onClick={() => selectedMenu && onSelectItem?.(item, selectedMenu)}
                                >
                                    {item.icon ? (
                                        <Image src={item.icon} style={{ width: 64, height: 64 }} mode="aspectFit" />
                                    ) : null}
                                </Grid.Item>
                            ))}
                        </Grid>
                    ) : null}
                </View>
            )}
        </Popup>
    );
}
