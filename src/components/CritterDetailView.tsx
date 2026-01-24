import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";

import { CreatureDetail, DetailLink } from "./data";
import ResourceGrid, { ResourceItem } from "./ResourceGrid";
import { useSelectionsActions } from "./SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "./selection/modeSelection";
import { calculateSelectionTotals } from "./selection/calc";
import SelectionDetailHeader from "./detail/SelectionDetailHeader";
import ModeSelectionEditor from "./detail/ModeSelectionEditor";
import { DataContext } from "./DataContext";
import { getIconData } from "./utils";

export type CritterDetailViewProps = {
  link: DetailLink;
  categoryPath?: string[];
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  onConfirmed?: () => void;
};

export default function CritterDetailView({
  link,
  categoryPath = [],
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
  onConfirmed,
}: CritterDetailViewProps) {
  const critter = link.detail as CreatureDetail;
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 1);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(critter, initialModeSelections);
    return buildDefaultModeSelections(critter);
  });

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setModeSelections(initialModeSelections ? normalizeModeSelections(critter, initialModeSelections) : buildDefaultModeSelections(critter));
      return;
    }
    setCount(1);
    setModeSelections(buildDefaultModeSelections(critter));
  }, [critter, initialCount, initialModeSelections, link.name, mode]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(critter, modeSelections), [critter, modeSelections]);

  const { resources, resourceKinds } = useMemo(() => {
    return calculateSelectionTotals(critter, count, normalizedModeSelections);
  }, [count, critter, normalizedModeSelections]);

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
      item: { name: link.name, icon: link.icon },
      detail: critter,
      count,
      modeSelections,
      categoryPath,
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

      <View className="flex justify-between flex-wrap gap-8">
        {critter.life ? (
          <View className="flex gap-4">
            <Text className="text-sm font-semibold">寿命:</Text>
            <Text className="text-gray-600">{critter.life}</Text>
          </View>
        ) : null}
        {critter.spawn ? (
          <View className="flex gap-4">
            <Text className="text-sm font-semibold">野生产卵周期:</Text>
            <Text className="text-gray-600">{critter.spawn}周期</Text>
          </View>
        ) : null}
        {critter.drop && Object.keys(critter.drop).length > 0 ? (
          <View className="flex gap-4">
            <Text className="text-sm font-semibold">死亡掉落:</Text>
            <Text className="text-gray-600">
              {Object.entries(critter.drop).map(([name, value]) => `${name}-${value}`).join(', ')}
            </Text>
          </View>
        ) : null}
      </View>

      {critter.modes?.length > 0 && (
        <View className="flex flex-col gap-6">
          <Text className="text-sm font-semibold">模式</Text>
          <ModeSelectionEditor detail={critter} modes={critter.modes} modeSelections={modeSelections} onModeSelectionsChange={setModeSelections} />
        </View>
      )}

      <View className="flex flex-col gap-6">
        <Text className="text-sm font-semibold">资源</Text>
        <ResourceGrid items={resourceItems} />
      </View>
    </View>
  );
}
