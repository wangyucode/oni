import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import { InputNumber, Range } from "@nutui/nutui-react-taro";

import { DetailLink, TransDetail } from "../../../types/data";
import ResourceGrid, { ResourceItem } from "../../ui/ResourceGrid";
import { useUnit } from "../../../contexts/UnitContext";
import { useSelectionsActions } from "../../../contexts/SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "../../selection/modeSelection";
import { calculateSelectionTotals } from "../../selection/calc";
import SelectionDetailHeader from "../SelectionDetailHeader";
import ModeSelectionEditor from "../ModeSelectionEditor";
import { DataContext } from "../../../contexts/DataContext";
import { getIconData } from "../../../utils/utils";

export type ElementDetailViewProps = {
  link: DetailLink;
  category?: string;
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  initialEfficiency?: number;
  onConfirmed?: () => void;
};

export default function ElementDetailView({
  link,
  category = "",
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
  initialEfficiency,
  onConfirmed,
}: ElementDetailViewProps) {
  const detail = link.detail as TransDetail;
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 1);
  const [efficiency, setEfficiency] = useState<number>(mode === "edit" ? (initialEfficiency ?? 100) : 100);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(detail, initialModeSelections);
    return buildDefaultModeSelections(detail);
  });

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setEfficiency(initialEfficiency ?? 100);
      setModeSelections(initialModeSelections ? normalizeModeSelections(detail, initialModeSelections) : buildDefaultModeSelections(detail));
      return;
    }
    setCount(1);
    setEfficiency(100);
    setModeSelections(buildDefaultModeSelections(detail));
  }, [detail, initialCount, initialEfficiency, initialModeSelections, link.name, mode]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(detail, modeSelections), [detail, modeSelections]);

  const { resources, resourceKinds } = useMemo(() => {
    return calculateSelectionTotals(detail, count, normalizedModeSelections, efficiency);
  }, [count, detail, normalizedModeSelections, efficiency]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({
      name,
      value,
      count: 1,
      kind: resourceKinds[name] || "mass",
    }));
  }, [resources, resourceKinds]);

  function handlePrimaryAction(): void {
    const payload = {
      name: link.name,
      detail,
      count,
      modeSelections,
      category,
      efficiency,
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

      <View className="flex flex-col gap-6">
        <Text className="text-sm font-semibold">效率</Text>
        <View className="flex gap-6 items-center">
          <Range
            min={0}
            max={100}
            step={1}
            value={efficiency}
            onChange={(val) => setEfficiency(Array.isArray(val) ? val[0] : val)}
            maxDescription={null}
            minDescription={null}
            currentDescription={null}
          />
          <InputNumber min={0} max={100} step={1} value={efficiency} onChange={(val) => setEfficiency(Number(val))} />
          <Text className="text-gray-600">%</Text>
        </View>
      </View>

      {detail.modes && detail.modes.length > 0 && (
        <View className="flex flex-col gap-6">
          <Text className="text-sm font-semibold">模式</Text>
          <ModeSelectionEditor detail={detail} modes={detail.modes} modeSelections={modeSelections} onModeSelectionsChange={setModeSelections} />
        </View>
      )}

      <View className="flex flex-col gap-6">
        <Text className="text-sm font-semibold">资源</Text>
        <ResourceGrid items={resourceItems} />
      </View>
    </View>
  );
}
