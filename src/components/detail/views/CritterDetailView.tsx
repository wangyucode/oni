import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Collapse } from "@nutui/nutui-react-taro";
import { ArrowDown } from "@nutui/icons-react-taro";

import { CreatureDetail, DetailLink } from "@/types/data";
import ResourceGrid, { ResourceItem } from "@/components/ui/ResourceGrid";
import { createSelectionKey, SelectionsContext, useSelectionsActions } from "@/contexts/SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "@/components/selection/modeSelection";
import { calculateSelectionTotals } from "@/components/selection/calc";
import SelectionDetailHeader from "@/components/detail/SelectionDetailHeader";
import ModeSelectionEditor from "@/components/detail/ModeSelectionEditor";
import { DataContext } from "@/contexts/DataContext";
import { getIconData } from "@/utils/utils";

export type CritterDetailViewProps = {
  link: DetailLink;
  category?: string;
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
};

export default function CritterDetailView({
  link,
  category = "",
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
}: CritterDetailViewProps) {
  const critter = link.detail as CreatureDetail;
  const { selections } = useContext(SelectionsContext);
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 0);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(critter, initialModeSelections);
    return buildDefaultModeSelections(critter);
  });
  const editKeyRef = useRef<string>(editKey || "");

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setModeSelections(initialModeSelections ? normalizeModeSelections(critter, initialModeSelections) : buildDefaultModeSelections(critter));
      return;
    }
    setCount(0);
    setModeSelections(buildDefaultModeSelections(critter));
  }, [critter, initialCount, initialModeSelections, link.name, mode]);

  useEffect(() => {
    if (mode === "edit") {
      if (editKey) editKeyRef.current = editKey;
      return;
    }
    editKeyRef.current = "";
  }, [editKey, mode]);

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
  const resourceCollapseKey = process.env.TARO_ENV === "weapp" ? resourceItems.length.toString() : "resource";

  const lastSelectionKey = useMemo(() => {
    const matches = selections.filter((item) => item.name === link.name && item.category === category);
    return matches.length ? matches[matches.length - 1].key : "";
  }, [category, link.name, selections]);

  useEffect(() => {
    const payload = {
      name: link.name,
      detail: critter,
      count,
      modeSelections,
      category,
    };
    const nextKey = createSelectionKey(link.name, critter, modeSelections);
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
  }, [category, count, critter, editKey, lastSelectionKey, link.name, mode, modeSelections, upsert, update]);

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
    </View>
  );
}
