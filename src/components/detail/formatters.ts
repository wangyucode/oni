import { TimeUnit } from "@/contexts/UnitContext";

export function formatSignedFloor(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const floored = Math.floor(value);
  return floored < 0 ? String(floored) : `+${floored}`;
}

export function convertCalories(calories: number, timeUnit: TimeUnit): { convertedValue: number; unit: string } {
  if (timeUnit === "秒") {
    return { convertedValue: calories / 600, unit: "千卡/秒" };
  }
  return { convertedValue: calories, unit: "千卡/周期" };
}

export function convertHeat(heat: number, timeUnit: TimeUnit): { convertedValue: number; unit: string } {
  const kHeat = heat / 1000;
  if (timeUnit === "周期") {
    return { convertedValue: kHeat * 600, unit: "千复制热/周期" };
  }
  return { convertedValue: kHeat, unit: "千复制热/秒" };
}

