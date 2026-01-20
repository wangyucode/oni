import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Taro from "@tarojs/taro";
import { API_BASE, Menu } from "./data";

export interface DataContextType {
    data: Menu | null;
    iconMap: Map<string, IconData>;
    loading: boolean;
    error: Error | null;
    refresh: () => void;
}

export interface IconData {
    icon: string;
    iconFilter?: string;
}

export const DataContext = createContext<DataContextType>({
    data: null,
    iconMap: new Map(),
    loading: true,
    error: null,
    refresh: () => { },
});

export function DataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<Menu | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const requestJson = useCallback(async <T,>(url: string): Promise<T> => {
        try {
            const res = await Taro.request({
                url,
                header: {
                    Accept: "application/json",
                },
                method: "GET",
            });
            
            const data = res.data as any;
            if (!data?.success) {
                throw new Error(data?.message || "Request failed");
            }
            return data.payload as T;
        } catch (err: any) {
            throw new Error(err?.errMsg || err?.message || "Request failed");
        }
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = await requestJson<Menu>(`${API_BASE}/api/v1/yml/calculator/index.yml`);
            setData(payload);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e : new Error(String(e)));
        } finally {
            setLoading(false);
        }
    }, [requestJson]);

    useEffect(() => {
        const appVersion = Taro.getStorageSync('appVersion');
        if (appVersion !== process.env.TARO_APP_VERSION) {
            Taro.clearStorageSync();
            Taro.setStorageSync('appVersion', process.env.TARO_APP_VERSION);
        }
        fetchData();
    }, [fetchData]);

    const iconMap = useMemo(() => {
        const map = new Map<string, IconData>();
        if (!data) return map;

        const traverse = (m: Menu) => {
            m.items.forEach(item => {
                if (item.name && item.icon) {
                    map.set(item.name, {
                        icon: item.icon,
                        iconFilter: item.iconFilter
                    });
                }
                if (item.menu) {
                    traverse(item.menu);
                }
            });
        };
        traverse(data);
        return map;
    }, [data]);

    return (
        <DataContext.Provider value={{ data, iconMap, loading, error, refresh: fetchData }}>
            {children}
        </DataContext.Provider>
    )
}
