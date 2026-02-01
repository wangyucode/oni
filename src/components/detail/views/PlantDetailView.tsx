import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Collapse } from "@nutui/nutui-react-taro";
import { ArrowDown } from "@nutui/icons-react-taro";

import { DetailLink, PlantDetail } from "@/types/data";
import ResourceGrid, { ResourceItem } from "@/components/ui/ResourceGrid";
import { createSelectionKey, SelectionsContext, useSelectionsActions } from "@/contexts/SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections, withPlantGrowthMode } from "@/components/selection/modeSelection";
import { calculateSelectionTotals } from "@/components/selection/calc";
import SelectionDetailHeader from "@/components/detail/SelectionDetailHeader";
import ModeSelectionEditor from "@/components/detail/ModeSelectionEditor";
import { DataContext } from "@/contexts/DataContext";
import { getIconData } from "@/utils/utils";

export type PlantDetailViewProps = {
  link: DetailLink;
  category?: string;
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
};

export default function PlantDetailView({
  link,
  category = "",
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
}: PlantDetailViewProps) {
  const plant = useMemo(() => withPlantGrowthMode(link.detail as PlantDetail, true) as PlantDetail, [link.detail]);
  const { selections } = useContext(SelectionsContext);
  const { upsert, update } = useSelectionsActions();
  const { iconMap, phaseSets } = useContext(DataContext);
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 0);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(plant, initialModeSelections);
    return buildDefaultModeSelections(plant);
  });
  const editKeyRef = useRef<string>(editKey || "");

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setModeSelections(initialModeSelections ? normalizeModeSelections(plant, initialModeSelections) : buildDefaultModeSelections(plant));
      return;
    }
    setCount(0);
    setModeSelections(buildDefaultModeSelections(plant));
  }, [plant, initialCount, initialModeSelections, link.name, mode]);

  useEffect(() => {
    if (mode === "edit") {
      if (editKey) editKeyRef.current = editKey;
      return;
    }
    editKeyRef.current = "";
  }, [editKey, mode]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(plant, modeSelections), [plant, modeSelections]);

  const { resources, resourceKinds } = useMemo(() => {
    return calculateSelectionTotals(plant, count, normalizedModeSelections, 100, 0, 0, { phaseSets, isPlant: true });
  }, [count, phaseSets, plant, normalizedModeSelections]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({
      name,
      value,
      count: 1,
      kind: resourceKinds[name] || "mass",
    }));
  }, [resources, resourceKinds]);
  const resourceCollapseKey = process.env.TARO_ENV === "weapp" ? resourceItems.length.toString() : "resource";

  const lastSelectionKey = useMemo(() => {
    const matches = selections.filter((item) => item.name === link.name && item.category === category);
    return matches.length ? matches[matches.length - 1].key : "";
  }, [category, link.name, selections]);

  useEffect(() => {
    const payload = {
      name: link.name,
      detail: plant,
      count,
      modeSelections,
      category,
    };
    const nextKey = createSelectionKey(link.name, plant, modeSelections);
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
  }, [category, count, editKey, lastSelectionKey, link.name, mode, modeSelections, plant, upsert, update]);

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

      {plant.life ? (
        <View className="flex gap-12">
          <Text className="text-sm font-semibold">生长</Text>
          <Text className="text-gray-600">{plant.life}</Text>
        </View>
      ) : null}

      {plant.modes && plant.modes.length > 0 && (
        <View className="flex flex-col gap-6">
          <Text className="text-sm font-semibold">模式</Text>
          <ModeSelectionEditor detail={plant} modes={plant.modes} modeSelections={modeSelections} onModeSelectionsChange={setModeSelections} />
        </View>
      )}
    </View>
  );
}
