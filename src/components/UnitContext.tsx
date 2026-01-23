import { createContext, useContext, useState, ReactNode } from "react";

export type TimeUnit = '秒' | '周期';

interface UnitContextType {
  timeUnit: TimeUnit;
  toggleTimeUnit: () => void;
}

export const UnitContext = createContext<UnitContextType>({
  timeUnit: '周期',
  toggleTimeUnit: () => {},
});

export function UnitProvider({ children }: { children: ReactNode }) {
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('周期');

  const toggleTimeUnit = () => {
    setTimeUnit(prev => prev === '秒' ? '周期' : '秒');
  };

  return (
    <UnitContext.Provider value={{ timeUnit, toggleTimeUnit }}>
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
    result *= 600;
  }

  return result;
}
