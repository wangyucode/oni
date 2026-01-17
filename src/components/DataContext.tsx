import { createContext, ReactNode } from "react";
import { FoodCalories, Item, Menu } from "./data";

export type CalculatorGridItem = {
    name: string;
    icon?: string;
};

export type CalculatorGridModel = {
    title?: string;
    columns?: number;
    items: Array<CalculatorGridItem>;
};

export interface DataContextValue {
    items: Array<Item>;
    plantNames: Array<string>;
    foodCalories: FoodCalories;
    images: Record<string, string>;
    menus: Array<Menu>;

    getMenuModel: (file: string) => Promise<CalculatorGridModel>;
}

export const DataContext = createContext<DataContextValue>({
    items: [],
    plantNames: [],
    foodCalories: {},
    images: {},
    menus: [],
    getMenuModel: async () => ({ items: [] }),
});

export function DataProvider({ children, value }: { children: ReactNode; value: DataContextValue }) {
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}
