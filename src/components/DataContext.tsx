import { createContext, ReactNode } from "react";

export interface DataContextValue {
    getModel: (file: string) => Promise<unknown>;
}

export const DataContext = createContext<DataContextValue>({
    getModel: async () => ({ items: [] })
});

export function DataProvider({ children, value }: { children: ReactNode; value: DataContextValue }) {
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}
