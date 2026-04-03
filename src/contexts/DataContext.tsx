import { createContext, ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Taro from "@tarojs/taro";
import { API_BASE, Images, Menu, ORIGIN_BASE, PhaseSets } from "@/types/data";

export interface DataContextType {
    data: Menu | null;
    iconMap: Map<string, IconData>;
    phaseSets: PhaseSets;
    loading: boolean;
    error: Error | null;
    refresh: () => void;
}

export interface IconData {
    icon: string;
    iconFilter?: string;
}

const EMPTY_PHASE_SETS: PhaseSets = {
    solid: new Set(),
    liquid: new Set(),
    gas: new Set(),
};

function buildPhaseSets(menu: Menu | null): PhaseSets {
    const solid = new Set<string>();
    const liquid = new Set<string>();
    const gas = new Set<string>();
    if (!menu) return { solid, liquid, gas };

    const visited = new WeakSet<Menu>();
    const findPhaseMenu = (current: Menu): Menu | null => {
        if (!current || visited.has(current)) return null;
        visited.add(current);
        if (current.title === "元素相变") return current;
        const items = Array.isArray(current.items) ? current.items : [];
        for (const item of items) {
            if (item?.menu) {
                const found = findPhaseMenu(item.menu);
                if (found) return found;
            }
        }
        return null;
    };

    const phaseMenu = findPhaseMenu(menu);
    if (!phaseMenu) return { solid, liquid, gas };

    phaseMenu.items.forEach((item) => {
        const childMenu = item?.menu;
        const title = childMenu?.title || item?.name || "";
        if (!childMenu) return;
        if (title === "固体") {
            childMenu.items?.forEach((child) => child?.name && solid.add(child.name));
        } else if (title === "液体") {
            childMenu.items?.forEach((child) => child?.name && liquid.add(child.name));
        } else if (title === "气体") {
            childMenu.items?.forEach((child) => child?.name && gas.add(child.name));
        }
    });

    return { solid, liquid, gas };
}

export const DataContext = createContext<DataContextType>({
    data: null,
    iconMap: new Map(),
    phaseSets: EMPTY_PHASE_SETS,
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
            
            const resData = res.data as any;
            if (!resData?.success) {
                throw new Error(resData?.message || "Request failed");
            }
            return resData.payload as T;
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

    const phaseSets = useMemo(() => buildPhaseSets(data), [data]);

    return (
        <DataContext.Provider value={{ data, iconMap, phaseSets, loading, error, refresh: fetchData }}>
            {children}
        </DataContext.Provider>
    )
}
