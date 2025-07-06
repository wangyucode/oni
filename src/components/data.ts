import { IconName } from "./icons";

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
  icon: IconName;
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
      icon: "",
      items: [
        {
          name: "复制人",
          icon: "dupe",
          items: [],
          detail: {
            resources: [
              {
                name: "氧气",
                value: -0.1,
              },
              {
                name: "二氧化碳",
                value: 0.002,
              },
            ],
            modes: [
              {
                name: "厕所",
                options: [
                  {
                    name: "抽水马桶",
                    resources: [
                      { name: "水", value: -5 / 600 },
                      { name: "污染水", value: 11.7 / 600 },
                    ],
                  },
                  {
                    name: "户外厕所",
                    resources: [
                      {
                        name: "泥土",
                        value: -13 / 600,
                      },
                      {
                        name: "污染土",
                        value: 19.7 / 600,
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
          icon: "bionic",
          items: [],
          detail: {
            resources: [
              { name: "氧气", value: -0.1 },
              { name: "粘渣油", value: 80 / 4 / 600 },
            ],
            modes: [
              {
                name: "润滑",
                options: [
                  {
                    name: "原油",
                    resources: [{ name: "原油", value: -20 / 600 }],
                  },
                  {
                    name: "植物润滑油",
                    resources: [{ name: "植物润滑油", value: -20 / 600 }],
                  },
                  {
                    name: "齿轮膏",
                    resources: [{ name: "齿轮膏", value: -20 / 600 }],
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

export const elementIcons: Array<{ name: string; icon: string }> = [
  { name: "磷矿", icon: "0/0c" },
  { name: "肥料", icon: "f/fe" },
  { name: "碎岩", icon: "2/2a" },
  { name: "化石", icon: "3/3b" },
  { name: "沉积岩", icon: "8/89" },
  { name: "火成岩", icon: "c/c2" },
  { name: "石墨", icon: "4/48" },
  { name: "砂岩", icon: "2/2a" },
  { name: "花岗岩", icon: "b/bc" },
  { name: "镁铁质岩", icon: "7/78" },
  { name: "陶瓷", icon: "4/45" },
  { name: "页岩", icon: "e/ef" },
  { name: "黑曜石", icon: "0/00" },
  { name: "咸乳蜡", icon: "c/c1" },
  { name: "固态甲烷", icon: "1/11" },
  { name: "泥炭", icon: "3/34" },
  { name: "煤炭", icon: "c/c1" },
  { name: "盐", icon: "1/1d" },
  { name: "石灰", icon: "b/b2" },
  { name: "精炼碳", icon: "d/d0" },
  { name: "精炼磷", icon: "0/02" },
  { name: "蔗糖", icon: "c/c2" },
  { name: "铁锈", icon: "7/76" },
  { name: "泥土", icon: "3/3b" },
  { name: "粘土", icon: "e/ef" },
  { name: "沙子", icon: "1/12" },
  { name: "浮土", icon: "1/10" },
  { name: "冰", icon: "e/eb" },
  { name: "凝冻咸乳", icon: "4/48" },
  { name: "凝冻植物润滑油", icon: "3/31" },
  { name: "动物油脂", icon: "a/ac" },
  { name: "固态丙烷", icon: "7/76" },
  { name: "固态乙醇", icon: "8/8f" },
  { name: "固态二氧化碳", icon: "2/2d" },
  { name: "固态原油", icon: "a/af" },
  { name: "固态氢", icon: "2/24" },
  { name: "固态氧", icon: "f/f0" },
  { name: "固态氯", icon: "f/f9" },
  { name: "固态石油", icon: "4/4f" },
  { name: "固态石脑油", icon: "1/14" },
  { name: "污染冰", icon: "f/fe" },
  { name: "浓盐冰", icon: "e/e6" },
  { name: "碎冰", icon: "4/47" },
  { name: "紧压雪", icon: "c/c4" },
  { name: "雪", icon: "c/c4" },
  { name: "固态粘性凝胶", icon: "e/e8" },
  { name: "固态超级冷却剂", icon: "6/6f" },
  { name: "塑料", icon: "8/83" },
  { name: "塑料质", icon: "f/f0" },
  { name: "导热质", icon: "7/76" },
  { name: "浓缩铀", icon: "0/04" },
  { name: "玻璃", icon: "0/04" },
  { name: "钢", icon: "8/86" },
  { name: "隔热质", icon: "7/78" },
  { name: "朱砂矿", icon: "a/a8" },
  { name: "金汞齐", icon: "1/1a" },
  { name: "钴矿", icon: "c/c8" },
  { name: "铀矿", icon: "9/96" },
  { name: "铁矿", icon: "5/57" },
  { name: "铜矿", icon: "f/f8" },
  { name: "铝矿", icon: "a/a0" },
  { name: "镍矿", icon: "7/72" },
  { name: "黄铁矿", icon: "3/35" },
  { name: "黑钨矿", icon: "9/98" },
  { name: "固态树液", icon: "8/86" },
  { name: "固态树脂", icon: "5/54" },
  { name: "固态粘渣油", icon: "2/24" },
  { name: "木材", icon: "8/84" },
  { name: "污染土", icon: "0/02" },
  { name: "污染泥", icon: "a/ac" },
  { name: "泥巴", icon: "3/3c" },
  { name: "琥珀", icon: "e/ea" },
  { name: "菌泥", icon: "0/0e" },
  { name: "藻类", icon: "f/f9" },
  { name: "固态核废料", icon: "7/79" },
  { name: "堆芯熔融物", icon: "5/5c" },
  { name: "深渊晶石", icon: "e/eb" },
  { name: "硫", icon: "5/5a" },
  { name: "钻石", icon: "8/8a" },
  { name: "富勒烯", icon: "3/37" },
  { name: "异构树液", icon: "8/8b" },
  { name: "铌", icon: "9/94" },
  { name: "固态汞", icon: "c/cf" },
  { name: "贫铀", icon: "1/15" },
  { name: "金", icon: "a/a6" },
  { name: "钨", icon: "5/5c" },
  { name: "钴", icon: "5/50" },
  { name: "铁", icon: "b/b8" },
  { name: "铅", icon: "7/7a" },
  { name: "铜", icon: "4/43" },
  { name: "铝", icon: "f/f4" },
  { name: "铱", icon: "6/6c" },
  { name: "镍", icon: "0/0b" },
  { name: "中子质", icon: "d/df" },
  { name: "氧石", icon: "c/ca" },
  { name: "漂白石", icon: "f/f1" },
  { name: "沥青", icon: "1/15" },
  { name: "遗传生物软泥", icon: "e/ee" },
  { name: "镭", icon: "7/72" },
  { name: "乙醇", icon: "d/d8" },
  { name: "原油", icon: "d/db" },
  { name: "咸乳", icon: "7/7d" },
  { name: "岩浆", icon: "3/38" },
  { name: "树液", icon: "8/8c" },
  { name: "树脂", icon: "9/97" },
  { name: "植物润滑油", icon: "6/66" },
  { name: "水", icon: "a/a9" },
  { name: "汞", icon: "e/e4" },
  { name: "污染水", icon: "c/cd" },
  { name: "浓盐水", icon: "d/d9" },
  { name: "液态丙烷", icon: "2/26" },
  { name: "液态二氧化碳", icon: "5/51" },
  { name: "液态核废料", icon: "0/0e" },
  { name: "液态氢", icon: "f/f4" },
  { name: "液态氧", icon: "8/8c" },
  { name: "液态氯", icon: "3/3e" },
  { name: "液态甲烷", icon: "d/d5" },
  { name: "液态石脑油", icon: "8/81" },
  { name: "液态硫", icon: "8/83" },
  { name: "液态磷", icon: "e/ed" },
  { name: "熔融玻璃", icon: "6/63" },
  { name: "熔融盐", icon: "d/df" },
  { name: "熔融碳", icon: "6/64" },
  { name: "熔融蔗糖", icon: "d/d4" },
  { name: "熔融金", icon: "8/8a" },
  { name: "熔融钢", icon: "1/1a" },
  { name: "熔融钨", icon: "4/4a" },
  { name: "熔融钴", icon: "c/c8" },
  { name: "熔融铀", icon: "e/e0" },
  { name: "熔融铁", icon: "e/ef" },
  { name: "熔融铅", icon: "1/15" },
  { name: "熔融铌", icon: "5/50" },
  { name: "熔融铜", icon: "5/59" },
  { name: "熔融铝", icon: "f/f9" },
  { name: "熔融铱", icon: "a/a7" },
  { name: "熔融镍", icon: "a/a9" },
  { name: "生物柴油", icon: "3/32" },
  { name: "盐水", icon: "d/d7" },
  { name: "石油", icon: "b/b1" },
  { name: "粘性凝胶流体", icon: "d/df" },
  { name: "粘渣油", icon: "4/4a" },
  { name: "花蜜", icon: "1/1d" },
  { name: "超级冷却剂", icon: "d/d3" },
  { name: "氧气", icon: "f/f9" },
  { name: "污染氧", icon: "c/ce" },
  { name: "二氧化碳", icon: "e/e9" },
  { name: "天然气", icon: "a/ac" },
  { name: "核尘埃", icon: "a/a2" },
  { name: "气态乙醇", icon: "e/e5" },
  { name: "气态岩", icon: "5/5f" },
  { name: "气态盐", icon: "8/80" },
  { name: "气态碳", icon: "a/a2" },
  { name: "气态磷", icon: "1/1e" },
  { name: "气态超级冷却剂", icon: "8/8e" },
  { name: "气态金", icon: "3/38" },
  { name: "气态钢", icon: "c/c3" },
  { name: "气态钨", icon: "4/45" },
  { name: "气态钴", icon: "2/21" },
  { name: "气态铁", icon: "c/cd" },
  { name: "气态铅", icon: "7/76" },
  { name: "气态铌", icon: "8/81" },
  { name: "气态铜", icon: "b/bd" },
  { name: "气态铝", icon: "b/b3" },
  { name: "气态铱", icon: "3/33" },
  { name: "气态镍", icon: "7/72" },
  { name: "氢气", icon: "0/09" },
  { name: "氯气", icon: "c/cc" },
  { name: "汞蒸气", icon: "d/dc" },
  { name: "硫蒸气", icon: "0/0c" },
  { name: "蒸汽", icon: "b/b4" },
  { name: "高硫天然气", icon: "c/cb" },
  { name: "真空", icon: "5/5f" },
  { name: "虚空", icon: "9/99" },
  { name: "齿轮膏", icon: "2/2c" },
];
