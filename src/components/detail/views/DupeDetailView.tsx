import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";

import { DetailLink, DupeDetail } from "../../../types/data";
import ResourceGrid, { ResourceItem } from "../../ui/ResourceGrid";
import { HUNGER_OPTIONS, useUnit } from "../../../contexts/UnitContext";
import { useSelectionsActions } from "../../../contexts/SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "../../selection/modeSelection";
import { calculateSelectionTotals } from "../../selection/calc";
import SelectionDetailHeader from "../SelectionDetailHeader";
import ModeSelectionEditor from "../ModeSelectionEditor";
import { convertCalories, formatSignedFloor } from "../formatters";
import { DataContext } from "../../../contexts/DataContext";
import { getIconData } from "../../../utils/utils";

export type DupeDetailViewProps = {
  link: DetailLink;
  category?: string;
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  onConfirmed?: () => void;
};

export default function DupeDetailView({
  link,
  category = "",
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
  onConfirmed,
}: DupeDetailViewProps) {
  const dupe = link.detail as DupeDetail;
  const { timeUnit, hungerLevel } = useUnit();
  const hungerLevelModifier = useMemo(() => HUNGER_OPTIONS.find(o => o.label === hungerLevel)?.value ?? 1, [hungerLevel]);
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(
    mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 1
  );
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(dupe, initialModeSelections);
    return buildDefaultModeSelections(dupe);
  });

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setModeSelections(initialModeSelections ? normalizeModeSelections(dupe, initialModeSelections) : buildDefaultModeSelections(dupe));
      return;
    }
    setCount(1);
    setModeSelections(buildDefaultModeSelections(dupe));
  }, [link.name, dupe, mode, initialCount, initialModeSelections]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(dupe, modeSelections), [dupe, modeSelections]);

  const { resources, resourceKinds, totalPower, totalCalories } = useMemo(() => {
    const isBionic = link.name.includes("仿生人");
    const powerModifier = isBionic ? hungerLevelModifier : 1;
    return calculateSelectionTotals(dupe, count, normalizedModeSelections, 100, hungerLevelModifier, powerModifier);
  }, [count, dupe, normalizedModeSelections, hungerLevelModifier, link.name]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({
      name,
      value,
      count: 1,
      kind: resourceKinds[name] || "mass",
    }));
  }, [resources, resourceKinds]);

  const isDupe = link.name.includes("复制人");
  const isBionic = link.name.includes("仿生人");
  const { convertedValue: convertedCalories, unit: caloriesUnit } = useMemo(
    () => convertCalories(totalCalories, timeUnit),
    [timeUnit, totalCalories]
  );

  function handlePrimaryAction(): void {
    const payload = {
      name: link.name,
      detail: dupe,
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

      {isBionic && dupe.power ? (
        <View className="flex gap-12">
          <Text className="text-sm font-semibold">电力</Text>
          <Text className="text-gray-600">{`${formatSignedFloor(totalPower)} 瓦`}</Text>
        </View>
      ) : null}

      {isDupe && dupe.calorie ? (
        <View className="flex gap-12">
          <Text className="text-sm font-semibold">卡路里</Text>
          <Text className="text-gray-600">{`${formatSignedFloor(convertedCalories)} ${caloriesUnit}`}</Text>
        </View>
      ) : null}

      {dupe.modes?.length > 0 && (
        <View className="flex flex-col gap-6">
          <Text className="text-sm font-semibold">模式</Text>
          <ModeSelectionEditor detail={dupe} modes={dupe.modes} modeSelections={modeSelections} onModeSelectionsChange={setModeSelections} />
        </View>
      )}

      <View className="flex flex-col gap-6">
        <Text className="text-sm font-semibold">资源</Text>
        <ResourceGrid items={resourceItems} />
      </View>
    </View>
  );
}
