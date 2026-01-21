import { DetailLink } from "./data";
import { ModeSelections } from "./selection/modeSelection";
import BuildingDetailView from "./BuildingDetailView";
import DupeDetailView from "./DupeDetailView";

export type LinkDetailViewProps = {
  link: DetailLink;
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

