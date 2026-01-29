import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Collapse, InputNumber, Range } from "@nutui/nutui-react-taro";
import { ArrowDown } from "@nutui/icons-react-taro";

import { DetailLink, GeyserDetail } from "@/types/data";
import ResourceGrid, { ResourceItem } from "@/components/ui/ResourceGrid";
import { useUnit, transValue } from "@/contexts/UnitContext";
import { createSelectionKey, SelectionsContext, useSelectionsActions } from "@/contexts/SelectionsContext";
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
};

export default function GeyserDetailView({
  link,
  category = "",
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
}: GeyserDetailViewProps) {
  const geyser = link.detail as GeyserDetail;
  const { selections } = useContext(SelectionsContext);
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const { timeUnit } = useUnit();
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 0);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(geyser, initialModeSelections);
    return buildDefaultModeSelections(geyser);
  });
  const editKeyRef = useRef<string>(editKey || "");

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setModeSelections(initialModeSelections ? normalizeModeSelections(geyser, initialModeSelections) : buildDefaultModeSelections(geyser));
      return;
    }
    setCount(0);
    setModeSelections(buildDefaultModeSelections(geyser));
  }, [geyser, initialCount, initialModeSelections, link.name, mode]);

  useEffect(() => {
    if (mode === "edit") {
      if (editKey) editKeyRef.current = editKey;
      return;
    }
    editKeyRef.current = "";
  }, [editKey, mode]);

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
  const resourceCollapseKey = process.env.TARO_ENV === "weapp" ? resourceItems.length.toString() : "resource";

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

  const lastSelectionKey = useMemo(() => {
    const matches = selections.filter((item) => item.name === link.name && item.category === category);
    return matches.length ? matches[matches.length - 1].key : "";
  }, [category, link.name, selections]);

  useEffect(() => {
    const payload = {
      name: link.name,
      detail: geyser,
      count,
      modeSelections,
      category,
    };
    const nextKey = createSelectionKey(link.name, geyser, modeSelections);
    if (mode === "edit") {
      const fromKey = editKeyRef.current || editKey || lastSelectionKey;
      if (fromKey) {
        update(fromKey, payload);
        editKeyRef.current = nextKey;
        return;
      }
    }
    if (count <= 0) {
      if (lastSelectionKey) {
        update(lastSelectionKey, payload);
      }
      return;
    }
    if (lastSelectionKey) {
      update(lastSelectionKey, payload);
      return;
    }
    upsert(payload);
  }, [category, count, editKey, geyser, lastSelectionKey, link.name, mode, modeSelections, upsert, update]);

  return (
    <View className="selection-detail-view">
      <SelectionDetailHeader
        icon={iconData?.icon}
        iconFilter={iconData?.iconFilter}
        name={link.name}
        count={count}
        onCountChange={setCount}
      />
      <Collapse defaultActiveName={["资源"]} expandIcon={<ArrowDown className="text-white" />}>
        <Collapse.Item title="资源" name="资源" key={resourceCollapseKey}>
          <ResourceGrid items={resourceItems} />
        </Collapse.Item>
      </Collapse>

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
      </View>
    </View>
  );
}
