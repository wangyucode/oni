import { createContext, Dispatch, useReducer } from "react";
import { initialSelections, Selection } from "./data";

export const SelectionsContext = createContext<Array<Selection>>([]);
export const SelectionsDispatchContext = createContext<Dispatch<SelectionsAction>>(() => { });

type SelectionsAction = {
    type: 'add' | 'update' | 'remove';
    payload: Selection;
}

export function SelectionsProvider({ children }) {
    const [selections, dispatch] = useReducer(selectionsReducer, initialSelections);

    return (
        <SelectionsContext.Provider value={selections}>
            <SelectionsDispatchContext.Provider value={dispatch}>
                {children}
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
