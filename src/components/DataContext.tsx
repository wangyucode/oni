import { createContext, ReactNode } from "react";
import { Menu } from "./data";

export const DataContext = createContext<Menu| null>(null);


export function DataProvider({ children, value }: { children: ReactNode; value: Menu | null }) {
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}
