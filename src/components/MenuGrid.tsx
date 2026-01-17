import { Image } from "@tarojs/components";
import { Grid } from "@nutui/nutui-react-taro";

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
  return (
    <Grid columns={columns} gap={0}>
      {items.map((item) => (
        <Grid.Item key={item.name} text={item.name} onClick={() => onItemClick?.(item)}>
          {item.icon ? <Image src={item.icon} style={{ width: 64, height: 64 }} mode="aspectFit" /> : null}
        </Grid.Item>
      ))}
    </Grid>
  );
}

