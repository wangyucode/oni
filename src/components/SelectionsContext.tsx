import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { debounce } from "@tarojs/runtime";

import { Link, LinkDetail, Menu } from "./data";
import { ResourceItem } from "./ResourceGrid";
import { calculateSelectionTotals, ResourceUnitKind } from "./selection/calc";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "./selection/modeSelection";
import { DataContext } from "./DataContext";

export type SelectionEntry = {
  key: string;
  categoryPath: string[];
  name: string;
  detail: LinkDetail;
  count: number;
  modeSelections: ModeSelections;
  efficiency?: number;
};

type SavedSelectionEntry = SelectionEntry;

export type SelectionsSummary = {
  resources: Record<string, number>;
  resourceKinds: Record<string, ResourceUnitKind>;
  resourceItems: ResourceItem[];
  totalPower: number;
  totalHeat: number;
  totalCalories: number;
};

export type GroupedSelectionEntry = {
  key: string;
  categoryPath: string[];
  name: string;
  count: number;
};

export type SelectionsContextValue = {
  selections: SelectionEntry[];
  groupedSelections: GroupedSelectionEntry[];
  summary: SelectionsSummary;
};

type UpsertPayload = {
  name: string;
  detail: LinkDetail;
  count: number;
  modeSelections: ModeSelections;
  categoryPath: string[];
  efficiency?: number;
};

export type SelectionsActions = {
  upsert: (payload: UpsertPayload) => void;
  update: (fromKey: string, payload: UpsertPayload) => void;
  remove: (key: string) => void;
  clear: () => void;
};

export const SelectionsContext = createContext<SelectionsContextValue>({
  selections: [],
  groupedSelections: [],
  summary: {
    resources: {},
    resourceKinds: {},
    resourceItems: [],
    totalPower: 0,
    totalHeat: 0,
    totalCalories: 0,
  },
});

export const SelectionsActionsContext = createContext<SelectionsActions>({
  upsert: () => {},
  update: () => {},
  remove: () => {},
  clear: () => {},
});

function serializeModeSelections(detail: LinkDetail, raw: ModeSelections): string {
  const normalized = normalizeModeSelections(detail, raw);
  const modes = (detail as any).modes || [];
  return modes.map((m: any) => normalized[m.name] || "").join("|");
}

function createSelectionKey(itemName: string, detail: LinkDetail, modeSelections: ModeSelections): string {
  const modeKey = serializeModeSelections(detail, modeSelections);
  return `${itemName}::${modeKey}`;
}

function normalizeCountAndEfficiency(totalEffective: number): { count: number; efficiency: number } {
  if (totalEffective <= 0) return { count: 0, efficiency: 100 };
  const count = Math.ceil(totalEffective);
  const efficiency = Math.round((totalEffective / count) * 10000) / 100;
  return { count, efficiency };
}

function mergeSelectionsByKey(selections: SelectionEntry[]): SelectionEntry[] {
  const byKey = new Map<string, SelectionEntry>();
  selections.forEach((s) => {
    const existing = byKey.get(s.key);
    if (!existing) {
      byKey.set(s.key, s);
      return;
    }
    const existingEffective = (existing.count * (existing.efficiency ?? 100)) / 100;
    const incomingEffective = (s.count * (s.efficiency ?? 100)) / 100;
    const normalized = normalizeCountAndEfficiency(existingEffective + incomingEffective);
    byKey.set(s.key, { ...existing, count: normalized.count, efficiency: normalized.efficiency });
  });
  return Array.from(byKey.values()).filter((s) => s.count > 0);
}

