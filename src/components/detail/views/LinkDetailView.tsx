import { DetailLink } from "../../../types/data";
import { ModeSelections } from "../../selection/modeSelection";
import BuildingDetailView from "./BuildingDetailView";
import DupeDetailView from "./DupeDetailView";
import CritterDetailView from "./CritterDetailView";
import PlantDetailView from "./PlantDetailView";
import ElementDetailView from "./ElementDetailView";
import GeyserDetailView from "./GeyserDetailView";

export type LinkDetailViewProps = {
  link: DetailLink;
  category?: string;
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  initialEfficiency?: number;
  onConfirmed?: () => void;
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
