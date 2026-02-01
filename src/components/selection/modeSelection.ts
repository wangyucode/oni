import { LinkDetail, Mode, Option } from "@/types/data";

export type ModeSelections = Record<string, string>;

export const GROWTH_MODE_NAME = "生长模式";
export const GROWTH_CULTIVATED_OPTION = "人工栽培";
export const GROWTH_WILD_OPTION = "野外生长";

export function withPlantGrowthMode(detail: LinkDetail, forcePlant?: boolean): LinkDetail {
  const shouldInject = forcePlant ?? isPlantDetail(detail);
  if (!shouldInject) return detail;
  const detailAny = detail as any;
  const modes = Array.isArray(detailAny.modes) ? detailAny.modes : [];
  if (modes.some((mode) => mode?.name === GROWTH_MODE_NAME)) return detail;
  const growthMode: Mode = {
    name: GROWTH_MODE_NAME,
    options: [
      { name: GROWTH_CULTIVATED_OPTION, resources: {} },
      { name: GROWTH_WILD_OPTION, resources: {} },
    ],
  };
  return { ...detailAny, modes: [...modes, growthMode] };
}

export function buildDefaultModeSelection(mode: Mode): string {
  return mode.options[0]?.name || "";
}

export function buildDefaultModeSelections(detail: LinkDetail): ModeSelections {
  return normalizeModeSelections(detail, {});
}

export function isPlantDetail(detail: LinkDetail): boolean {
  const d = detail as any;
  return !!d.resources && !("min" in d) && !("power" in d) && !("drop" in d);
}

export function getEffectiveModes(detail: LinkDetail): Mode[] | undefined {
  const d = detail as any;
  const base = (d.modes as Mode[] | undefined) || [];
  if (isPlantDetail(detail)) {
    const growthMode: Mode = {
      name: "生长模式",
      options: [
        { name: "人工栽培", resources: {} },
        { name: "野外生长", resources: {} },
      ],
    };
    return [...base, growthMode];
  }
  return base;
}

export function normalizeModeSelections(detail: LinkDetail, raw: ModeSelections): ModeSelections {
  const detailAny = detail as any;
  const modes = getEffectiveModes(detail);

  if (modes && modes.length > 0) {
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

