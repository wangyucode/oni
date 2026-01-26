import { useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "@tarojs/components";
import { Button, Popup } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";

import { DataContext } from "../../contexts/DataContext";
import MenuGrid from "./MenuGrid";
import { DetailLink, Link, Menu, MenuLink } from "../../types/data";
import LinkDetailView from "../detail/views/LinkDetailView";
import { calculateGridColumns } from "../../utils/utils";

interface SelectPopupProps {
    visible: boolean;
    onClose: () => void;
}

export default function SelectPopup({ visible, onClose }: SelectPopupProps) {
    const { data: menu } = useContext(DataContext);
    const [rootMenu, setRootMenu] = useState<Menu | null>(menu);
    const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
    const [backStack, setBackStack] = useState<Menu[]>([]);
    const [selectedLink, setSelectedLink] = useState<Link | null>(null);

    const title = useMemo(() => {
        return selectedLink?.name || currentMenu?.title || "类别";
    }, [currentMenu?.title, selectedLink?.name]);

    const category = useMemo(() => {
        const path = backStack.slice(1).map((m) => m.title).filter(Boolean);
        return path.length > 0 ? path[0] : "";
    }, [backStack]);

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
        setSelectedLink(null);
        onClose();
    }

    function handleGoBack() {
        if (selectedLink) {
            setSelectedLink(null);
            return;
        }
        if (backStack.length <= 1) return;
        const nextStack = backStack.slice(0, -1);
        setBackStack(nextStack);
        setCurrentMenu(nextStack[nextStack.length - 1] || null);
    }

    function handleSelectLink(link: MenuLink & DetailLink) {
        if (link.menu) {
            setBackStack([...backStack, link.menu]);
            setCurrentMenu(link.menu);
            return;
        }
        if (backStack.length > 1 && link.detail) {
            setSelectedLink(link);
        }
    }

    function renderMenu(menu: Menu | null): JSX.Element | null {
        if (!menu) return null;
        if (!menu.items?.length) return null;
        return <MenuGrid<Link> columns={calculateGridColumns(menu.items.length)} items={menu.items} onItemClick={handleSelectLink} />;
    }

    const content = selectedLink
        ? <LinkDetailView link={selectedLink} category={category} onConfirmed={handleClose} />
        : renderMenu(currentMenu);

    return (
        <Popup
            className="popup-root"
            visible={visible}
            position="bottom"
            title={title}
            left={selectedLink || backStack.length > 1 ? <ArrowLeft onClick={handleGoBack}/> : null}
            onClose={handleClose}
            closeable
            style={{ marginBottom: process.env.TARO_ENV === 'h5'  ? '50px' : '0',}}
        >
            <ScrollView style={{ height: 'calc(100% - 48px)',  }} scrollY={true}>
                <View className="p-8">
                    {content ?? (<Text>加载中...</Text>)}
                </View>
            </ScrollView>

        </Popup>
    );
}
