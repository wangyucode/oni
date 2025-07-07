import { createContext, Dispatch, SetStateAction, useReducer, useState } from "react";
import { initialSelections, Selection } from "./data";

export const SelectionsContext = createContext<Array<Selection>>([]);
export const SelectionsDispatchContext = createContext<Dispatch<SelectionsAction>>(() => { });
export const CategoryStateContext = createContext<[string, Dispatch<SetStateAction<string>>]>(['', () => { }]);

type SelectionsAction = {
    type: 'add' | 'update' | 'remove';
    payload: Selection;
}

export function SelectionsProvider({ children }) {
    const [selections, dispatch] = useReducer(selectionsReducer, initialSelections);
    const categoryState = useState<string>('');

    return (
        <SelectionsContext.Provider value={selections}>
            <SelectionsDispatchContext.Provider value={dispatch}>
                <CategoryStateContext.Provider value={categoryState}>
                    {children}
                </CategoryStateContext.Provider>
            </SelectionsDispatchContext.Provider>
        </SelectionsContext.Provider>
    )
}

function selectionsReducer(state: Array<Selection>, action: SelectionsAction): Array<Selection> {
    switch (action.type) {
        case 'add': {
            return [...state, action.payload];
        }
        case 'update': {
            return state.map(selection => selection.item.name === action.payload.item.name ? action.payload : selection);
        }
        case 'remove': {
            return state.filter(selection => selection.item.name !== action.payload.item.name);
        }
    }
}
