import { useContext, useEffect, useMemo, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Collapse } from "@nutui/nutui-react-taro";
import { ArrowDown } from "@nutui/icons-react-taro";

import { DetailLink, DupeDetail } from "@/types/data";
import ResourceGrid, { ResourceItem } from "@/components/ui/ResourceGrid";
import { HUNGER_OPTIONS, useUnit } from "@/contexts/UnitContext";
import { useSelectionsActions } from "@/contexts/SelectionsContext";
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
  const hungerLevelDeltas = useMemo(
    () => HUNGER_OPTIONS.find(o => o.label === hungerLevel) ?? { calorieDelta: 0, powerDelta: 0 },
    [hungerLevel]
  );
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
