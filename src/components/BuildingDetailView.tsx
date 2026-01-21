import { useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";

import "./SelectionDetailView.scss";
import { BuildingDetail, Link, LinkDetail } from "./data";
import ResourceGrid, { ResourceItem } from "./ResourceGrid";
import { useUnit } from "./UnitContext";
import { useSelectionsActions } from "./SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "./selection/modeSelection";
import { calculateSelectionTotals } from "./selection/calc";
import SelectionDetailHeader from "./detail/SelectionDetailHeader";
import ModeSelectionEditor from "./detail/ModeSelectionEditor";
import { convertHeat, formatSignedFloor } from "./detail/formatters";
import { isBuildingDetail } from "./detail/typeGuards";

export type BuildingDetailViewProps = {
  link: Link;
  categoryPath?: string[];
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  onConfirmed?: () => void;
};

export default function BuildingDetailView({
  link,
  categoryPath = [],
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
  onConfirmed,
}: BuildingDetailViewProps) {
  if (!isBuildingDetail(link.detail)) return null;
  const building = link.detail;
  const { timeUnit } = useUnit();
  const { upsert, update } = useSelectionsActions();

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 1);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(building, initialModeSelections);
    return buildDefaultModeSelections(building);
  });

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setModeSelections(initialModeSelections ? normalizeModeSelections(building, initialModeSelections) : buildDefaultModeSelections(building));
      return;
    }
    setCount(1);
    setModeSelections(buildDefaultModeSelections(building));
  }, [building, initialCount, initialModeSelections, link.name, mode]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(building, modeSelections), [building, modeSelections]);

  const { resources, totalPower, totalHeat } = useMemo(() => {
    return calculateSelectionTotals(building, count, normalizedModeSelections);
  }, [building, count, normalizedModeSelections]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({ name, value, count: 1 }));
  }, [resources]);

  const { convertedValue: convertedHeat, unit: heatUnit } = useMemo(() => convertHeat(totalHeat, timeUnit), [timeUnit, totalHeat]);

  function handlePrimaryAction(): void {
    const payload = {
      item: { name: link.name, icon: link.icon, iconFilter: link.iconFilter },
      detail: building,
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
        icon={link.icon}
        iconFilter={link.iconFilter}
        name={link.name}
        count={count}
        actionLabel={mode === "edit" ? "确认" : "添加"}
        onCountChange={setCount}
        onAction={handlePrimaryAction}
      />

      <View className="selection-detail-view__section">
        <Text className="selection-detail-view__sectionTitle">电力</Text>
        <View className="selection-detail-view__kvList">
          <View className="selection-detail-view__kv">
            <Text className="selection-detail-view__k">功率</Text>
            <Text className="selection-detail-view__v">{`${formatSignedFloor(totalPower)} W`}</Text>
          </View>
        </View>
      </View>

      <View className="selection-detail-view__section">
        <Text className="selection-detail-view__sectionTitle">热量</Text>
        <View className="selection-detail-view__kvList">
          <View className="selection-detail-view__kv">
            <Text className="selection-detail-view__k">合计</Text>
            <Text className="selection-detail-view__v">{`${formatSignedFloor(convertedHeat)} ${heatUnit}`}</Text>
          </View>
        </View>
      </View>

      <View className="selection-detail-view__section">
        <Text className="selection-detail-view__sectionTitle">模式</Text>
        <ModeSelectionEditor detail={building} modes={building.modes} modeSelections={modeSelections} onModeSelectionsChange={setModeSelections} />
      </View>

      <View className="selection-detail-view__section">
        <Text className="selection-detail-view__sectionTitle">资源</Text>
        <ResourceGrid items={resourceItems} />
      </View>
    </View>
  );
}

