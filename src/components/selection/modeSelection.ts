import { LinkDetail, Mode, Option } from "../data";

export type ModeSelection = string;

export type ModeSelections = ModeSelection[];

export function buildDefaultModeSelection(mode: Mode): ModeSelection {
  return mode.options[0]?.name || "";
}

export function buildDefaultModeSelections(detail: LinkDetail): ModeSelections {
  const detailAny = detail as any;
  const modes: Mode[] = Array.isArray(detailAny?.modes) ? detailAny.modes : [];
  return modes.map(buildDefaultModeSelection);
}

function normalizeSelection(mode: Mode, raw: any): ModeSelection {
  const options = mode.options.map((o) => o.name);
  const selected = typeof raw === "string" ? raw : "";
  if (selected && options.includes(selected)) return selected;
  return options[0] || "";
}

export function normalizeModeSelections(detail: LinkDetail, raw: any): ModeSelections {
  const detailAny = detail as any;
  const modes: Mode[] = Array.isArray(detailAny?.modes) ? detailAny.modes : [];
  if (!modes.length) return [];

  if (Array.isArray(raw) && raw.every((v) => typeof v === "string")) {
    return modes.map((mode, idx) => normalizeSelection(mode, raw[idx]));
  }

  return modes.map(buildDefaultModeSelection);
}

export function setModeSelection(mode: Mode, selected: string): ModeSelection {
  const options = mode.options.map((o) => o.name);
  return options.includes(selected) ? selected : options[0] || "";
}

export function optionFactor(option: Option, modeSelection: ModeSelection | undefined): number {
  if (!modeSelection) return 0;
  return modeSelection === option.name ? 1 : 0;
}

