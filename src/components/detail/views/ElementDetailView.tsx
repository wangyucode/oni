import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "@tarojs/components";
import { Collapse } from "@nutui/nutui-react-taro";
import { ArrowDown } from "@nutui/icons-react-taro";

import { DetailLink, TransDetail } from "@/types/data";
import ResourceGrid, { ResourceItem } from "@/components/ui/ResourceGrid";
import { createSelectionKey, SelectionsContext, useSelectionsActions } from "@/contexts/SelectionsContext";
import { ModeSelections, buildDefaultModeSelections, normalizeModeSelections } from "@/components/selection/modeSelection";
import { calculateSelectionTotals } from "@/components/selection/calc";
import SelectionDetailHeader from "@/components/detail/SelectionDetailHeader";
import ModeSelectionEditor from "@/components/detail/ModeSelectionEditor";
import SliderNumberInput from "@/components/ui/SliderNumberInput";
import { DataContext } from "@/contexts/DataContext";
import { getIconData } from "@/utils/utils";

export type ElementDetailViewProps = {
  link: DetailLink;
  category?: string;
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  initialEfficiency?: number;
};

export default function ElementDetailView({
  link,
  category = "",
  mode = "add",
  editKey,
  initialCount,
  initialModeSelections,
  initialEfficiency,
}: ElementDetailViewProps) {
  const detail = link.detail as TransDetail;
  const { selections } = useContext(SelectionsContext);
  const { upsert, update } = useSelectionsActions();
  const { iconMap } = useContext(DataContext);
  const iconData = getIconData(iconMap, link.name, link.icon);

  const [count, setCount] = useState<number>(mode === "edit" ? Math.max(0, Number(initialCount ?? 1) || 0) : 0);
  const [efficiency, setEfficiency] = useState<number>(mode === "edit" ? (initialEfficiency ?? 100) : 100);
  const [modeSelections, setModeSelections] = useState<ModeSelections>(() => {
    if (mode === "edit" && initialModeSelections) return normalizeModeSelections(detail, initialModeSelections);
    return buildDefaultModeSelections(detail);
  });
  const editKeyRef = useRef<string>(editKey || "");

  useEffect(() => {
    if (mode === "edit") {
      setCount(Math.max(0, Number(initialCount ?? 1) || 0));
      setEfficiency(initialEfficiency ?? 100);
      setModeSelections(initialModeSelections ? normalizeModeSelections(detail, initialModeSelections) : buildDefaultModeSelections(detail));
      return;
    }
    setCount(0);
    setEfficiency(100);
    setModeSelections(buildDefaultModeSelections(detail));
  }, [detail, initialCount, initialEfficiency, initialModeSelections, link.name, mode]);

  useEffect(() => {
    if (mode === "edit") {
      if (editKey) editKeyRef.current = editKey;
      return;
    }
    editKeyRef.current = "";
  }, [editKey, mode]);

  const normalizedModeSelections = useMemo(() => normalizeModeSelections(detail, modeSelections), [detail, modeSelections]);

  const { resources, resourceKinds } = useMemo(() => {
    return calculateSelectionTotals(detail, count, normalizedModeSelections, efficiency);
  }, [count, detail, normalizedModeSelections, efficiency]);

  const resourceItems = useMemo<ResourceItem[]>(() => {
    return Object.entries(resources).map(([name, value]) => ({
      name,
      value,
      count: 1,
      kind: resourceKinds[name] || "mass",
    }));
  }, [resources, resourceKinds]);
  const resourceCollapseKey = process.env.TARO_ENV === "weapp" ? resourceItems.length.toString() : "resource";

  const currentSelectionKey = useMemo(() => {
    const nextKey = createSelectionKey(link.name, detail, modeSelections);
    const match = selections.find((item) => item.key === nextKey && item.category === category);
    return match ? match.key : "";
  }, [category, link.name, modeSelections, detail, selections]);

  useEffect(() => {
    const payload = {
      name: link.name,
      detail,
      count,
      modeSelections,
      category,
      efficiency,
    };

    if (mode === "edit") {
      const fromKey = editKeyRef.current || editKey || currentSelectionKey;
      if (fromKey) {
        update(fromKey, payload);
        editKeyRef.current = createSelectionKey(link.name, detail, modeSelections);
      }
      return;
    }

    if (count > 0) {
      if (currentSelectionKey) {
        update(currentSelectionKey, payload);
      } else {
        upsert(payload);
      }
    }
  }, [category, count, currentSelectionKey, detail, editKey, efficiency, link.name, mode, modeSelections, upsert, update]);

  return (
    <View className='selection-detail-view'>
      <SelectionDetailHeader
        icon={iconData?.icon}
        iconFilter={iconData?.iconFilter}
        name={link.name}
        count={count}
        onCountChange={setCount}
      />
      <Collapse defaultActiveName={["资源"]} expandIcon={<ArrowDown className='text-white' />}>
        <Collapse.Item title='资源' name='资源' key={resourceCollapseKey}>
          <ResourceGrid items={resourceItems} />
        </Collapse.Item>
      </Collapse>

      <View className='flex flex-col gap-6'>
        <Text className='text-sm font-semibold'>效率</Text>
        <SliderNumberInput min={0} max={100} step={1} value={efficiency} onChange={setEfficiency} unit='%' />
      </View>

      {detail.modes && detail.modes.length > 0 && (
        <View className='flex flex-col gap-6'>
          <Text className='text-sm font-semibold'>模式</Text>
          <ModeSelectionEditor detail={detail} modes={detail.modes} modeSelections={modeSelections} onModeSelectionsChange={setModeSelections} />
        </View>
      )}
    </View>
  );
}
