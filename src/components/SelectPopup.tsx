import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Button, Popup } from "@nutui/nutui-react-taro";
import { ArrowLeft } from "@nutui/icons-react-taro";

import './SelectPopup.scss';
import { DataContext } from "./DataContext";
import MenuGrid from "./MenuGrid";
import { Menu } from "./data";

type viewType = "menu" | string;

type MenuModelItem = {
    name: string;
    icon?: string;
};

type MenuModel = {
    columns?: number;
    items: MenuModelItem[];
};

interface SelectPopupProps {
    visible: boolean;
    onClose: () => void;
    onSelectItem?: (item: MenuModelItem, menu: Menu) => void;
}


function isMenuArray(value: unknown): value is Menu[] {
    if (!Array.isArray(value)) return false;
    return value.every((m) => !!m && typeof m === "object" && typeof (m as any).name === "string" && typeof (m as any).icon === "string" && typeof (m as any).file === "string");
}

function isMenuModel(value: unknown): value is MenuModel {
    if (!value || typeof value !== "object") return false;
    return Array.isArray((value as any).items);
}

export default function SelectPopup({ visible, onClose, onSelectItem }: SelectPopupProps) {
    const { getModel } = useContext(DataContext);
    const [view, setView] = useState<viewType>("menu");
    const [menus, setMenus] = useState<Menu[] | null>(null);
    const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
    const [model, setModel] = useState<MenuModel | null>(null);

    const title = useMemo(() => {
        if (view === "menu") return "类别";
        return selectedMenu?.name || "";
    }, [selectedMenu?.name, view]);

    useEffect(() => {
        if (!visible) {
            setView("menu");
            setSelectedMenu(null);
            setModel(null);
            return;
        }
        let cancelled = false;
        setMenus(null);
        void getModel("menu.yml")
            .then((data) => {
                if (cancelled) return;
                setMenus(isMenuArray(data) ? data : []);
            })
            .catch(() => {
                if (cancelled) return;
                setMenus([]);
            });

        return () => {
            cancelled = true;
        };
    }, [getModel, visible]);

    function handleClose() {
        setView("menu");
        setSelectedMenu(null);
        setModel(null);
        onClose();
    }

    function handleGoBack() {
        setView("menu");
        setSelectedMenu(null);
        setModel(null);
    }

    function handleSelectMenu(menu: Menu) {
        setSelectedMenu(menu);
        setView(menu.file);
    }

    useEffect(() => {
        if (!visible) return;
        if (view === "menu") return;
        let cancelled = false;
        setModel(null);
        void getModel(view)
            .then((data) => {
                if (cancelled) return;
                setModel(isMenuModel(data) ? data : null);
            })
            .catch(() => {
                if (cancelled) return;
                setModel(null);
            });

        return () => {
            cancelled = true;
        };
    }, [getModel, visible, view]);

    function renderByView(nextView: viewType): JSX.Element | null {
        if (nextView === "menu") {
            if (!menus) return null;
            return <MenuGrid<Menu> columns={3} items={menus} onItemClick={handleSelectMenu} />;
        }

        if (!model) return null;
        return (
            <MenuGrid<MenuModelItem>
                columns={model.columns || 3}
                items={model.items}
                onItemClick={(item) => selectedMenu && onSelectItem?.(item, selectedMenu)}
            />
        );
    }

    const content = renderByView(view);

    return (
        <Popup
            className="select-popup"
            visible={visible}
            position="bottom"
            title={title}
            left={view !== "menu" ? <Button className="back" onClick={handleGoBack}><ArrowLeft size={16} />返回</Button> : null}
            onClose={handleClose}
            closeable
            style={{ height: '50%', paddingBottom: process.env.TARO_ENV === 'h5' ? 50 : 0 }}
        >
            <View style={{ flex: 1 }}>
                {content ?? (
                    <View style={{ padding: 16 }}>
                        <Text>加载中...</Text>
                    </View>
                )}
            </View>
        </Popup>
    );
}
