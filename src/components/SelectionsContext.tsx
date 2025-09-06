import { createContext, Dispatch, useContext, useEffect, useReducer } from "react";
import { Item, Selection } from "./data";
import { DataContext } from "./DataContext";

export const SelectionsContext = createContext<Array<Selection>>([]);
export const SelectionsDispatchContext = createContext<Dispatch<SelectionsAction>>(() => { });

type SelectionsAction = {
    type: 'update' | 'remove';
    payload: Selection;
}

export function SelectionsProvider({ children }) {
    const { items } = useContext(DataContext);
    const [selections, dispatch] = useReducer(selectionsReducer, []);

    useEffect(() => {
        if (items.length) {
            const dupe = items[0].items![0] as Item;
            const category = items[0]!.name;
            const modes = dupe.detail!.modes.map((mode) => {
                return new Map<string, number>(
                    mode.options.map((option, index) => [option.name, index ? 0 : 100])
                );
            });
            dispatch({
                type: 'update',
                payload: {
                    item: dupe,
                    count: 3,
                    category,
                    modes,
                },
            });
        }
    }, [items]);

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
        case 'update': {
            let hasUpdated = false;
            const newState = state.map(selection => {
                if (selection.item.name === action.payload.item.name) {
                    hasUpdated = true;
                    return action.payload;
                }
                return selection;
            });
            if (!hasUpdated) newState.push(action.payload);
            return newState;
        }
        case 'remove': {
            return state.filter(selection => selection.item.name !== action.payload.item.name);
        }
    }
}
