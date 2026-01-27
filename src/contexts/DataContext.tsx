import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Taro from "@tarojs/taro";
import { API_BASE, Images, Menu, ORIGIN_BASE } from "@/types/data";

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
    const [images, setImages] = useState<Images | null>(null);
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
            const [menu, imageMap] = await Promise.all([
                requestJson<Menu>(`${API_BASE}/api/v1/yml/calculator/index.yml`),
                requestJson<Images>(`${API_BASE}/api/v1/yml/calculator/images.yml`),
            ]);
            setData(menu);
            setImages(imageMap);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e : new Error(String(e)));
        } finally {
            setLoading(false);
        }
    }, [requestJson]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const iconMap = useMemo(() => {
        const map = new Map<string, IconData>();
        if (!images) return map;

        const resolveUrl = (file: string): string => {
            const f = String(file || "");
            if (/^https?:\/\//.test(f)) return f;
            if (f.startsWith("/")) return `${ORIGIN_BASE}${f}`;
            return `${ORIGIN_BASE}/upload/oni/v3/images/${f}`;
        };

        Object.entries(images).forEach(([key, val]) => {
            if (!key) return;
            if (!val?.file) return;
            map.set(key, { icon: resolveUrl(val.file), iconFilter: val.filter });
        });
        return map;
    }, [images]);

    return (
        <DataContext.Provider value={{ data, iconMap, loading, error, refresh: fetchData }}>
            {children}
        </DataContext.Provider>
    )
}
