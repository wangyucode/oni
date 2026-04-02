import { useEffect, useMemo, useState } from "react";
import { Button, Input, Text, View } from "@tarojs/components";
import { Minus, Plus } from "@nutui/icons-react-taro";
import CustomRange from "./CustomRange";

export type SliderNumberInputProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (nextValue: number) => void;
  unit?: string;
};

function clampValue(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export default function SliderNumberInput({ value, min, max, step = 1, onChange, unit }: SliderNumberInputProps) {
  const [inputValue, setInputValue] = useState(() => (Number.isFinite(value) ? String(value) : ""));
  const [isEditing, setIsEditing] = useState(false);

  const clampedValue = useMemo(() => clampValue(Number.isFinite(value) ? value : min, min, max), [max, min, value]);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(String(clampedValue));
    }
  }, [clampedValue, isEditing]);

  const emitChange = (next: number) => {
    const normalizedStep = step > 0 ? step : 1;
    const stepped = Math.round(next / normalizedStep) * normalizedStep;
    const clamped = clampValue(stepped, min, max);
    onChange(clamped);
  };

  const handleInputChange = (nextRaw: string) => {
    setInputValue(nextRaw);
    const nextNum = Number(nextRaw);
    if (Number.isFinite(nextNum)) {
      emitChange(nextNum);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    const nextNum = Number(inputValue);
    if (!Number.isFinite(nextNum)) {
      setInputValue(String(clampedValue));
      return;
    }
    const clamped = clampValue(nextNum, min, max);
    setInputValue(String(clamped));
    onChange(clamped);
  };

  return (
    <View className="slider-number-input flex gap-6 items-center">
      <View className="flex-1">
        <CustomRange
          min={min}
          max={max}
          value={clampedValue}
          onChange={(nextValue) => emitChange(Number(nextValue))}
        />
      </View>
      <Button
        className="rounded-6 p-0 bg-gray-100 active-bg-gray-200 w-32 h-32 flex items-center justify-center"
        onClick={() => emitChange(clampedValue - step)}
      >
        <Minus />
      </Button>
      <Input
        type="digit"
        value={inputValue}
        onInput={(event) => handleInputChange(event.detail.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={handleInputBlur}
        className="border border-gray rounded-6 h-32 items-center flex w-64 text-center"
      />
      <Button
        className="rounded-6 p-0 bg-gray-100 active-bg-gray-200 w-32 h-32 flex items-center justify-center"
        onClick={() => emitChange(clampedValue + step)}
      >
        <Plus/>
      </Button>
      {unit ? <Text className="text-gray-600">{unit}</Text> : null}
    </View>
  );
}
