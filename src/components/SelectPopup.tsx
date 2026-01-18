import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Button, Popup } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";

import './SelectPopup.scss';
import { DataContext } from "./DataContext";
import MenuGrid from "./MenuGrid";
import { Detail, Link, Menu } from "./data";

interface SelectPopupProps {
    visible: boolean;
    onClose: () => void;
    onSelectDetail?: (detail: Detail) => void;
}

export default function SelectPopup({ visible, onClose, onSelectDetail }: SelectPopupProps) {
    const menu = useContext(DataContext);
    const [rootMenu, setRootMenu] = useState<Menu | null>(menu);
    const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
    const [backStack, setBackStack] = useState<Menu[]>([]);

    const title = useMemo(() => {
        return currentMenu?.title || "类别";
    }, [currentMenu?.title]);

    useEffect(() => {
        if (!visible) return;
        if (rootMenu) {
            setCurrentMenu(rootMenu);
            setBackStack([rootMenu]);
            return;
        }
        if (menu) {
            setRootMenu(menu);
            setCurrentMenu(menu);
            setBackStack([menu]);
        }
    }, [visible, rootMenu, menu]);

    function handleClose() {
        setCurrentMenu(rootMenu);
        setBackStack(rootMenu ? [rootMenu] : []);
        onClose();
    }

    function handleGoBack() {
        if (backStack.length <= 1) return;
        const nextStack = backStack.slice(0, -1);
        setBackStack(nextStack);
        setCurrentMenu(nextStack[nextStack.length - 1] || null);
    }

    function handleSelectLink(link: Link) {
        if (link.menu) {
            setBackStack([...backStack, link.menu]);
            setCurrentMenu(link.menu);
            return;
        }
        if (link.detail) {
            onSelectDetail?.(link.detail);
            handleClose();
        }
    }

    function renderMenu(menu: Menu | null): JSX.Element | null {
        if (!menu) return null;
        if (!menu.items?.length) return null;
        return <MenuGrid<Link> columns={3} items={menu.items} onItemClick={handleSelectLink} />;
    }

    const content = renderMenu(currentMenu);

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
