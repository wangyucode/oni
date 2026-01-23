import { DetailLink } from "./data";
import { ModeSelections } from "./selection/modeSelection";
import BuildingDetailView from "./BuildingDetailView";
import DupeDetailView from "./DupeDetailView";
import LifeDetailView from "./LifeDetailView";
import ElementDetailView from "./ElementDetailView";

export type LinkDetailViewProps = {
  link: DetailLink;
  categoryPath?: string[];
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  initialEfficiency?: number;
  onConfirmed?: () => void;
};

export default function LinkDetailView(props: LinkDetailViewProps) {
  const category = props.categoryPath?.[0];
  if (category === "复制人") return <DupeDetailView {...props} />;
  if (category === "建筑") return <BuildingDetailView {...props} />;
  if (category === "小动物" || category === "动物") return <LifeDetailView {...props} />;
  if (category === "植物") return <LifeDetailView {...props} />;
  if (category === "元素") return <ElementDetailView {...props} />;
  return null;
}
