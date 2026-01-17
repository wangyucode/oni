import { createContext, ReactNode } from "react";

export interface DataContextValue {
    getModel<T = unknown>(file: string): Promise<T[]>;
}

export const DataContext = createContext<DataContextValue>({
    getModel: async <T = unknown,>(_file: string) => [] as T[]
});

export function DataProvider({ children, value }: { children: ReactNode; value: DataContextValue }) {
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}
