import { LinkDetail, Mode } from "../data";
import { ModeSelections, buildDefaultModeSelection, optionFactor, normalizeModeSelections } from "./modeSelection";

export type SelectionTotals = {
  resources: Record<string, number>;
  totalFactor: number;
  totalPower: number;
  totalHeat: number;
  totalCalories: number;
};

export function parseNumber(raw: string | undefined): number {
  if (!raw) return 0;
  const match = raw.match(/-?\d+(?:\.\d+)?/);
  if (!match) return 0;
  const value = Number(match[0]);
  return Number.isFinite(value) ? value : 0;
}

export function calculateSelectionTotals(
  detail: LinkDetail,
  count: number,
  modeSelections: ModeSelections
): SelectionTotals {
  const detailAny = detail as any;
  const modes: Mode[] = Array.isArray(detailAny?.modes) ? detailAny.modes : [];
  const resources: Record<string, number> = {};
  let totalFactor = 0;

  const normalizedSelections = normalizeModeSelections(detail, modeSelections);

  modes.forEach((mode, modeIndex) => {
    const modeSelection = normalizedSelections[modeIndex] || buildDefaultModeSelection(mode);
    mode.options.forEach((option) => {
      const factor = optionFactor(option, modeSelection);
      totalFactor += factor;

      Object.entries(option.resources || {}).forEach(([name, rawValue]) => {
        const value = parseNumber(rawValue);
        const resourceValue = count * value * factor;
        if (!resourceValue) return;
        resources[name] = (resources[name] || 0) + resourceValue;
      });
    });
  });

  Object.entries((detailAny?.resources || {}) as Record<string, string>).forEach(([name, rawValue]) => {
    const value = parseNumber(rawValue);
    const resourceValue = count * value * totalFactor;
    if (!resourceValue) return;
    resources[name] = (resources[name] || 0) + resourceValue;
  });

  const totalPower = parseNumber(detailAny?.power) * count * totalFactor;
  const totalHeat = parseNumber(detailAny?.heat) * count * totalFactor;
  const totalCalories = parseNumber(detailAny?.calorie) * count * totalFactor;

  return {
    resources,
    totalFactor,
    totalPower,
    totalHeat,
    totalCalories,
  };
}
