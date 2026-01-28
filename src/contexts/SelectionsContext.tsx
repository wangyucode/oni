import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Taro from "@tarojs/taro";
import { debounce } from "@tarojs/runtime";

import { Link, LinkDetail, Menu } from "@/types/data";
import { ResourceItem } from "@/components/ui/ResourceGrid";
import { calculateSelectionTotals, ResourceUnitKind } from "@/components/selection/calc";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "@/components/selection/modeSelection";
import { DataContext } from "@/contexts/DataContext";
import { CYCLE_SECONDS, HUNGER_OPTIONS, useUnit } from "@/contexts/UnitContext";

export type Project = {
  name: string; // 方案1，方案2等
  selections: SelectionEntry[];
};

export type SelectionEntry = {
  key: string;
  category: string;
  name: string;
  count: number;
  modeSelections: ModeSelections;
  efficiency?: number;
};

export type SelectionEntryWithDetail = SelectionEntry & {
  detail: LinkDetail;
};

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
  category: string;
  name: string;
  count: number;
};

export type SelectionsContextValue = {
  selections: SelectionEntryWithDetail[];
  groupedSelections: GroupedSelectionEntry[];
  summary: SelectionsSummary;
  projects: Project[];
  currentProjectIndex: number;
};

type UpsertPayload = {
  name: string;
  detail: LinkDetail;
  count: number;
  modeSelections: ModeSelections;
  category: string;
  efficiency?: number;
};

export type SelectionsActions = {
  upsert: (payload: UpsertPayload) => void;
  update: (fromKey: string, payload: UpsertPayload) => void;
  remove: (key: string) => void;
  clear: () => void;
  addProject: () => void;
  deleteProject: (index: number) => void;
  switchProject: (index: number) => void;
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
  projects: [{ name: "方案1", selections: [] }],
  currentProjectIndex: 0,
});

export const SelectionsActionsContext = createContext<SelectionsActions>({
  upsert: () => { },
  update: () => { },
  remove: () => { },
  clear: () => { },
  addProject: () => { },
  deleteProject: () => { },
  switchProject: () => { },
});

