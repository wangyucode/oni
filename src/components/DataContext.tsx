import { createContext, ReactNode } from "react";

export interface DataContextValue {
    getModel: (file: string) => Promise<unknown>;
    items: unknown[];
    plantNames: string[];
    images: Record<string, string>;
}

export const DataContext = createContext<DataContextValue>({
    getModel: async () => ({ items: [] }),
    items: [],
    plantNames: [],
    images: {},
});

export function DataProvider({ children, value }: { children: ReactNode; value: DataContextValue }) {
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}
