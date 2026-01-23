import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";

import { CreatureDetail, DetailLink, LinkDetail, PlantDetail } from "./data";
import ResourceGrid, { ResourceItem } from "./ResourceGrid";
import { useSelectionsActions } from "./SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "./selection/modeSelection";
import { calculateSelectionTotals } from "./selection/calc";
import SelectionDetailHeader from "./detail/SelectionDetailHeader";
import ModeSelectionEditor from "./detail/ModeSelectionEditor";
import { DataContext } from "./DataContext";
import { getIconData } from "./utils";

export type LifeDetailViewProps = {
  link: DetailLink;
  categoryPath?: string[];
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  onConfirmed?: () => void;
};

function isLifeDetail(detail: LinkDetail | undefined): detail is CreatureDetail | PlantDetail {
  return (
    typeof detail === "object" &&
    detail !== null &&
    "life" in detail &&
    "resources" in detail &&
    "modes" in detail
  );
}

export default function LifeDetailView({
  link,
  categoryPath = [],
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
  onConfirmed,
}: LifeDetailViewProps) {
  if (!isLifeDetail(link.detail)) return null;
  const detail = link.detail;
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 1);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(detail, initialModeSelections);
    return buildDefaultModeSelections(detail);
  });

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setModeSelections(initialModeSelections ? normalizeModeSelections(detail, initialModeSelections) : buildDefaultModeSelections(detail));
      return;
    }
    setCount(1);
    setModeSelections(buildDefaultModeSelections(detail));
  }, [detail, initialCount, initialModeSelections, link.name, mode]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(detail, modeSelections), [detail, modeSelections]);

  const { resources, resourceKinds } = useMemo(() => {
    return calculateSelectionTotals(detail, count, normalizedModeSelections);
  }, [count, detail, normalizedModeSelections]);

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
      detail,
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

      {detail.life ? (
        <View className="flex flex-col gap-6">
          <Text className="text-sm font-semibold">寿命</Text>
          <View className="flex flex-col gap-6">
            <View className="flex items-start justify-between gap-12">
              <Text className="text-gray max-w-55 break-all flex-none">寿命</Text>
              <Text className="text-gray-600 flex-1 text-right break-all">{detail.life}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {detail.modes?.length > 0 && (
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
