import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import Taro from "@tarojs/taro";
import { debounce } from "@tarojs/runtime";

import { Detail } from "./data";
import { ResourceItem } from "./ResourceGrid";
import { calculateSelectionTotals } from "./selection/calc";

export type SelectionEntry = {
  key: string;
  categoryPath: string[];
  detail: Detail;
  count: number;
  modeSelections: Array<Map<string, number>>;
};

type SavedSelectionEntry = Omit<SelectionEntry, "modeSelections"> & {
  modeSelections: Array<Record<string, number>>;
};

export type SelectionsSummary = {
  resources: Record<string, number>;
  resourceItems: ResourceItem[];
  totalPower: number;
  totalHeat: number;
  totalCalories: number;
};

export type SelectionsContextValue = {
  selections: SelectionEntry[];
  summary: SelectionsSummary;
};

type UpsertPayload = {
  detail: Detail;
  count: number;
  modeSelections: Array<Map<string, number>>;
  categoryPath: string[];
};

export type SelectionsActions = {
  upsert: (payload: UpsertPayload) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export const SelectionsContext = createContext<SelectionsContextValue>({
  selections: [],
  summary: {
    resources: {},
    resourceItems: [],
    totalPower: 0,
    totalHeat: 0,
    totalCalories: 0,
  },
});

export const SelectionsActionsContext = createContext<SelectionsActions>({
  upsert: () => {},
  remove: () => {},
  clear: () => {},
});

function createSelectionKey(categoryPath: string[], detailName: string): string {
  const prefix = categoryPath.filter(Boolean).join("/");
  return `${prefix}::${detailName}`;
}

function serializeModeSelections(modeSelections: Array<Map<string, number>>): Array<Record<string, number>> {
  return modeSelections.map((map) => {
    const record: Record<string, number> = {};
    map.forEach((value, key) => {
      record[key] = value;
    });
    return record;
  });
}

function deserializeModeSelections(modeSelections: Array<Record<string, number>>): Array<Map<string, number>> {
  return modeSelections.map((record) => {
    const map = new Map<string, number>();
    Object.entries(record || {}).forEach(([key, value]) => {
      map.set(key, Number(value) || 0);
    });
    return map;
  });
}

function sortSelections(selections: SelectionEntry[]): SelectionEntry[] {
  return selections
    .slice()
    .sort((a, b) => {
      const aPath = a.categoryPath.join("/");
      const bPath = b.categoryPath.join("/");
      const byPath = aPath.localeCompare(bPath, "zh-CN");
      if (byPath) return byPath;
      return a.detail.name.localeCompare(b.detail.name, "zh-CN");
    });
}

type SelectionsState = {
  selections: SelectionEntry[];
};

type SelectionsAction =
  | { type: "upsert"; payload: UpsertPayload }
  | { type: "remove"; payload: { key: string } }
  | { type: "replace"; payload: { selections: SelectionEntry[] } }
  | { type: "clear" };

function selectionsReducer(state: SelectionsState, action: SelectionsAction): SelectionsState {
  switch (action.type) {
    case "upsert": {
      const key = createSelectionKey(action.payload.categoryPath, action.payload.detail.name);
      if (action.payload.count <= 0) {
        return {
          selections: state.selections.filter((s) => s.key !== key),
        };
      }
      const nextEntry: SelectionEntry = {
        key,
        categoryPath: action.payload.categoryPath,
        detail: action.payload.detail,
        count: action.payload.count,
        modeSelections: action.payload.modeSelections,
      };

      const existingIndex = state.selections.findIndex((s) => s.key === key);
      const nextSelections = state.selections.slice();
      if (existingIndex >= 0) {
        nextSelections[existingIndex] = nextEntry;
      } else {
        nextSelections.push(nextEntry);
      }
      return { selections: sortSelections(nextSelections) };
    }
    case "remove": {
      return {
        selections: state.selections.filter((s) => s.key !== action.payload.key),
      };
    }
    case "replace": {
      return {
        selections: sortSelections(action.payload.selections),
      };
    }
    case "clear": {
      return { selections: [] };
    }
    default: {
      return state;
    }
  }
}

function buildSummary(selections: SelectionEntry[]): SelectionsSummary {
  const resources: Record<string, number> = {};
  let totalPower = 0;
  let totalHeat = 0;
  let totalCalories = 0;

  selections.forEach((selection) => {
    const totals = calculateSelectionTotals(selection.detail, selection.count, selection.modeSelections);
    totalPower += totals.totalPower;
    totalHeat += totals.totalHeat;
    totalCalories += totals.totalCalories;

    Object.entries(totals.resources).forEach(([name, value]) => {
      resources[name] = (resources[name] || 0) + value;
    });
  });

  const resourceItems: ResourceItem[] = Object.entries(resources).map(([name, value]) => ({
    name,
    value,
    count: 1,
  }));

  return {
    resources,
    resourceItems,
    totalPower,
    totalHeat,
    totalCalories,
  };
}

export function SelectionsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(selectionsReducer, { selections: [] });
  const hydratedRef = useRef(false);

  const debouncedSaveRef = useRef(
    debounce((selections: SelectionEntry[]) => {
      const saved: SavedSelectionEntry[] = selections.map((s) => ({
        key: s.key,
        categoryPath: s.categoryPath,
        detail: s.detail,
        count: s.count,
        modeSelections: serializeModeSelections(s.modeSelections),
      }));
      Taro.setStorage({
        key: "selections",
        data: saved,
      });
    }, 800)
  );

  useEffect(() => {
    const saved = Taro.getStorageSync("selections") as SavedSelectionEntry[] | undefined;
    if (Array.isArray(saved) && saved.length) {
      const restored: SelectionEntry[] = saved
        .filter((s) => s && typeof s === "object")
        .map((s) => ({
          key: String((s as any).key || createSelectionKey((s as any).categoryPath || [], (s as any).detail?.name || "")),
          categoryPath: Array.isArray((s as any).categoryPath) ? (s as any).categoryPath.map(String) : [],
          detail: (s as any).detail as Detail,
          count: Number((s as any).count) || 0,
          modeSelections: deserializeModeSelections((s as any).modeSelections || []),
        }))
        .filter((s) => s.detail && s.detail.name && s.count > 0);

      dispatch({ type: "replace", payload: { selections: restored } });
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (!state.selections.length) {
      Taro.removeStorage({ key: "selections" });
      return;
    }
    debouncedSaveRef.current(state.selections);
  }, [state.selections]);

  const summary = useMemo(() => buildSummary(state.selections), [state.selections]);

  const actions = useMemo<SelectionsActions>(
    () => ({
      upsert: (payload) => dispatch({ type: "upsert", payload }),
      remove: (key) => dispatch({ type: "remove", payload: { key } }),
      clear: () => {
        dispatch({ type: "clear" });
        Taro.removeStorage({ key: "selections" });
      },
    }),
    []
  );

  const value = useMemo<SelectionsContextValue>(
    () => ({
      selections: state.selections,
      summary,
    }),
    [state.selections, summary]
  );

  return (
    <SelectionsContext.Provider value={value}>
      <SelectionsActionsContext.Provider value={actions}>{children}</SelectionsActionsContext.Provider>
    </SelectionsContext.Provider>
  );
}

export function useSelections() {
  return useContext(SelectionsContext);
}

export function useSelectionsActions() {
  return useContext(SelectionsActionsContext);
}
