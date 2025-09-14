import { createContext, useContext, useState, ReactNode } from "react";

export type UnitType = 'g/s' | 'kg/周期';

interface UnitContextType {
  unitType: UnitType;
  toggleUnitType: () => void;
}

export const UnitContext = createContext<UnitContextType>({
  unitType: 'g/s',
  toggleUnitType: () => {},
});

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unitType, setUnitType] = useState<UnitType>('g/s');

  const toggleUnitType = () => {
    setUnitType(prev => prev === 'g/s' ? 'kg/周期' : 'g/s');
  };

  return (
    <UnitContext.Provider value={{ unitType, toggleUnitType }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  return useContext(UnitContext);
}