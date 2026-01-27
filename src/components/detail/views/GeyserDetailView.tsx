import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import { InputNumber, Range } from "@nutui/nutui-react-taro";

import { DetailLink, GeyserDetail } from "@/types/data";
import ResourceGrid, { ResourceItem } from "@/components/ui/ResourceGrid";
import { useUnit, transValue } from "@/contexts/UnitContext";
import { useSelectionsActions } from "@/contexts/SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "@/components/selection/modeSelection";
import { calculateSelectionTotals } from "@/components/selection/calc";
import SelectionDetailHeader from "@/components/detail/SelectionDetailHeader";
import { DataContext } from "@/contexts/DataContext";
import { getIconData } from "@/utils/utils";

export type GeyserDetailViewProps = {
  link: DetailLink;
  category?: string;
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  initialEfficiency?: number;
  onConfirmed?: () => void;
};

export default function GeyserDetailView({
  link,
  category = "",
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
  onConfirmed,
}: GeyserDetailViewProps) {
  const geyser = link.detail as GeyserDetail;
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const { timeUnit } = useUnit();
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 1);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(geyser, initialModeSelections);
    return buildDefaultModeSelections(geyser);
  });

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setModeSelections(initialModeSelections ? normalizeModeSelections(geyser, initialModeSelections) : buildDefaultModeSelections(geyser));
      return;
    }
    setCount(1);
    setModeSelections(buildDefaultModeSelections(geyser));
  }, [geyser, initialCount, initialModeSelections, link.name, mode]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(geyser, modeSelections), [geyser, modeSelections]);

  const { minVal, maxVal, unit } = useMemo(() => {
    const entries = Object.entries(geyser.min);
    if (entries.length === 0) return { minVal: 0, maxVal: 0, unit: "" };
    const [name, minRaw] = entries[0];
    const maxRaw = geyser.max[name] || minRaw;

    const minNum = parseFloat(minRaw) || 0;
    const maxNum = parseFloat(maxRaw) || 0;
    const unitStr = minRaw.replace(/^[\d\.]+/, "");

    return { minVal: minNum, maxVal: maxNum, unit: unitStr };
  }, [geyser]);

  const currentValue = useMemo(() => {
    return parseFloat(normalizedModeSelections["平均产量"]) || minVal;
  }, [normalizedModeSelections, minVal]);

  const { resources, resourceKinds } = useMemo(() => {
    return calculateSelectionTotals(geyser, count, normalizedModeSelections);
  }, [geyser, count, normalizedModeSelections]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({
      name,
      value,
      count: 1,
      kind: resourceKinds[name] || "mass",
    }));
  }, [resources, resourceKinds]);

  const averageOutputText = useMemo(() => {
    return Object.entries(resources).map(([name, value]) => {
      const convertedValue = transValue(value, timeUnit);
      const absValue = Math.abs(convertedValue);
      let unitStr = "";
      let formattedValue = 0;
      if (absValue >= 1000) {
        formattedValue = convertedValue / 1000;
        unitStr = `千克/${timeUnit}`;
      } else if (absValue >= 1 || absValue === 0) {
        formattedValue = convertedValue;
        unitStr = `克/${timeUnit}`;
      } else {
        formattedValue = convertedValue * 1000;
        unitStr = `毫克/${timeUnit}`;
      }
      return `${name}: ${formattedValue.toFixed(2)} ${unitStr}`;
    }).join(', ');
  }, [resources, timeUnit]);

  function handlePrimaryAction(): void {
    const payload = {
      name: link.name,
      detail: geyser,
      count,
      modeSelections,
      category,
    };
    if (mode === "edit" && editKey) {
      update(editKey, payload);
      onConfirmed?.();
      return;
    }
    upsert(payload);
    onConfirmed?.();
  }

  return (
    <View className="selection-detail-view">
      <SelectionDetailHeader
        icon={iconData?.icon}
        iconFilter={iconData?.iconFilter}
        name={link.name}
        count={count}
        actionLabel={mode === "edit" ? "确认" : "添加"}
        onCountChange={setCount}
        onAction={handlePrimaryAction}
      />

      <View className="flex flex-col gap-6 mt-12">
        <View className="flex justify-between items-center">
          <Text className="text-sm font-semibold">平均产量</Text>
          <Text className="text-sm text-gray-600">{averageOutputText}</Text>
        </View>
        <View className="flex gap-6 items-center">
          <Range
            min={minVal}
            max={maxVal}
            step={1}
            value={currentValue}
            onChange={(val) => setModeSelections(prev => ({ ...prev, "平均产量": `${Array.isArray(val) ? val[0] : val}${unit}` }))}
            maxDescription={maxVal.toString()}
            minDescription={minVal.toString()}
            currentDescription={null}
          />
          <InputNumber
            min={minVal}
            max={maxVal}
            step={1}
            value={currentValue}
            onChange={(val) => setModeSelections(prev => ({ ...prev, "平均产量": `${val}${unit}` }))}
          />
          <Text className="text-gray-600">{unit}</Text>
        </View>

        <View className="flex flex-col gap-6">
          <Text className="text-sm font-semibold">资源</Text>
          <ResourceGrid items={resourceItems} />
        </View>
      </View>
    </View>
  );
}
