import { Grid } from "@nutui/nutui-react-taro";

import './MenuGrid.scss';
import FilteredImage from "./FilteredImage";


export type MenuGridItem = {
  name: string;
  icon?: string;
  iconFilter?: string;
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
  return (
    <Grid columns={columns} gap={0}>
      {items.map((item) => (
        <Grid.Item key={item.name} text={item.name} onClick={() => onItemClick?.(item)}>
          {item.icon ? <FilteredImage src={item.icon} iconFilter={item.iconFilter} className="menu-grid-icon" mode="aspectFit" /> : null}
        </Grid.Item>
      ))}
    </Grid>
  );
}
