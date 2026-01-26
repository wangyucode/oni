import { createContext, ReactNode, useCallback, useRef } from "react";
import Taro from "@tarojs/taro";
import { API_BASE, Page } from "@/types/data";

export interface WikiContextType {
    getPage: (link: string) => Promise<Page>;
}

export const WikiContext = createContext<WikiContextType>({
    getPage: async () => { throw new Error("WikiContext not initialized"); },
});

export function WikiProvider({ children }: { children: ReactNode }) {
    const cache = useRef<Map<string, Page>>(new Map());

    const getPage = useCallback(async (link: string): Promise<Page> => {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        // 内部用link缓存
        if (cache.current.has(link)) {
            return cache.current.get(link)!;
        }

        try {
            // 缓存未命中时，会请求接口拿数据
            // 例如：link为/entry/home时请求/api/v1/yml/entry/home.yml
            const res = await Taro.request({
                url: `${API_BASE}/api/v1/yml${link}.yml`,
                header: {
                    Accept: "application/json",
                },
                method: "GET",
            });

            const data = res.data as any;
            if (!data?.success) {
                return await getPage("/entry/pagenotfound");
            }
            
            const page = data.payload as Page;
            cache.current.set(link, page);
            return page;
        } catch (err: any) {
            return await getPage("/entry/pagenotfound");
        }
    }, []);

    return (
        <WikiContext.Provider value={{ getPage }}>
            {children}
        </WikiContext.Provider>
    );
}