function buildGroupedSelections(selections: SelectionEntry[]): GroupedSelectionEntry[] {
  const grouped = new Map<string, { entry: GroupedSelectionEntry; rawCount: number }>();
  selections.forEach((selection) => {
    const categoryKey = selection.categoryPath.join(">");
    const groupKey = `${categoryKey}::${selection.name}`;

    const contribution = (selection.count * (selection.efficiency ?? 100)) / 100;

    const existing = grouped.get(groupKey);
    if (existing) {
      existing.rawCount += contribution;
    } else {
      grouped.set(groupKey, {
        entry: {
          key: groupKey,
          categoryPath: selection.categoryPath,
          name: selection.name,
          count: 0,
        },
        rawCount: contribution,
      });
    }
  });

  return Array.from(grouped.values())
    .map(({ entry, rawCount }) => ({
      ...entry,
      count: Math.ceil(rawCount),
    }))
    .filter((s) => s.count > 0);
}

function normalizeRestoredSelectionEntry(raw: any): SelectionEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const categoryPath = Array.isArray(raw.categoryPath) ? raw.categoryPath.map(String) : [];
  const count = Number(raw.count) || 0;
  if (count <= 0) return null;

  let name = "";
  const rawItem = raw.item;
  if (rawItem && typeof rawItem === "object") {
    name = String((rawItem as any).name || "");
  } else if (typeof raw.name === "string") {
    name = raw.name;
  }

  const rawDetail = raw.detail;
  if (!name && rawDetail && typeof rawDetail === "object") {
    name = String((rawDetail as any).name || "");
  }

  let detail: any = null;
  if (rawDetail && typeof rawDetail === "object" && Array.isArray((rawDetail as any).modes)) {
    detail = rawDetail;
  } else if (rawDetail && typeof rawDetail === "object" && (rawDetail as any).detail) {
    detail = (rawDetail as any).detail;
  }

  if (!name) return null;
  if (!detail || !Array.isArray(detail.modes)) return null;

  const modeSelections = normalizeModeSelections(detail as LinkDetail, raw.modeSelections);
  const efficiency = raw.efficiency !== undefined ? Number(raw.efficiency) : 100;
  const key = createSelectionKey(name, detail as LinkDetail, modeSelections);

  const normalized = normalizeCountAndEfficiency((count * efficiency) / 100);

  return {
    key,
    categoryPath,
    name,
    detail: detail as LinkDetail,
    count: normalized.count,
    modeSelections,
    efficiency: normalized.efficiency,
  };
}

function findDupeDetail(data: Menu): { link: Link; categoryPath: string[] } | null {
  const visited = new WeakSet<Menu>();
  let fallback: { link: Link; categoryPath: string[] } | null = null;

  const hasOptionName = (detail: any, optionName: string): boolean => {
    const modes = Array.isArray(detail?.modes) ? detail.modes : [];
    return modes.some((mode: any) => {
      const options = Array.isArray(mode?.options) ? mode.options : [];
      return options.some((opt: any) => opt?.name === optionName);
    });
  };

  const buildCategoryPath = (stack: Menu[]) => stack.slice(1).map((m) => m.title).filter(Boolean);

  const dfs = (menu: Menu, stack: Menu[]): { link: Link; categoryPath: string[] } | null => {
    if (!menu || visited.has(menu)) return null;
    visited.add(menu);
    const items = Array.isArray(menu.items) ? menu.items : [];

    for (const item of items) {
      if (item?.detail && "resources" in item.detail && "modes" in item.detail && !("heat" in item.detail) && !("life" in item.detail)) {
        const candidate = { link: item, categoryPath: buildCategoryPath(stack) };
        if (!fallback) fallback = candidate;
        if (hasOptionName(item.detail, "抽水马桶")) {
          return candidate;
        }
      }

      if (item?.menu) {
        const found = dfs(item.menu, [...stack, item.menu]);
        if (found) return found;
      }
    }
    return null;
  };

  return dfs(data, [data]) || fallback;
}

type SelectionsState = {
  selections: SelectionEntry[];
};

type SelectionsAction =
  | { type: "upsert"; payload: UpsertPayload }
  | { type: "update"; payload: { fromKey: string; next: UpsertPayload } }
  | { type: "remove"; payload: { key: string } }
  | { type: "replace"; payload: { selections: SelectionEntry[] } }
  | { type: "clear" };

