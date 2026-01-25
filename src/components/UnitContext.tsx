import { createContext, useContext, useState, ReactNode } from "react";

export type TimeUnit = '秒' | '周期';
export type HungerLevel = '无胃者' | '节食' | '默认' | '无底胃' | '饥肠辘辘';

export const CYCLE_SECONDS = 600;

export const TIME_UNIT_OPTIONS = [
  { label: '秒', value: '秒' },
  { label: '周期', value: '周期' },
];

export const HUNGER_OPTIONS = [
  { label: '无胃者', value: 0 },
  { label: '节食', value: 0.5 },
  { label: '默认', value: 1 },
  { label: '无底胃', value: 1.5 },
  { label: '饥肠辘辘', value: 2 },
];

interface UnitContextType {
  timeUnit: TimeUnit;
  setTimeUnit: (unit: TimeUnit) => void;
  toggleTimeUnit: () => void;
  hungerLevel: HungerLevel;
  setHungerLevel: (level: HungerLevel) => void;
}

export const UnitContext = createContext<UnitContextType>({
  timeUnit: '周期',
  setTimeUnit: () => {},
  toggleTimeUnit: () => {},
  hungerLevel: '默认',
  setHungerLevel: () => {},
});

export function UnitProvider({ children }: { children: ReactNode }) {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('周期');
  const [hungerLevel, setHungerLevel] = useState<HungerLevel>('默认');

  const toggleTimeUnit = () => {
    setTimeUnit(prev => prev === '秒' ? '周期' : '秒');
  };

  return (
    <UnitContext.Provider value={{ timeUnit, setTimeUnit, toggleTimeUnit, hungerLevel, setHungerLevel }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  return useContext(UnitContext);
}

/**
 * 单位转换函数
 * 基础单位为 g/s
 * @param value 数值
 * @param timeUnit 时间单位
 */
export function transValue(value: number, timeUnit: TimeUnit) {
  let result = value;

  // 时间转换：1周期 = 600s
  if (timeUnit === '周期') {
    result *= CYCLE_SECONDS;
  }

  return result;
}
