import { createContext, ReactNode } from "react";
import { FoodCalories, Item } from "./data";

export const DataContext = createContext<DataProviderValue>({ items: [], plantNames: [], foodCalories: {}, images: {} });

interface DataProviderValue {
    items: Array<Item>;
    plantNames: Array<string>;
    foodCalories: FoodCalories;
    images: Record<string, string>;
}

export function DataProvider({ children, items, plantNames, foodCalories, images }: DataProviderValue & { children: ReactNode }) {

    return (
        <DataContext.Provider value={{ items, plantNames, foodCalories, images }}>
            {children}
        </DataContext.Provider>
    )
}