function selectionsReducer(state: SelectionsState, action: SelectionsAction): SelectionsState {
  switch (action.type) {
    case "upsert": {
      const normalizedModeSelections = normalizeModeSelections(action.payload.detail, action.payload.modeSelections);
      const incomingEff = action.payload.efficiency ?? 100;
      const incomingEffectiveCount = (action.payload.count * incomingEff) / 100;
      const key = createSelectionKey(action.payload.name, action.payload.detail, normalizedModeSelections);

      if (action.payload.count <= 0) {
        return {
          selections: state.selections.filter((s) => s.key !== key),
        };
      }

      const existingIndex = state.selections.findIndex((s) => s.key === key);
      const nextSelections = state.selections.slice();
      if (existingIndex >= 0) {
        const existing = nextSelections[existingIndex];
        const nextTotalEffective = (existing.count * (existing.efficiency ?? 100)) / 100 + incomingEffectiveCount;
        const normalized = normalizeCountAndEfficiency(nextTotalEffective);

        if (normalized.count <= 0) {
          nextSelections.splice(existingIndex, 1);
        } else {
          nextSelections[existingIndex] = {
            ...existing,
            name: action.payload.name,
            detail: action.payload.detail,
            modeSelections: normalizedModeSelections,
            count: normalized.count,
            efficiency: normalized.efficiency,
          };
        }
      } else {
        if (incomingEffectiveCount <= 0) {
          return state;
        }
        const normalized = normalizeCountAndEfficiency(incomingEffectiveCount);
        nextSelections.push({
          key,
          categoryPath: action.payload.categoryPath,
          name: action.payload.name,
          detail: action.payload.detail,
          count: normalized.count,
          modeSelections: normalizedModeSelections,
          efficiency: normalized.efficiency,
        });
      }
      return { selections: nextSelections };
    }
    case "update": {
      const normalizedModeSelections = normalizeModeSelections(action.payload.next.detail, action.payload.next.modeSelections);
      const incomingEff = action.payload.next.efficiency ?? 100;
      const incomingEffectiveCount = (action.payload.next.count * incomingEff) / 100;
      const nextKey = createSelectionKey(action.payload.next.name, action.payload.next.detail, normalizedModeSelections);
      const fromKey = action.payload.fromKey;

      const baseSelections = state.selections.filter((s) => s.key !== fromKey);

      if (incomingEffectiveCount <= 0) {
        return { selections: baseSelections };
      }

      const existingIndex = baseSelections.findIndex((s) => s.key === nextKey);
      const nextSelections = baseSelections.slice();

      if (existingIndex >= 0) {
        const existing = nextSelections[existingIndex];
        const nextTotalEffective = (existing.count * (existing.efficiency ?? 100)) / 100 + incomingEffectiveCount;
        const normalized = normalizeCountAndEfficiency(nextTotalEffective);

        nextSelections[existingIndex] = {
          ...existing,
          name: action.payload.next.name,
          detail: action.payload.next.detail,
          modeSelections: normalizedModeSelections,
          categoryPath: action.payload.next.categoryPath,
          count: normalized.count,
          efficiency: normalized.efficiency,
        };
      } else {
        const normalized = normalizeCountAndEfficiency(incomingEffectiveCount);
        nextSelections.push({
          key: nextKey,
          name: action.payload.next.name,
          detail: action.payload.next.detail,
          modeSelections: normalizedModeSelections,
          categoryPath: action.payload.next.categoryPath,
          count: normalized.count,
          efficiency: normalized.efficiency,
        });
      }

      return { selections: nextSelections };
    }
    case "remove": {
      return {
        selections: state.selections.filter((s) => s.key !== action.payload.key),
      };
    }
    case "replace": {
      return {
        selections: mergeSelectionsByKey(action.payload.selections),
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
  const resourceKinds: Record<string, ResourceUnitKind> = {};
  let totalPower = 0;
  let totalHeat = 0;
  let totalCalories = 0;

  const mergeKind = (a: ResourceUnitKind | undefined, b: ResourceUnitKind | undefined): ResourceUnitKind | undefined => {
    if (!b) return a;
    if (!a) return b;
    if (a === b) return a;
    if (a === "mass" || b === "mass") return "mass";
    return "count";
  };

  selections.forEach((selection) => {
    const totals = calculateSelectionTotals(selection.detail, selection.count, selection.modeSelections, selection.efficiency);
    totalPower += totals.totalPower;
    totalHeat += totals.totalHeat;
    totalCalories += totals.totalCalories;

    Object.entries(totals.resources).forEach(([name, value]) => {
      resources[name] = (resources[name] || 0) + value;
      resourceKinds[name] = mergeKind(resourceKinds[name], totals.resourceKinds[name]) as ResourceUnitKind;
    });
  });

  const resourceItems: ResourceItem[] = Object.entries(resources).map(([name, value]) => ({
    name,
    value,
    count: 1,
    kind: resourceKinds[name] || "mass",
  }));

  return {
    resources,
    resourceKinds,
    resourceItems,
    totalPower,
    totalHeat,
    totalCalories,
  };
}

export function SelectionsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(selectionsReducer, { selections: [] });
  const hydratedRef = useRef(false);
  const { data } = useContext(DataContext);
  const [shouldInitDefaults, setShouldInitDefaults] = useState(false);

  const debouncedSaveRef = useRef(
    debounce((selections: SelectionEntry[]) => {
      const saved: SavedSelectionEntry[] = selections.map((s) => ({
        key: s.key,
        categoryPath: s.categoryPath,
        name: s.name,
        detail: s.detail,
        count: s.count,
        modeSelections: s.modeSelections,
        efficiency: s.efficiency,
      }));
      Taro.setStorage({
        key: "selections",
        data: saved,
      });
    }, 1000)
  );

  useEffect(() => {
    const saved = Taro.getStorageSync("selections") as SavedSelectionEntry[] | undefined;
    if (Array.isArray(saved) && saved.length) {
      const restored: SelectionEntry[] = saved
        .map((s) => normalizeRestoredSelectionEntry(s))
        .filter(Boolean) as SelectionEntry[];

      dispatch({ type: "replace", payload: { selections: restored } });
    } else {
      setShouldInitDefaults(true);
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (shouldInitDefaults && data) {
      const found = findDupeDetail(data);
      if (found) {
        const detail = found.link.detail as LinkDetail;
        const defaultSelections = buildDefaultModeSelections(detail);
        const modes = (detail as any).modes || [];

        const modeSelections: ModeSelections = { ...defaultSelections };
        modes.forEach((mode: any) => {
          const options = Array.isArray(mode?.options) ? mode.options : [];
          if (options.some((o: any) => o?.name === "抽水马桶")) {
            modeSelections[mode.name] = "抽水马桶";
          }
        });

        dispatch({
          type: "upsert",
          payload: {
            name: found.link.name,
            detail,
            count: 3,
            modeSelections,
            categoryPath: found.categoryPath
          }
        });
      }
      setShouldInitDefaults(false);
    }
  }, [data, shouldInitDefaults]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    if (!state.selections.length) {
      // Don't clear storage immediately if we are waiting for defaults
      if (!shouldInitDefaults) {
        Taro.removeStorage({ key: "selections" });
      }
      return;
    }
    debouncedSaveRef.current(state.selections);
  }, [state.selections, shouldInitDefaults]);

  const summary = useMemo(() => buildSummary(state.selections), [state.selections]);
  const groupedSelections = useMemo(() => buildGroupedSelections(state.selections), [state.selections]);

  const actions = useMemo<SelectionsActions>(
    () => ({
      upsert: (payload) => dispatch({ type: "upsert", payload }),
      update: (fromKey, payload) => dispatch({ type: "update", payload: { fromKey, next: payload } }),
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
      groupedSelections,
      summary,
    }),
    [state.selections, groupedSelections, summary]
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
