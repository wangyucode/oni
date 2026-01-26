import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import {InputNumber, Range} from "@nutui/nutui-react-taro";

import { BuildingDetail, DetailLink } from "@/types/data";
import ResourceGrid, { ResourceItem } from "@/components/ui/ResourceGrid";
import { useUnit } from "@/contexts/UnitContext";
import { useSelectionsActions } from "@/contexts/SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "@/components/selection/modeSelection";
import { calculateSelectionTotals } from "@/components/selection/calc";
import SelectionDetailHeader from "@/components/detail/SelectionDetailHeader";
import ModeSelectionEditor from "@/components/detail/ModeSelectionEditor";
import { convertHeat, formatSignedFloor } from "@/components/detail/formatters";
import { DataContext } from "@/contexts/DataContext";
import { getIconData } from "@/utils/utils";

export type BuildingDetailViewProps = {
  link: DetailLink;
  category?: string;
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  initialEfficiency?: number;
  onConfirmed?: () => void;
};

export default function BuildingDetailView({
  link,
  category = "",
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
  initialEfficiency,
  onConfirmed,
}: BuildingDetailViewProps) {
  const building = link.detail as BuildingDetail;
  const { timeUnit } = useUnit();
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 1);
  const [efficiency, setEfficiency] = useState<number>(mode === "edit" ? (initialEfficiency ?? 100) : 100);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(building, initialModeSelections);
    return buildDefaultModeSelections(building);
  });

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setEfficiency(initialEfficiency ?? 100);
      setModeSelections(initialModeSelections ? normalizeModeSelections(building, initialModeSelections) : buildDefaultModeSelections(building));
      return;
    }
    setCount(1);
    setEfficiency(100);
    setModeSelections(buildDefaultModeSelections(building));
  }, [building, initialCount, initialEfficiency, initialModeSelections, link.name, mode]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(building, modeSelections), [building, modeSelections]);

  const { resources, resourceKinds, totalPower, totalHeat } = useMemo(() => {
    return calculateSelectionTotals(building, count, normalizedModeSelections, efficiency, 1, 1);
  }, [building, count, normalizedModeSelections, efficiency]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({ name, value, count: 1, kind: resourceKinds[name] || "mass" }));
  }, [resources, resourceKinds]);

  const { convertedValue: convertedHeat, unit: heatUnit } = useMemo(() => convertHeat(totalHeat, timeUnit), [timeUnit, totalHeat]);

  function handlePrimaryAction(): void {
    const payload = {
      name: link.name,
      detail: building,
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
      <View className="flex justify-between">
        <View className="flex gap-12">
          <Text className="text-sm font-semibold">电力</Text>
          <Text className="text-gray-600">{`${formatSignedFloor(totalPower)} 瓦`}</Text>
        </View>
        <View className="flex gap-12">
          <Text className="text-sm font-semibold">热量</Text>
          <Text className="text-gray-600">{`${formatSignedFloor(convertedHeat)} ${heatUnit}`}</Text>
        </View>
      </View>

      {building.modes && building.modes.length > 0 && (
        <View className="flex flex-col gap-6">
          <Text className="text-sm font-semibold">模式</Text>
          <ModeSelectionEditor detail={building} modes={building.modes} modeSelections={modeSelections} onModeSelectionsChange={setModeSelections} />
        </View>
      )}

      <View className="flex flex-col gap-6">
        <Text className="text-sm font-semibold">资源</Text>
        <ResourceGrid items={resourceItems} />
      </View>
    </View>
  );
}
