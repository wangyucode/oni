import { BuildingDetail, DupeDetail, LinkDetail } from "../data";

export function isDupeDetail(detail: LinkDetail | undefined): detail is DupeDetail {
  return (
    typeof detail === "object" &&
    detail !== null &&
    "resources" in detail &&
    "modes" in detail &&
    !("heat" in detail) &&
    !("life" in detail)
  );
}

export function isBuildingDetail(detail: LinkDetail | undefined): detail is BuildingDetail {
  return typeof detail === "object" && detail !== null;
}

