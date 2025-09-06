import { createContext, ReactNode } from "react";
import { FoodCalories, Item } from "./data";

export const DataContext = createContext<DataProviderValue>({ items: [], plantNames: [], foodCalories: {} });

interface DataProviderValue {
    items: Array<Item>;
    plantNames: Array<string>;
    foodCalories: FoodCalories;
}

export function DataProvider({ children, items, plantNames, foodCalories }: DataProviderValue & { children: ReactNode }) {

    return (
        <DataContext.Provider value={{ items, plantNames, foodCalories }}>
            {children}
        </DataContext.Provider>
    )
}
