import { Grid } from "@nutui/nutui-react-taro";

import FilteredImage from "./FilteredImage";
import { useContext } from "react";
import { DataContext } from "../../contexts/DataContext";
import { getIconData } from "../../utils/utils";


export type MenuGridItem = {
  name: string;
  icon?: string;
};

export type MenuGridProps<TItem extends MenuGridItem = MenuGridItem> = {
  columns?: number;
  items: TItem[];
  onItemClick?: (item: TItem) => void;
};

export default function MenuGrid<TItem extends MenuGridItem = MenuGridItem>({
  columns = 3,
  items,
  onItemClick,
}: MenuGridProps<TItem>) {
  const { iconMap } = useContext(DataContext);

  return (
    <Grid columns={columns} gap={0}>
      {items.map((item) => (
        <Grid.Item key={item.name} text={item.name} onClick={() => onItemClick?.(item)}>
          {(() => {
            const iconData = getIconData(iconMap, item.name, item.icon);
            if (!iconData?.icon) return null;
            return (
              <FilteredImage
                src={iconData.icon}
                iconFilter={iconData.iconFilter}
                className="menu-grid-icon"
                mode="aspectFit"
              />
            );
          })()}
        </Grid.Item>
      ))}
    </Grid>
  );
}
