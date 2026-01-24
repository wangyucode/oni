import { LinkDetail, Mode, Option } from "../data";

export type ModeSelections = Record<string, string>;

export function buildDefaultModeSelection(mode: Mode): string {
  return mode.options[0]?.name || "";
}

export function buildDefaultModeSelections(detail: LinkDetail): ModeSelections {
  return normalizeModeSelections(detail, {});
}

export function normalizeModeSelections(detail: LinkDetail, raw: ModeSelections): ModeSelections {
  const modes = (detail as any).modes as Mode[] | undefined;
  if (!modes) return {};

  return Object.fromEntries(
    modes.map((mode) => [mode.name, setModeSelection(mode, raw[mode.name])])
  );
}

export function setModeSelection(mode: Mode, selected: string | undefined): string {
  const isValid = mode.options.some((o) => o.name === selected);
  return isValid ? (selected as string) : buildDefaultModeSelection(mode);
}

export function optionFactor(option: Option, selected: string | undefined): number {
  return selected === option.name ? 1 : 0;
}

