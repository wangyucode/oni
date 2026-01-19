import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Button, Popup } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";

import './SelectPopup.scss';
import { DataContext } from "./DataContext";
import MenuGrid from "./MenuGrid";
import { Detail, DupeDetail, Link, Menu } from "./data";
import DupeDetailView from "./DupeDetailView";
import { calculateGridColumns } from "./utils";

interface SelectPopupProps {
    visible: boolean;
    onClose: () => void;
}

export default function SelectPopup({ visible, onClose }: SelectPopupProps) {
    const menu = useContext(DataContext);
    const [rootMenu, setRootMenu] = useState<Menu | null>(menu);
    const [currentMenu, setCurrentMenu] = useState<Menu | null>(null);
    const [backStack, setBackStack] = useState<Menu[]>([]);
    const [selectedDetail, setSelectedDetail] = useState<Detail | null>(null);

    const title = useMemo(() => {
        return selectedDetail?.name || currentMenu?.title || "类别";
    }, [currentMenu?.title, selectedDetail?.name]);

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

    function isDupeDetail(detail: Detail["detail"]): detail is DupeDetail {
        return (
            typeof detail === "object" &&
            detail !== null &&
            "resources" in detail &&
            "modes" in detail &&
            !("heat" in detail) &&
            !("life" in detail)
        );
    }

    function handleClose() {
        setCurrentMenu(rootMenu);
        setBackStack(rootMenu ? [rootMenu] : []);
        setSelectedDetail(null);
        onClose();
    }

    function handleGoBack() {
        if (selectedDetail) {
            setSelectedDetail(null);
            return;
        }
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
            if (isDupeDetail(link.detail.detail)) {
                setSelectedDetail(link.detail);
            }
        }
    }

    function renderMenu(menu: Menu | null): JSX.Element | null {
        if (!menu) return null;
        if (!menu.items?.length) return null;
        return <MenuGrid<Link> columns={calculateGridColumns(menu.items.length)} items={menu.items} onItemClick={handleSelectLink} />;
    }

    const content = selectedDetail && isDupeDetail(selectedDetail.detail)
        ? <DupeDetailView detail={selectedDetail} />
        : renderMenu(currentMenu);

    return (
        <Popup
            className="select-popup"
            visible={visible}
            position="bottom"
            title={title}
            left={selectedDetail || backStack.length > 1 ? <Button className="back" onClick={handleGoBack}><ArrowLeft size={16} />返回</Button> : null}
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
