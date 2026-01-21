import { Link } from "./data";
import { ModeSelections } from "./selection/modeSelection";
import BuildingDetailView from "./BuildingDetailView";
import DupeDetailView from "./DupeDetailView";
import { isBuildingDetail, isDupeDetail } from "./detail/typeGuards";

export type LinkDetailViewProps = {
  link: Link;
  categoryPath?: string[];
  mode?: "add" | "edit";
  editKey?: string;
  initialCount?: number;
  initialModeSelections?: ModeSelections;
  onConfirmed?: () => void;
};

export default function LinkDetailView(props: LinkDetailViewProps) {
  const category = props.categoryPath?.[0];
  if (category === '复制人') return <DupeDetailView {...props} />;
  if (category === '建筑') return <BuildingDetailView {...props} />;
  return null;
}