function serializeModeSelections(detail: LinkDetail, raw: ModeSelections): string {
  const normalized = normalizeModeSelections(detail, raw);
  const detailAny = detail as any;
  const modes = detailAny.modes || [];
  const parts = modes.map((m: any) => normalized[m.name] || "");
  if (detailAny.min && detailAny.max && normalized["平均产量"]) {
    parts.push(`平均产量:${normalized["平均产量"]}`);
  }
  return parts.join("|");
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

function buildGroupedSelections(selections: SelectionEntry[]): GroupedSelectionEntry[] {
  const grouped = new Map<string, { entry: GroupedSelectionEntry; rawCount: number }>();
  selections.forEach((selection) => {
    const categoryKey = selection.category;
    const groupKey = `${categoryKey}::${selection.name}`;

    const contribution = (selection.count * (selection.efficiency ?? 100)) / 100;

    const existing = grouped.get(groupKey);
    if (existing) {
      existing.rawCount += contribution;
    } else {
      grouped.set(groupKey, {
        entry: {
          key: groupKey,
          category: selection.category,
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

function findDetailByName(data: Menu, name: string): LinkDetail | null {
  const visited = new WeakSet<Menu>();
  const dfs = (menu: Menu): LinkDetail | null => {
    if (!menu || visited.has(menu)) return null;
    visited.add(menu);
    const items = Array.isArray(menu.items) ? menu.items : [];
    for (const item of items) {
      if (item?.name === name && item?.detail) {
        return item.detail as LinkDetail;
      }
      if (item?.menu) {
        const found = dfs(item.menu);
        if (found) return found;
      }
    }
    return null;
  };
  return dfs(data);
}

function findDupeDetail(data: Menu): { link: Link; category: string } | null {
  const visited = new WeakSet<Menu>();
  let fallback: { link: Link; category: string } | null = null;

  const hasOptionName = (detail: any, optionName: string): boolean => {
    const modes = Array.isArray(detail?.modes) ? detail.modes : [];
    return modes.some((mode: any) => {
      const options = Array.isArray(mode?.options) ? mode.options : [];
      return options.some((opt: any) => opt?.name === optionName);
    });
  };

  const getCategory = (stack: Menu[]) => {
    const path = stack.slice(1).map((m) => m.title).filter(Boolean);
    return path.length > 0 ? path[0] : "";
  };

  const dfs = (menu: Menu, stack: Menu[]): { link: Link; category: string } | null => {
    if (!menu || visited.has(menu)) return null;
    visited.add(menu);
    const items = Array.isArray(menu.items) ? menu.items : [];

    for (const item of items) {
      if (item?.detail && "resources" in item.detail && "modes" in item.detail && !("heat" in item.detail) && !("life" in item.detail)) {
        const candidate = { link: item, category: getCategory(stack) };
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
  projects: Project[];
  currentProjectIndex: number;
};

type SelectionsAction =
  | { type: "upsert"; payload: UpsertPayload }
  | { type: "update"; payload: { fromKey: string; next: UpsertPayload } }
  | { type: "remove"; payload: { key: string } }
  | { type: "replace_all"; payload: { projects: Project[]; currentProjectIndex?: number } }
  | { type: "clear" }
  | { type: "add_project" }
  | { type: "delete_project"; payload: { index: number } }
  | { type: "switch_project"; payload: { index: number } };

function selectionsReducer(state: SelectionsState, action: SelectionsAction): SelectionsState {
  const { projects, currentProjectIndex } = state;
  const currentProject = projects[currentProjectIndex];
  const selections = currentProject.selections;

  switch (action.type) {
    case "upsert": {
      const normalizedModeSelections = normalizeModeSelections(action.payload.detail, action.payload.modeSelections);
      const incomingEff = action.payload.efficiency ?? 100;
      const incomingEffectiveCount = (action.payload.count * incomingEff) / 100;
      const key = createSelectionKey(action.payload.name, action.payload.detail, normalizedModeSelections);

      let nextSelections = selections.slice();
      if (action.payload.count <= 0) {
        nextSelections = nextSelections.filter((s) => s.key !== key);
      } else {
        const existingIndex = nextSelections.findIndex((s) => s.key === key);
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
              modeSelections: normalizedModeSelections,
              count: normalized.count,
              efficiency: normalized.efficiency,
            };
          }
        } else {
          if (incomingEffectiveCount <= 0) return state;
          const normalized = normalizeCountAndEfficiency(incomingEffectiveCount);
          nextSelections.push({
            key,
            category: action.payload.category,
            name: action.payload.name,
            count: normalized.count,
            modeSelections: normalizedModeSelections,
            efficiency: normalized.efficiency,
          });
        }
      }

      const nextProjects = projects.slice();
      nextProjects[currentProjectIndex] = { ...currentProject, selections: nextSelections };
      return { ...state, projects: nextProjects };
    }
    case "update": {
      const normalizedModeSelections = normalizeModeSelections(action.payload.next.detail, action.payload.next.modeSelections);
      const incomingEff = action.payload.next.efficiency ?? 100;
      const incomingEffectiveCount = (action.payload.next.count * incomingEff) / 100;
      const nextKey = createSelectionKey(action.payload.next.name, action.payload.next.detail, normalizedModeSelections);
      const fromKey = action.payload.fromKey;

      const baseSelections = selections.filter((s) => s.key !== fromKey);
      let nextSelections = baseSelections.slice();

      if (incomingEffectiveCount > 0) {
        const existingIndex = nextSelections.findIndex((s) => s.key === nextKey);
        if (existingIndex >= 0) {
          const existing = nextSelections[existingIndex];
          const nextTotalEffective = (existing.count * (existing.efficiency ?? 100)) / 100 + incomingEffectiveCount;
          const normalized = normalizeCountAndEfficiency(nextTotalEffective);

          nextSelections[existingIndex] = {
            ...existing,
            name: action.payload.next.name,
            modeSelections: normalizedModeSelections,
            category: action.payload.next.category,
            count: normalized.count,
            efficiency: normalized.efficiency,
          };
        } else {
          const normalized = normalizeCountAndEfficiency(incomingEffectiveCount);
          nextSelections.push({
            key: nextKey,
            name: action.payload.next.name,
            modeSelections: normalizedModeSelections,
            category: action.payload.next.category,
            count: normalized.count,
            efficiency: normalized.efficiency,
          });
        }
      }

      const nextProjects = projects.slice();
      nextProjects[currentProjectIndex] = { ...currentProject, selections: nextSelections };
      return { ...state, projects: nextProjects };
    }
    case "remove": {
      const nextSelections = selections.filter((s) => s.key !== action.payload.key);
      const nextProjects = projects.slice();
      nextProjects[currentProjectIndex] = { ...currentProject, selections: nextSelections };
      return { ...state, projects: nextProjects };
    }
    case "replace_all": {
      return {
        ...state,
        projects: action.payload.projects,
        currentProjectIndex: action.payload.currentProjectIndex ?? state.currentProjectIndex,
      };
    }
    case "clear": {
      const nextProjects = projects.slice();
      nextProjects[currentProjectIndex] = { ...currentProject, selections: [] };
      return { ...state, projects: nextProjects };
    }
    case "add_project": {
      const nextProjects = projects.slice();
      let nextNum = 1;
      while (nextProjects.some((p) => p.name === `方案${nextNum}`)) {
        nextNum++;
      }
      nextProjects.push({
        name: `方案${nextNum}`,
        selections: [],
      });
      return {
        ...state,
        projects: nextProjects,
        currentProjectIndex: nextProjects.length - 1,
      };
    }
    case "delete_project": {
      if (projects.length <= 1) {
        const nextProjects = [{ name: "方案1", selections: [] }];
        return { ...state, projects: nextProjects, currentProjectIndex: 0 };
      }
      const nextProjects = projects.filter((_, i) => i !== action.payload.index);
      let nextIndex = currentProjectIndex;
      if (nextIndex >= nextProjects.length) {
        nextIndex = nextProjects.length - 1;
      }
      return {
        ...state,
        projects: nextProjects,
        currentProjectIndex: nextIndex,
      };
    }
    case "switch_project": {
      return {
        ...state,
        currentProjectIndex: action.payload.index,
      };
    }
    default: {
      return state;
    }
  }
}

function buildSummary(selections: SelectionEntryWithDetail[], hungerLevelDeltas: { calorieDelta: number; powerDelta: number }): SelectionsSummary {
  const resources: Record<string, number> = {};
  const resourceKinds: Record<string, ResourceUnitKind> = {};
  let totalPower = 0;
  let totalHeat = 0;
  let totalCalories = 0;
  let totalResourceCaloriesPerSecond = 0;

  const mergeKind = (a: ResourceUnitKind | undefined, b: ResourceUnitKind | undefined): ResourceUnitKind | undefined => {
    if (!b) return a;
    if (!a) return b;
    if (a === b) return a;
    if (a === "mass" || b === "mass") return "mass";
    return "count";
  };

  selections.forEach((selection) => {
    const isDupe = selection.name.includes("复制人");
    const isBionic = selection.name.includes("仿生人");
    const normalizedModeSelections = normalizeModeSelections(selection.detail, selection.modeSelections);
    const trait = normalizedModeSelections["特质"];
    const isBottomlessStomach = isDupe && trait === "无底洞之胃";
    const calorieDelta = isDupe ? hungerLevelDeltas.calorieDelta + (isBottomlessStomach ? -500 : 0) : 0;
    const powerDelta = isBionic ? hungerLevelDeltas.powerDelta : 0;
    const totals = calculateSelectionTotals(selection.detail, selection.count, normalizedModeSelections, selection.efficiency, calorieDelta, powerDelta);
    totalPower += totals.totalPower;
    totalHeat += totals.totalHeat;
    totalCalories += totals.totalCalories;

    Object.entries(totals.resources).forEach(([name, value]) => {
      resources[name] = (resources[name] || 0) + value;
      resourceKinds[name] = mergeKind(resourceKinds[name], totals.resourceKinds[name]) as ResourceUnitKind;
      if (totals.resourceKinds[name] === "kcal") {
        totalResourceCaloriesPerSecond += value;
      }
    });
  });
  totalCalories += totalResourceCaloriesPerSecond * CYCLE_SECONDS;

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
  const [state, dispatch] = useReducer(selectionsReducer, {
    projects: [{ name: "方案1", selections: [] }],
    currentProjectIndex: 0,
  });
  const hydratedRef = useRef(false);
  const { data } = useContext(DataContext);
  const [shouldInitDefaults, setShouldInitDefaults] = useState(false);

  const currentProject = state.projects[state.currentProjectIndex];

  const enrichedSelections = useMemo(() => {
    if (!data) return [];
    return currentProject.selections
      .map((s) => {
        const detail = findDetailByName(data, s.name);
        if (!detail) return null;
        const normalizedModeSelections = normalizeModeSelections(detail, s.modeSelections);
        return { ...s, detail, modeSelections: normalizedModeSelections };
      })
      .filter(Boolean) as SelectionEntryWithDetail[];
  }, [currentProject.selections, data]);

  const debouncedSaveRef = useRef(
    debounce((projects: Project[], currentProjectIndex: number) => {
      Taro.setStorage({
        key: "projects_data",
        data: { projects, currentProjectIndex },
      });
    }, 1000)
  );

  useEffect(() => {
    const appVersion = Taro.getStorageSync('appVersion');
    if (appVersion !== process.env.TARO_APP_VERSION) {
      Taro.clearStorageSync();
      Taro.setStorageSync('appVersion', process.env.TARO_APP_VERSION);
    }
    const savedData = Taro.getStorageSync("projects_data");
    if (savedData && Array.isArray(savedData.projects) && savedData.projects.length > 0) {
      dispatch({
        type: "replace_all",
        payload: {
          projects: savedData.projects,
          currentProjectIndex: savedData.currentProjectIndex || 0,
        },
      });
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
            category: found.category,
          },
        });
      }
      setShouldInitDefaults(false);
    }
  }, [data, shouldInitDefaults]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    debouncedSaveRef.current(state.projects, state.currentProjectIndex);
  }, [state.projects, state.currentProjectIndex]);

  const { hungerLevel } = useUnit();
  const hungerLevelDeltas = useMemo(
    () => HUNGER_OPTIONS.find((o) => o.label === hungerLevel) ?? { calorieDelta: 0, powerDelta: 0 },
    [hungerLevel]
  );

  const summary = useMemo(() => buildSummary(enrichedSelections, hungerLevelDeltas), [enrichedSelections, hungerLevelDeltas]);
  const groupedSelections = useMemo(() => buildGroupedSelections(currentProject.selections), [currentProject.selections]);

  const actions = useMemo<SelectionsActions>(
    () => ({
      upsert: (payload) => dispatch({ type: "upsert", payload }),
      update: (fromKey, payload) => dispatch({ type: "update", payload: { fromKey, next: payload } }),
      remove: (key) => dispatch({ type: "remove", payload: { key } }),
      clear: () => {
        dispatch({ type: "clear" });
      },
      addProject: () => dispatch({ type: "add_project" }),
      deleteProject: (index) => dispatch({ type: "delete_project", payload: { index } }),
      switchProject: (index) => dispatch({ type: "switch_project", payload: { index } }),
    }),
    []
  );

  const value = useMemo<SelectionsContextValue>(
    () => ({
      selections: enrichedSelections,
      groupedSelections,
      summary,
      projects: state.projects,
      currentProjectIndex: state.currentProjectIndex,
    }),
    [enrichedSelections, groupedSelections, summary, state.projects, state.currentProjectIndex]
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
