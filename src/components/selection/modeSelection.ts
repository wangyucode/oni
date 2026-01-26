import { LinkDetail, Mode, Option } from "../../types/data";

export type ModeSelections = Record<string, string>;

export function buildDefaultModeSelection(mode: Mode): string {
  return mode.options[0]?.name || "";
}

export function buildDefaultModeSelections(detail: LinkDetail): ModeSelections {
  return normalizeModeSelections(detail, {});
}

export function normalizeModeSelections(detail: LinkDetail, raw: ModeSelections): ModeSelections {
  const detailAny = detail as any;
  const modes = detailAny.modes as Mode[] | undefined;

  if (modes) {
    return Object.fromEntries(
      modes.map((mode) => [mode.name, setModeSelection(mode, raw[mode.name])])
    );
  }

  if (detailAny.min && detailAny.max) {
    const entries = Object.entries(detailAny.min as Record<string, string>);
    if (entries.length > 0) {
      const [name, minRaw] = entries[0];
      const maxRaw = (detailAny.max as Record<string, string>)[name] || minRaw;
      const unitStr = minRaw.replace(/^[\d\.]+/, "");
      const minNum = parseFloat(minRaw) || 0;
      const maxNum = parseFloat(maxRaw) || 0;
      const defaultVal = (minNum + maxNum) / 2;

      const currentVal = raw["平均产量"];
      if (currentVal) return { "平均产量": currentVal };
      return { "平均产量": `${defaultVal}${unitStr}` };
    }
  }

  return {};
}

export function setModeSelection(mode: Mode, selected: string | undefined): string {
  const isValid = mode.options.some((o) => o.name === selected);
  return isValid ? (selected as string) : buildDefaultModeSelection(mode);
}

export function optionFactor(option: Option, selected: string | undefined): number {
  return selected === option.name ? 1 : 0;
}

