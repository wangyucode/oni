import { createContext, ReactNode } from "react";
import { FoodCalories, Item, Menu } from "./data";

export const DataContext = createContext<DataProviderValue>({ items: [], plantNames: [], foodCalories: {}, images: {}, menus: [] });

interface DataProviderValue {
    items: Array<Item>;
    plantNames: Array<string>;
    foodCalories: FoodCalories;
    images: Record<string, string>;
    menus: Array<Menu>;
}

export function DataProvider({ children, items, plantNames, foodCalories, images, menus }: DataProviderValue & { children: ReactNode }) {

    return (
        <DataContext.Provider value={{ items, plantNames, foodCalories, images, menus }}>
            {children}
        </DataContext.Provider>
    )
}
