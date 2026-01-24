import { LinkDetail, Mode, Option } from "../data";

export type ModeSelections = Record<string, string>;

export function buildDefaultModeSelection(mode: Mode): string {
  return mode.options[0]?.name || "";
}

export function buildDefaultModeSelections(detail: LinkDetail): ModeSelections {
  const modes = (detail as any)?.modes as Mode[] | undefined;
  if (!Array.isArray(modes)) return {};

  return modes.reduce((acc, mode) => {
    acc[mode.name] = buildDefaultModeSelection(mode);
    return acc;
  }, {} as ModeSelections);
}

export function normalizeModeSelections(detail: LinkDetail, raw: any): ModeSelections {
  const modes = (detail as any)?.modes as Mode[] | undefined;
  if (!Array.isArray(modes)) return {};

  const rawObj = (typeof raw === "object" && raw !== null) ? raw : {};
  const result: ModeSelections = {};

  for (const mode of modes) {
    const selected = rawObj[mode.name];
    const options = mode.options.map((o) => o.name);
    if (typeof selected === "string" && options.includes(selected)) {
      result[mode.name] = selected;
    } else {
      result[mode.name] = buildDefaultModeSelection(mode);
    }
  }
  return result;
}

export function setModeSelection(mode: Mode, selected: string): string {
  const options = mode.options.map((o) => o.name);
  return options.includes(selected) ? selected : buildDefaultModeSelection(mode);
}

export function optionFactor(option: Option, selected: string | undefined): number {
  return selected === option.name ? 1 : 0;
}

