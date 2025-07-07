export type Selection = {
  category: string;
  item: Item;
  count: number;
  modes: Map<string, number>;
};

export type Resources = { [key: string]: number };

export type Detail = {
  resources: Resources;
  modes: Array<{
    name: string;
    options: Array<{ name: string; resources: Resources }>;
  }>;
  count?: number;
};

export type Item = {
  name: string;
  items: Array<Item>;
  detail?: Detail;
  parent?: Item;
};

export type Data = {
  items: Array<Item>;
};

export const data: Data = {
  items: [
    {
      name: "复制人/仿生人",
      items: [
        {
          name: "复制人",
          items: [],
          detail: {
            resources: { 氧气: -100, 二氧化碳: 2 },
            modes: [
              {
                name: "厕所",
                options: [
                  {
                    name: "抽水马桶",
                    resources: { 水: -5000 / 600, 污染水: 11667 / 600 },
                  },
                  {
                    name: "户外厕所",
                    resources: { 泥土: -13333 / 600, 污染土: 20000 / 600 },
                  },
                ],
              },
            ],
          },
        },
        {
          name: "仿生人",
          items: [],
          detail: {
            resources: { 氧气: -100, 粘渣油: 80000 / 4 / 600 },
            modes: [
              {
                name: "润滑",
                options: [
                  {
                    name: "原油",
                    resources: { 原油: -20000 / 600 },
                  },
                  {
                    name: "植物润滑油",
                    resources: { 植物润滑油: -20000 / 600 },
                  },
                  {
                    name: "齿轮膏",
                    resources: { 齿轮膏: -20000 / 600 },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
};

const dupe = data.items[0].items[0];
const category = data.items[0].name;
const modes = new Map<string, number>();
dupe.detail!.modes.forEach((mode) => (modes[mode.name] = 0));

export const initialSelections: Array<Selection> = [
  {
    item: dupe,
    count: 3,
    category,
    modes,
  },
];
