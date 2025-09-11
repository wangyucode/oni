import { createContext, Dispatch, useContext, useEffect, useReducer, useRef } from "react";
import Taro from "@tarojs/taro";
import { debounce } from "@tarojs/runtime";

import { Item, Selection } from "./data";
import { DataContext } from "./DataContext";

export const SelectionsContext = createContext<Array<Selection>>([]);
export const SelectionsDispatchContext = createContext<Dispatch<SelectionsAction>>(() => { });

type SelectionsAction = {
    type: 'update' | 'remove' | 'replace';
    payload: Selection;
}

// 移除Item对象中的parent字段以避免循环引用
function removeParentFields(item: Item): Item {
    const { parent, ...itemWithoutParent } = item;
    if (itemWithoutParent.items) {
        itemWithoutParent.items = itemWithoutParent.items.map(removeParentFields);
    }
    return itemWithoutParent;
}

// 将Map转换为可序列化的对象数组，并移除循环引用
function convertMapsToSerializable(selections: Array<Selection>): Array<any> {
    return selections.map(selection => ({
        ...selection,
        item: removeParentFields(selection.item),
        modes: selection.modes.map(map => Array.from(map.entries()))
    }));
}

// 将序列化的对象数组转换回Map
function convertSerializableToMaps(serializedSelections: Array<any>): Array<Selection> {
    return serializedSelections.map(serialized => ({
        ...serialized,
        modes: serialized.modes.map((entries: Array<[string, number]>) => new Map(entries))
    }));
}

export function SelectionsProvider({ children }) {
    const { items } = useContext(DataContext);
    const [selections, dispatch] = useReducer(selectionsReducer, []);
    const debouncedSaveRef = useRef(debounce((selections: Array<Selection>) => {
        const serializableSelections = convertMapsToSerializable(selections);
        Taro.setStorage({
            key: 'selections',
            data: serializableSelections,
        });
    }, 5000));

    useEffect(() => {
        if (items.length) {
            const savedSelections = Taro.getStorageSync('selections');
            if (savedSelections && savedSelections.length) {
                const selectionsWithMaps = convertSerializableToMaps(savedSelections);
                dispatch({
                    type: 'replace',
                    payload: selectionsWithMaps as any,
                });
            } else {
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
        }
    }, [items]);

    useEffect(() => {
        if (selections.length) debouncedSaveRef.current(selections);
    }, [selections]);

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
        case 'replace': {
            return action.payload as unknown as Array<Selection>;
        }
        default: {
            return state;
        }
    }
}
