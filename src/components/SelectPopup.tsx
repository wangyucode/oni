import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Button, Popup } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";

import './SelectPopup.scss';
import { DataContext } from "./DataContext";
import MenuGrid from "./MenuGrid";
import { Menu } from "./data";

type viewType = "menu.yml" | string;

interface SelectPopupProps {
    visible: boolean;
    onClose: () => void;
}

export default function SelectPopup({ visible, onClose }: SelectPopupProps) {
    const { getModel } = useContext(DataContext);
    const [view, setView] = useState<viewType>("menu.yml");
    const [backStack, setBackStack] = useState<viewType[]>(["menu.yml"]);
    const [items, setItems] = useState<Menu[]>([]);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

    const title = useMemo(() => {
        if (view === "menu.yml") return "类别";
        return selectedMenu?.name || "";
    }, [selectedMenu?.name, view]);


    useEffect(() => {
        if (!visible) return;
        getModel<Menu>(view).then((model) => {
            console.log(model);
            if(visible) setItems(model);
        });
    }, [view, visible]);

    function handleClose() {
        setView("menu.yml");
        setSelectedMenu(null);
        onClose();
    }

    function handleGoBack() {
        if (backStack.length <= 1) return;
        setBackStack(backStack.slice(0, -1));
        setView(backStack[backStack.length - 2]);
        setSelectedMenu(null);
    }

    function handleSelectMenu(menu: Menu) {
        setSelectedMenu(menu);
        setBackStack([...backStack, menu.file || "menu.yml"]);
        setView(menu.file || "menu.yml");
    }

    function renderByView(nextView: viewType): JSX.Element | null {
        if (nextView === "menu.yml") {
            if (!items.length) return null;
            return <MenuGrid<Menu> columns={3} items={items} onItemClick={handleSelectMenu} />;
        } else {
            return null;
        }
    }

    const content = renderByView(view);

    return (
        <Popup
            className="select-popup"
            visible={visible}
            position="bottom"
            title={title}
            left={backStack.length > 1 ? <Button className="back" onClick={handleGoBack}><ArrowLeft size={16} />返回</Button> : null}
            onClose={handleClose}
            closeable
            style={{ height: '50%', paddingBottom: process.env.TARO_ENV === 'h5' ? 50 : 0 }}
        >
            <View className="content">
                {content ?? (
                    <View style={{ padding: 16 }}>
                        <Text>加载中...</Text>
                    </View>
                )}
            </View>
        </Popup>
    );
}
