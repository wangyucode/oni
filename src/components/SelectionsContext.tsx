import { createContext, Dispatch, useContext, useEffect, useReducer, useRef } from "react";
import Taro from "@tarojs/taro";
import { debounce } from "@tarojs/runtime";

import { Item, Selection, SavedSelection } from "./data";
import { DataContext } from "./DataContext";

export const SelectionsContext = createContext<Array<Selection>>([]);
export const SelectionsDispatchContext = createContext<Dispatch<SelectionsAction>>(() => { });

type SelectionsAction = {
    type: 'update' | 'remove' | 'replace';
    payload: any;
}

// 在指定category下查找指定名称的Item
function findItemByCategoryAndName(items: Array<Item>, category: string, name: string): Item | null {
    // 先找到对应的category
    const categoryItem = items.find(item => item.name === category);
    if (!categoryItem || !categoryItem.items) {
        return null;
    }

    // 在category的items中查找指定名称的item
    return findItemInCategory(categoryItem.items, name);
}

// 在category的items中递归查找item
function findItemInCategory(items: Array<Item>, name: string): Item | null {
    for (const item of items) {
        if (item.items) {
            const found = findItemInCategory(item.items, name);
            if (found) {
                return found;
            }
        }

        if (item.name === name) {
            return item;
        }
    }
    return null;
}

// 将Selection转换为SavedSelection用于保存
function convertToSavedSelection(selections: Array<Selection>): Array<SavedSelection> {
    return selections.map(selection => {
        // 将Map数组转换为Record<string, number>数组
        const modesArray = selection.modes.map(map => {
            const record: Record<string, number> = {};
            map.forEach((value, key) => {
                record[key] = value;
            });
            return record;
        });

        return {
            category: selection.category,
            item: selection.item.name,
            count: selection.count,
            modes: modesArray
        };
    });
}

// 将SavedSelection还原为Selection
function convertFromSavedSelection(savedSelections: Array<SavedSelection>, items: Array<Item>): Array<Selection> {
    return savedSelections.map(saved => {
        // 使用category优化查找效率
        const item = findItemByCategoryAndName(items, saved.category, saved.item);
        if (!item || !item.detail) {
            throw new Error(`Item not found or without detail: ${saved.item} in category ${saved.category}`);
        }

        // 将Record<string, number>数组还原为Map数组
        const modes: Array<Map<string, number>> = saved.modes.map(record => {
            const map = new Map<string, number>();
            Object.entries(record).forEach(([key, value]) => {
                map.set(key, value);
            });
            return map;
        });

        return {
            category: saved.category,
            item: item,
            count: saved.count,
            modes: modes
        };
    });
}

export function SelectionsProvider({ children }) {
    const { items } = useContext(DataContext);
    const [selections, dispatch] = useReducer(selectionsReducer, []);
    const debouncedSaveRef = useRef(debounce((selections: Array<Selection>) => {
        const savedSelections = convertToSavedSelection(selections);
        Taro.setStorage({
            key: 'selections',
            data: savedSelections,
        });
    }, 1000));

    // 插入初始选择的函数
    function insertInitSelections() {
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

    useEffect(() => {
        if (items.length) {
            const savedSelections = Taro.getStorageSync('selections') as Array<SavedSelection>;
            if (savedSelections && savedSelections.length) {
                try {
                    const restoredSelections = convertFromSavedSelection(savedSelections, items);
                    dispatch({
                        type: 'replace',
                        payload: restoredSelections as any,
                    });
                } catch (error) {
                    console.error('Failed to restore selections:', error);
                    // 如果恢复失败，使用默认选择
                    insertInitSelections();
                }
            } else {
                // 如果没有保存的选择，插入初始选择
                insertInitSelections();
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
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
