import { createContext, useContext, useState, ReactNode } from "react";

export type WeightUnit = '克' | '千克';
export type TimeUnit = '秒' | '周期';

interface UnitContextType {
  weightUnit: WeightUnit;
  timeUnit: TimeUnit;
  toggleWeightUnit: () => void;
  toggleTimeUnit: () => void;
}

export const UnitContext = createContext<UnitContextType>({
  weightUnit: '千克',
  timeUnit: '周期',
  toggleWeightUnit: () => {},
  toggleTimeUnit: () => {},
});

export function UnitProvider({ children }: { children: ReactNode }) {
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('千克');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('周期');

  const toggleWeightUnit = () => {
    setWeightUnit(prev => prev === '克' ? '千克' : '克');
  };

  const toggleTimeUnit = () => {
    setTimeUnit(prev => prev === '秒' ? '周期' : '秒');
  };

  return (
    <UnitContext.Provider value={{ weightUnit, timeUnit, toggleWeightUnit, toggleTimeUnit }}>
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
 * @param weightUnit 重量单位
 * @param timeUnit 时间单位
 */
export function transValue(value: number, weightUnit: WeightUnit, timeUnit: TimeUnit) {
  let result = value;
  
  // 时间转换：1周期 = 600s
  if (timeUnit === '周期') {
    result *= 600;
  }

  // 重量转换：1kg = 1000g
  if (weightUnit === '千克') {
    result /= 1000;
  }

  return result;
}