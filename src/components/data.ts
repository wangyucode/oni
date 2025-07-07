export type Selection = {
  type: string;
  item: Item;
  count: number;
  modes: Array<{
    name: string;
    option: { name: string; resources: Array<Resource> };
  }>;
};

export type Resource = {
  name: string;
  value: number;
};

export type Detail = {
  resources: Array<Resource>;
  modes: Array<{
    name: string;
    options: Array<{ name: string; resources: Array<Resource> }>;
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
            resources: [
              {
                name: "氧气",
                value: -100,
              },
              {
                name: "二氧化碳",
                value: 2,
              },
            ],
            modes: [
              {
                name: "厕所",
                options: [
                  {
                    name: "抽水马桶",
                    resources: [
                      { name: "水", value: -5000 / 600 },
                      { name: "污染水", value: 11667 / 600 },
                    ],
                  },
                  {
                    name: "户外厕所",
                    resources: [
                      {
                        name: "泥土",
                        value: -13333 / 600,
                      },
                      {
                        name: "污染土",
                        value: 20000 / 600,
                      },
                    ],
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
            resources: [
              { name: "氧气", value: -100 },
              { name: "粘渣油", value: 80000 / 4 / 600 },
            ],
            modes: [
              {
                name: "润滑",
                options: [
                  {
                    name: "原油",
                    resources: [{ name: "原油", value: -20000 / 600 }],
                  },
                  {
                    name: "植物润滑油",
                    resources: [{ name: "植物润滑油", value: -20000 / 600 }],
                  },
                  {
                    name: "齿轮膏",
                    resources: [{ name: "齿轮膏", value: -20000 / 600 }],
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

export const initialSelections: Array<Selection> = [
  {
    type: data.items[0].name,
    item: dupe,
    count: 3,
    modes: dupe.detail!.modes.map((mode) => {
      return { name: mode.name, option: mode.options[0] };
    }),
  },
];
