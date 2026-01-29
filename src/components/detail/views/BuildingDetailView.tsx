import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Collapse, InputNumber, Range } from "@nutui/nutui-react-taro";
import { ArrowDown } from "@nutui/icons-react-taro";

import { BuildingDetail, DetailLink } from "@/types/data";
import ResourceGrid, { ResourceItem } from "@/components/ui/ResourceGrid";
import { useUnit } from "@/contexts/UnitContext";
import { createSelectionKey, SelectionsContext, useSelectionsActions } from "@/contexts/SelectionsContext";
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
};

export default function BuildingDetailView({
  link,
  category = "",
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
  initialEfficiency,
}: BuildingDetailViewProps) {
  const building = link.detail as BuildingDetail;
  const { timeUnit } = useUnit();
  const { selections } = useContext(SelectionsContext);
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 0);
  const [efficiency, setEfficiency] = useState<number>(mode === "edit" ? (initialEfficiency ?? 100) : 100);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(building, initialModeSelections);
    return buildDefaultModeSelections(building);
  });
  const editKeyRef = useRef<string>(editKey || "");

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setEfficiency(initialEfficiency ?? 100);
      setModeSelections(initialModeSelections ? normalizeModeSelections(building, initialModeSelections) : buildDefaultModeSelections(building));
      return;
    }
    setCount(0);
    setEfficiency(100);
    setModeSelections(buildDefaultModeSelections(building));
  }, [building, initialCount, initialEfficiency, initialModeSelections, link.name, mode]);

  useEffect(() => {
    if (mode === "edit") {
      if (editKey) editKeyRef.current = editKey;
      return;
    }
    editKeyRef.current = "";
  }, [editKey, mode]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(building, modeSelections), [building, modeSelections]);

  const { resources, resourceKinds, totalPower, totalHeat } = useMemo(() => {
    return calculateSelectionTotals(building, count, normalizedModeSelections, efficiency);
  }, [building, count, normalizedModeSelections, efficiency]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({ name, value, count: 1, kind: resourceKinds[name] || "mass" }));
  }, [resources, resourceKinds]);

  const { convertedValue: convertedHeat, unit: heatUnit } = useMemo(() => convertHeat(totalHeat, timeUnit), [timeUnit, totalHeat]);
  const resourceCollapseKey = process.env.TARO_ENV === "weapp" ? resourceItems.length.toString() : "resource";

  const lastSelectionKey = useMemo(() => {
    const matches = selections.filter((item) => item.name === link.name && item.category === category);
    return matches.length ? matches[matches.length - 1].key : "";
  }, [category, link.name, selections]);

  useEffect(() => {
    const payload = {
      name: link.name,
      detail: building,
      count,
      modeSelections,
      category,
      efficiency,
    };
    const nextKey = createSelectionKey(link.name, building, modeSelections);
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
  }, [building, category, count, editKey, efficiency, lastSelectionKey, link.name, mode, modeSelections, upsert, update]);

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
    </View>
  );
}
