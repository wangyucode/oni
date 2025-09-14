export type Selection = {
  category: string;
  item: Item;
  count: number;
  modes: Array<Map<string, number>>;
};

export type Resources = { [key: string]: number };

export type Detail = {
  resources: Resources;
  modes: Array<{
    name: string;
    options: Array<{ name: string; resources: Resources }>;
  }>;
  count?: number;
  power?: number;
  heat?: number;
  growth?: number;
};

export type Item = {
  name: string;
  items?: Array<Item>;
  detail?: Detail;
  parent?: Item;
};

export type Data = {
  items: Array<Item>;
};

export type SavedSelection = {
  category: string;
  item: string;
  count: number;
  modes: Array<Record<string, number>>;
};

export interface FoodCalories {
  [name: string]: number;
}

export const sharedMessage = {
  title: "oni产物计算器",
  path: "/pages/index/index",
  imageUrl: "https://wycode.cn/upload/image/oni/oni.png",
};
