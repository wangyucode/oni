import { LinkDetail, Mode, PhaseSets } from "@/types/data";
import { CYCLE_SECONDS } from "@/contexts/UnitContext";
import { GROWTH_MODE_NAME, GROWTH_WILD_OPTION, ModeSelections, isPlantDetail, normalizeModeSelections, optionFactor } from "@/components/selection/modeSelection";

export type SelectionTotals = {
  resources: Record<string, number>;
  resourceKinds: Record<string, ResourceUnitKind>;
  totalFactor: number;
  totalPower: number;
  totalHeat: number;
  totalCalories: number;
};

export type SelectionCalcOptions = {
  phaseSets?: PhaseSets;
  isPlant?: boolean;
};

export type ResourceUnitKind = "mass" | "count" | "kcal" | "growth";

export function parseNumber(raw: string | undefined): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[,，]/g, "");
  const match = cleaned.match(/[+-]?\d+(?:\.\d+)?/);
  if (!match) return 0;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : 0;
}

export function parseResourceRate(raw: string | undefined): { valuePerSecond: number; kind: ResourceUnitKind } {
  if (!raw) return { valuePerSecond: 0, kind: "mass" };

  const s = String(raw).replace(/\s+/g, "");
  const amount = parseNumber(s);
  if (!amount) return { valuePerSecond: 0, kind: "mass" };

  let kind: ResourceUnitKind = "mass";
  let numeratorMultiplier = 1;

  if (/千克/i.test(s) || /\bkg\b/i.test(s)) {
    kind = "mass";
    numeratorMultiplier = 1000;
  } else if (/毫克/i.test(s) || /\bmg\b/i.test(s)) {
    kind = "mass";
    numeratorMultiplier = 0.001;
  } else if (/千卡/i.test(s) || /\bkcal\b/i.test(s)) {
    kind = "kcal";
    numeratorMultiplier = 1;
  } else if (/生长进度/i.test(s)) {
    kind = "growth";
    numeratorMultiplier = 1;
  } else if (/克/i.test(s) || /\bg\b/i.test(s)) {
    kind = "mass";
    numeratorMultiplier = 1;
  } else if (/单位|个|枚|瓶|粒|块/i.test(s)) {
    kind = "count";
    numeratorMultiplier = 1;
  } else {
    kind = "mass";
    numeratorMultiplier = 1;
  }

  let denominatorSeconds = 1;
  const perSeconds = s.match(/\/([+-]?\d+(?:\.\d+)?)秒/);
  if (perSeconds) {
    const n = Number(perSeconds[1]);
    if (Number.isFinite(n) && n > 0) denominatorSeconds = n;
  } else {
    const perCycles = s.match(/\/([+-]?\d+(?:\.\d+)?)周期/);
    if (perCycles) {
      const n = Number(perCycles[1]);
      if (Number.isFinite(n) && n > 0) denominatorSeconds = n * CYCLE_SECONDS;
    } else if (s.includes("/周期") || s.includes("每周期")) {
      denominatorSeconds = CYCLE_SECONDS;
    } else if (s.includes("/秒") || s.includes("每秒")) {
      denominatorSeconds = 1;
    }
  }

  const baseValue = amount * numeratorMultiplier;
  const valuePerSecond = baseValue / denominatorSeconds;
  return { valuePerSecond: Number.isFinite(valuePerSecond) ? valuePerSecond : 0, kind };
}

function mergeResourceKind(a: ResourceUnitKind | undefined, b: ResourceUnitKind): ResourceUnitKind {
  if (!a) return b;
  if (a === b) return a;
  const order: ResourceUnitKind[] = ["mass", "kcal", "count", "growth"];
  return order.find(k => k === a || k === b) || a;
}

export function calculateSelectionTotals(
  detail: LinkDetail,
  count: number,
  modeSelections: ModeSelections,
  efficiency: number = 100,
  calorieDelta: number = 0,
  powerDelta: number = 0,
  options: SelectionCalcOptions = {}
): SelectionTotals {
  const detailAny = detail as any;
  const modes: Mode[] = Array.isArray(detailAny?.modes) ? detailAny.modes : [];
  const resources: Record<string, number> = {};
  const resourceKinds: Record<string, ResourceUnitKind> = {};
  let totalFactor = 1;

  const efficiencyFactor = efficiency / 100;
  const normalizedSelections = normalizeModeSelections(detail, modeSelections);

  if (detailAny.min && detailAny.max) {
    const entries = Object.entries(detailAny.min as Record<string, string>);
    if (entries.length > 0) {
      const [name] = entries[0];
      const rawValue = normalizedSelections["平均产量"];
      const parsed = parseResourceRate(rawValue);
      const resourceValue = count * parsed.valuePerSecond * efficiencyFactor;
      if (resourceValue) {
        resources[name] = resourceValue;
        resourceKinds[name] = parsed.kind;
      }
    }
  }

  modes.forEach((mode) => {
    const modeSelection = normalizedSelections[mode.name];
    mode.options.forEach((option) => {
      const factor = optionFactor(option, modeSelection);
      Object.entries(option.resources || {}).forEach(([name, rawValue]) => {
        const parsed = parseResourceRate(rawValue);
        const resourceValue = count * parsed.valuePerSecond * factor * efficiencyFactor;
        if (!resourceValue) return;
        resources[name] = (resources[name] || 0) + resourceValue;
        resourceKinds[name] = mergeResourceKind(resourceKinds[name], parsed.kind);
      });
    });
  });

  const effectiveTotalFactor = totalFactor > 0 ? totalFactor : 1;

  Object.entries((detailAny?.resources || {}) as Record<string, string>).forEach(([name, rawValue]) => {
    const parsed = parseResourceRate(rawValue);
    const resourceValue = count * parsed.valuePerSecond * effectiveTotalFactor * efficiencyFactor;
    if (!resourceValue) return;
    resources[name] = (resources[name] || 0) + resourceValue;
    resourceKinds[name] = mergeResourceKind(resourceKinds[name], parsed.kind);
  });

  const isPlant = options.isPlant ?? isPlantDetail(detail);
  const isWildGrowth = normalizedSelections[GROWTH_MODE_NAME] === GROWTH_WILD_OPTION;
  const phaseSets = options.phaseSets;
  const hasPhaseSets = !!phaseSets && (phaseSets.solid.size > 0 || phaseSets.liquid.size > 0 || phaseSets.gas.size > 0);

  if (isPlant && isWildGrowth && hasPhaseSets) {
    Object.keys(resources).forEach((name) => {
      const value = resources[name];
      const isGas = phaseSets?.gas.has(name) ?? false;
      if (isGas) return;
      if (value < 0) {
        delete resources[name];
        delete resourceKinds[name];
        return;
      }
      if (value > 0) {
        resources[name] = value / 4;
      }
    });
  }

  const totalPower = parseNumber(detailAny?.power) * count * effectiveTotalFactor * efficiencyFactor + powerDelta * count;
  const totalHeat = parseNumber(detailAny?.heat) * count * effectiveTotalFactor * efficiencyFactor;
  const totalCalories = parseNumber(detailAny?.calorie) * count * effectiveTotalFactor * efficiencyFactor + calorieDelta * count;

  return {
    resources,
    resourceKinds,
    totalFactor: effectiveTotalFactor,
    totalPower,
    totalHeat,
    totalCalories,
  };
}
