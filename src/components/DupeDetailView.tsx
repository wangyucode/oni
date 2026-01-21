import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";

import "./SelectionDetailView.scss";
import { DetailLink, Link } from "./data";
import ResourceGrid, { ResourceItem } from "./ResourceGrid";
import { useUnit } from "./UnitContext";
import { useSelectionsActions } from "./SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "./selection/modeSelection";
import { calculateSelectionTotals } from "./selection/calc";
import SelectionDetailHeader from "./detail/SelectionDetailHeader";
import ModeSelectionEditor from "./detail/ModeSelectionEditor";
import { convertCalories, formatSignedFloor } from "./detail/formatters";
import { isDupeDetail } from "./detail/typeGuards";
import { DataContext } from "./DataContext";
import { getIconData } from "./utils";

export type DupeDetailViewProps = {
  link: DetailLink;
  categoryPath?: string[];
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  onConfirmed?: () => void;
};

export default function DupeDetailView({
  link,
  categoryPath = [],
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
  onConfirmed,
}: DupeDetailViewProps) {
  if (!isDupeDetail(link.detail)) return null;
  const dupe = link.detail;
  const { timeUnit } = useUnit();
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

  const { resources, totalPower, totalCalories } = useMemo(() => {
    return calculateSelectionTotals(dupe, count, normalizedModeSelections);
  }, [count, dupe, normalizedModeSelections]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({
      name,
      value,
      count: 1
    }));
  }, [resources]);

  const isDupe = link.name.includes("复制人");
  const isBionic = link.name.includes("仿生人");
  const { convertedValue: convertedCalories, unit: caloriesUnit } = useMemo(
    () => convertCalories(totalCalories, timeUnit),
    [timeUnit, totalCalories]
  );

  function handlePrimaryAction(): void {
    const payload = {
      item: { name: link.name, icon: link.icon },
      detail: dupe,
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

      {isBionic && dupe.power ? (
        <View className="selection-detail-view__section">
          <Text className="selection-detail-view__sectionTitle">电力</Text>
          <View className="selection-detail-view__kvList">
            <View className="selection-detail-view__kv">
              <Text className="selection-detail-view__k">功率</Text>
              <Text className="selection-detail-view__v">{`${formatSignedFloor(totalPower)} W`}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {isDupe && dupe.calorie ? (
        <View className="selection-detail-view__section">
          <Text className="selection-detail-view__sectionTitle">卡路里</Text>
          <View className="selection-detail-view__kvList">
            <View className="selection-detail-view__kv">
              <Text className="selection-detail-view__k">合计</Text>
              <Text className="selection-detail-view__v">{`${formatSignedFloor(convertedCalories)} ${caloriesUnit}`}</Text>
            </View>
          </View>
        </View>
      ) : null}

      <View className="selection-detail-view__section">
        <Text className="selection-detail-view__sectionTitle">模式</Text>
        <ModeSelectionEditor detail={dupe} modes={dupe.modes} modeSelections={modeSelections} onModeSelectionsChange={setModeSelections} />
      </View>

      <View className="selection-detail-view__section">
        <Text className="selection-detail-view__sectionTitle">资源</Text>
        <ResourceGrid items={resourceItems} />
      </View>
    </View>
  );
}
