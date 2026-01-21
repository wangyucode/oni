import { LinkDetail, Mode, Option } from "../data";

export type ModeSelection =
  | { type: "radio"; selected: string }
  | { type: "slider"; values: Record<string, number> }
  | { type: "checkbox"; checked: Record<string, boolean> };

export type ModeSelections = ModeSelection[];

export function inferModeSelectionType(mode: Mode): ModeSelection["type"] {
  const optionTypes = mode.options.map((o) => o.type);
  if (optionTypes.every((t) => t === "radio")) return "radio";
  if (optionTypes.every((t) => t === "checkbox")) return "checkbox";
  return "slider";
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

export function buildDefaultModeSelection(mode: Mode): ModeSelection {
  const type = inferModeSelectionType(mode);
  if (type === "radio") {
    return { type: "radio", selected: mode.options[0]?.name || "" };
  }
  if (type === "checkbox") {
    const checked: Record<string, boolean> = {};
    mode.options.forEach((opt, index) => {
      checked[opt.name] = index === 0;
    });
    return { type: "checkbox", checked };
  }
  const values: Record<string, number> = {};
  mode.options.forEach((opt, index) => {
    values[opt.name] = index === 0 ? 100 : 0;
  });
  return { type: "slider", values };
}

export function buildDefaultModeSelections(detail: LinkDetail): ModeSelections {
  const detailAny = detail as any;
  const modes: Mode[] = Array.isArray(detailAny?.modes) ? detailAny.modes : [];
  return modes.map(buildDefaultModeSelection);
}

function isModeSelection(value: any): value is ModeSelection {
  if (!value || typeof value !== "object") return false;
  if (value.type === "radio") return typeof value.selected === "string";
  if (value.type === "slider") return !!value.values && typeof value.values === "object";
  if (value.type === "checkbox") return !!value.checked && typeof value.checked === "object";
  return false;
}

function normalizeRadioSelection(mode: Mode, raw: any): ModeSelection {
  const options = mode.options.map((o) => o.name);
  const selected = typeof raw?.selected === "string" ? raw.selected : "";
  if (selected && options.includes(selected)) return { type: "radio", selected };
  return { type: "radio", selected: options[0] || "" };
}

function normalizeSliderSelection(mode: Mode, raw: any): ModeSelection {
  const values: Record<string, number> = {};
  const rawValues = raw?.values && typeof raw.values === "object" ? raw.values : {};
  mode.options.forEach((opt) => {
    const nextValue = clampPercent(Number((rawValues as any)[opt.name]) || 0);
    values[opt.name] = nextValue;
  });
  if (!mode.options.length) return { type: "slider", values };
  const hasAny = mode.options.some((opt) => values[opt.name] > 0);
  if (!hasAny) values[mode.options[0].name] = 100;
  return { type: "slider", values };
}

function normalizeCheckboxSelection(mode: Mode, raw: any): ModeSelection {
  const checked: Record<string, boolean> = {};
  const rawChecked = raw?.checked && typeof raw.checked === "object" ? raw.checked : {};
  mode.options.forEach((opt) => {
    checked[opt.name] = Boolean((rawChecked as any)[opt.name]);
  });
  if (!mode.options.length) return { type: "checkbox", checked };
  const hasAny = mode.options.some((opt) => checked[opt.name]);
  if (!hasAny) checked[mode.options[0].name] = true;
  return { type: "checkbox", checked };
}

function normalizeSelectionForMode(mode: Mode, raw: any): ModeSelection {
  const type = inferModeSelectionType(mode);
  if (type === "radio") return normalizeRadioSelection(mode, raw);
  if (type === "checkbox") return normalizeCheckboxSelection(mode, raw);
  return normalizeSliderSelection(mode, raw);
}

function fromLegacyRecord(mode: Mode, record: Record<string, number>): ModeSelection {
  const type = inferModeSelectionType(mode);
  if (type === "radio") {
    const options = mode.options.map((o) => o.name);
    let selected = options[0] || "";
    let best = -Infinity;
    options.forEach((name) => {
      const v = Number(record?.[name]) || 0;
      if (v > best) {
        best = v;
        selected = name;
      }
    });
    return { type: "radio", selected };
  }
  if (type === "checkbox") {
    const checked: Record<string, boolean> = {};
    mode.options.forEach((opt, index) => {
      const v = Number(record?.[opt.name]) || 0;
      checked[opt.name] = v > 0;
      if (index === 0 && !Object.keys(record || {}).length) checked[opt.name] = true;
    });
    const hasAny = mode.options.some((opt) => checked[opt.name]);
    if (!hasAny && mode.options[0]) checked[mode.options[0].name] = true;
    return { type: "checkbox", checked };
  }
  const values: Record<string, number> = {};
  mode.options.forEach((opt) => {
    values[opt.name] = clampPercent(Number(record?.[opt.name]) || 0);
  });
  const hasAny = mode.options.some((opt) => values[opt.name] > 0);
  if (!hasAny && mode.options[0]) values[mode.options[0].name] = 100;
  return { type: "slider", values };
}

export function normalizeModeSelections(detail: LinkDetail, raw: any): ModeSelections {
  const detailAny = detail as any;
  const modes: Mode[] = Array.isArray(detailAny?.modes) ? detailAny.modes : [];
  if (!modes.length) return [];

  if (Array.isArray(raw) && raw.every(isModeSelection)) {
    return modes.map((mode, idx) => normalizeSelectionForMode(mode, raw[idx]));
  }

  if (Array.isArray(raw) && raw.every((v) => v && typeof v === "object" && !("type" in (v as any)))) {
    return modes.map((mode, idx) => fromLegacyRecord(mode, (raw[idx] || {}) as Record<string, number>));
  }

  return modes.map(buildDefaultModeSelection);
}

export function setModeSelectionRadio(mode: Mode, selected: string): ModeSelection {
  const options = mode.options.map((o) => o.name);
  return { type: "radio", selected: options.includes(selected) ? selected : options[0] || "" };
}

export function setModeSelectionSliderValue(mode: Mode, optionName: string, value: number, prev?: ModeSelection): ModeSelection {
  const base = prev?.type === "slider" ? prev : buildDefaultModeSelection(mode);
  if (base.type !== "slider") return normalizeSliderSelection(mode, { values: { [optionName]: value } });
  const nextValues = { ...base.values, [optionName]: clampPercent(value) };
  return normalizeSliderSelection(mode, { values: nextValues });
}

export function toggleModeSelectionCheckbox(mode: Mode, optionName: string, checked: boolean, prev?: ModeSelection): ModeSelection {
  const base = prev?.type === "checkbox" ? prev : buildDefaultModeSelection(mode);
  if (base.type !== "checkbox") return normalizeCheckboxSelection(mode, { checked: { [optionName]: checked } });
  const nextChecked = { ...base.checked, [optionName]: Boolean(checked) };
  return normalizeCheckboxSelection(mode, { checked: nextChecked });
}

export function optionFactor(option: Option, modeSelection: ModeSelection | undefined): number {
  if (!modeSelection) return 0;
  if (modeSelection.type === "radio") return modeSelection.selected === option.name ? 1 : 0;
  if (modeSelection.type === "checkbox") return modeSelection.checked[option.name] ? 1 : 0;
  const percent = Number(modeSelection.values[option.name]) || 0;
  return clampPercent(percent) / 100;
}

