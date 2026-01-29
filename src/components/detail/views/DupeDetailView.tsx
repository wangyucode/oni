import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Collapse } from "@nutui/nutui-react-taro";
import { ArrowDown } from "@nutui/icons-react-taro";

import { DetailLink, DupeDetail } from "@/types/data";
import ResourceGrid, { ResourceItem } from "@/components/ui/ResourceGrid";
import { HUNGER_OPTIONS, useUnit } from "@/contexts/UnitContext";
import { createSelectionKey, SelectionsContext, useSelectionsActions } from "@/contexts/SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "@/components/selection/modeSelection";
import { calculateSelectionTotals } from "@/components/selection/calc";
import SelectionDetailHeader from "@/components/detail/SelectionDetailHeader";
import ModeSelectionEditor from "@/components/detail/ModeSelectionEditor";
import { convertCalories, formatSignedFloor } from "@/components/detail/formatters";
import { DataContext } from "@/contexts/DataContext";
import { getIconData } from "@/utils/utils";

export type DupeDetailViewProps = {
  link: DetailLink;
  category?: string;
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
};

export default function DupeDetailView({
  link,
  category = "",
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
}: DupeDetailViewProps) {
  const dupe = link.detail as DupeDetail;
  const { timeUnit, hungerLevel } = useUnit();
  const hungerLevelDeltas = useMemo(
    () => HUNGER_OPTIONS.find(o => o.label === hungerLevel) ?? { calorieDelta: 0, powerDelta: 0 },
    [hungerLevel]
  );
  const { selections } = useContext(SelectionsContext);
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(
    mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 0
  );
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(dupe, initialModeSelections);
    return buildDefaultModeSelections(dupe);
  });
  const editKeyRef = useRef<string>(editKey || "");

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setModeSelections(initialModeSelections ? normalizeModeSelections(dupe, initialModeSelections) : buildDefaultModeSelections(dupe));
      return;
    }
    setCount(0);
    setModeSelections(buildDefaultModeSelections(dupe));
  }, [link.name, dupe, mode, initialCount, initialModeSelections]);

  useEffect(() => {
    if (mode === "edit") {
      if (editKey) editKeyRef.current = editKey;
      return;
    }
    editKeyRef.current = "";
  }, [editKey, mode]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(dupe, modeSelections), [dupe, modeSelections]);

  const { resources, resourceKinds, totalPower, totalCalories } = useMemo(() => {
    const isDupe = link.name.includes("复制人");
    const isBionic = link.name.includes("仿生人");
    const trait = normalizedModeSelections["特质"];
    const isBottomlessStomach = isDupe && trait === "无底洞之胃";
    const calorieDelta = isDupe ? hungerLevelDeltas.calorieDelta + (isBottomlessStomach ? -500 : 0) : 0;
    const powerDelta = isBionic ? hungerLevelDeltas.powerDelta : 0;
    return calculateSelectionTotals(dupe, count, normalizedModeSelections, 100, calorieDelta, powerDelta);
  }, [count, dupe, normalizedModeSelections, hungerLevelDeltas, link.name]);

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

  const lastSelectionKey = useMemo(() => {
    const matches = selections.filter((item) => item.name === link.name && item.category === category);
    return matches.length ? matches[matches.length - 1].key : "";
  }, [category, link.name, selections]);

  useEffect(() => {
    const payload = {
      name: link.name,
      detail: dupe,
      count,
      modeSelections,
      category,
    };
    const nextKey = createSelectionKey(link.name, dupe, modeSelections);
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
  }, [category, count, dupe, editKey, lastSelectionKey, link.name, mode, modeSelections, upsert, update]);

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
        <Collapse.Item title="资源" name="资源">
          <ResourceGrid items={resourceItems} />
        </Collapse.Item>
      </Collapse>

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
    </View>
  );
}
