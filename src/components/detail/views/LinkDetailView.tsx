import { DetailLink } from "@/types/data";
import { ModeSelections } from "@/components/selection/modeSelection";
import BuildingDetailView from "@/components/detail/views/BuildingDetailView";
import DupeDetailView from "@/components/detail/views/DupeDetailView";
import CritterDetailView from "@/components/detail/views/CritterDetailView";
import PlantDetailView from "@/components/detail/views/PlantDetailView";
import ElementDetailView from "@/components/detail/views/ElementDetailView";
import GeyserDetailView from "@/components/detail/views/GeyserDetailView";

export type LinkDetailViewProps = {
  link: DetailLink;
  category?: string;
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  initialEfficiency?: number;
};

export default function LinkDetailView(props: LinkDetailViewProps) {
  const category = props.category;
  if (category === "复制人") return <DupeDetailView {...props} />;
  if (category === "建筑") return <BuildingDetailView {...props} />;
  if (category === "小动物") return <CritterDetailView {...props} />;
  if (category === "植物") return <PlantDetailView {...props} />;
  if (category === "元素相变") return <ElementDetailView {...props} />;
  if (category === "间歇泉") return <GeyserDetailView {...props} />;
  return null;
}
