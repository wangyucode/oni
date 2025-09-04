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

export const plants = [
  "六角根",
  "冰霜小麦",
  "刺壳果灌木",
  "土星动物捕草",
  "夜幕菇",
  "小吃芽",
  "巨蕨",
  "拟芽",
  "掩埋的淤泥根",
  "毛刺花",
  "水草",
  "汗甜玉米秆",
  "沼泽甜菜",
  "沼浆笼",
  "漫殖藤",
  "火椒藤",
  "米虱木",
  "羽叶果薯植株",
  "菌斑根",
  "虫果芽",
  "贫瘠虫果芽",
  "雪莓藤",
  "乔木树",
  "仙水掌",
  "沙盐藤",
  "海梳蕨",
  "糖心树",
  "芳香百合",
  "释气草",
  "露珠藤",
  "露饵花",
  "顶针芦苇",
];

export const data: Data = {
  items: [
    {
      name: "复制人/仿生人",
      items: [
        {
          name: "复制人",
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
          detail: {
            resources: { 氧气: -100, 粘渣油: 80000 / 4 / 600 },
            power: -200,
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
    {
      name: "建筑",
      items: [
        {
          name: "氧气菜单",
          items: [
            {
              name: "氧气扩散器",
              detail: {
                resources: { 藻类: -550, 氧气: 500 },
                modes: [],
                power: -120,
                heat: 1500,
              },
            },
            {
              name: "升华站",
              detail: {
                resources: { 污染土: -1000, 氧气: 660 },
                modes: [],
                power: -60,
                heat: 1000,
              },
            },
            {
              name: "电解器",
              detail: {
                resources: { 水: -1000, 氧气: 888, 氢气: 112 },
                modes: [],
                power: -120,
                heat: 1000,
              },
            },
            {
              name: "碳素脱离器",
              detail: {
                resources: {
                  水: -1000,
                  二氧化碳: -300,
                  污染水: 1000,
                },
                modes: [],
                power: -120,
                heat: 1000,
              },
            },
            {
              name: "空气净化器",
              detail: {
                resources: {
                  污染氧: -100,
                  粘土: 143.33,
                  氧气: 90,
                },
                modes: [
                  {
                    name: "过滤介质",
                    options: [
                      {
                        name: "沙子",
                        resources: { 沙子: -133.33 },
                      },
                      {
                        name: "浮土",
                        resources: { 浮土: -133.33 },
                      },
                    ],
                  },
                ],
                power: -5,
                heat: 625,
              },
            },
            {
              name: "藻类箱",
              detail: {
                resources: {
                  水: -300,
                  藻类: -30,
                  二氧化碳: -1 / 3,
                },
                modes: [
                  {
                    name: "光照条件",
                    options: [
                      {
                        name: "有",
                        resources: { 氧气: 44 },
                      },
                      {
                        name: "无",
                        resources: { 氧气: 40 },
                      },
                    ],
                  },
                ],
                power: 0,
                heat: 0,
              },
            },
            {
              name: "铁锈脱氧机",
              detail: {
                resources: {
                  铁锈: -750,
                  盐: -250,
                  氧气: 570,
                  氯气: 30,
                  铁矿: 400,
                },
                modes: [],
                power: -60,
                heat: 1000,
              },
            },
          ],
        },
        {
          name: "电力",
          items: [
            {
              name: "煤炭发电机",
              detail: {
                resources: { 煤炭: -1000, 二氧化碳: 20 },
                modes: [],
                power: 600,
                heat: 9000,
              },
            },
            {
              name: "木材燃烧器",
              detail: {
                resources: { 木材: -1200, 二氧化碳: 170 },
                modes: [],
                power: 300,
                heat: 9000,
              },
            },
            {
              name: "泥炭燃烧器",
              detail: {
                resources: { 泥炭: -1000, 二氧化碳: 40, 污染水: 200 },
                modes: [],
                power: 480,
                heat: 4500,
              },
            },
            {
              name: "泥炭燃烧器",
              detail: {
                resources: { 泥炭: -1000, 二氧化碳: 40, 污染水: 200 },
                modes: [],
                power: 480,
                heat: 4500,
              },
            },
            {
              name: "氢气发电机",
              detail: {
                resources: { 氢气: -100 },
                modes: [],
                power: 800,
                heat: 4000,
              },
            },
            {
              name: "天然气发电机",
              detail: {
                resources: { 天然气: -90, 污染水: 67.5, 二氧化碳: 22.5 },
                modes: [],
                power: 800,
                heat: 10000,
              },
            },
            {
              name: "石油发电机",
              detail: {
                resources: { 污染水: 750, 二氧化碳: 500 },
                modes: [
                  {
                    name: "可燃液体",
                    options: [
                      {
                        name: "石油",
                        resources: {
                          石油: -2000,
                        },
                      },
                      {
                        name: "乙醇",
                        resources: {
                          乙醇: -2000,
                        },
                      },
                      {
                        name: "生物柴油",
                        resources: {
                          生物柴油: -2000,
                        },
                      },
                    ],
                  },
                ],
                power: 2000,
                heat: 20000,
              },
            },
          ],
        },
        {
          name: "精炼",
          items: [
            {
              name: "钻石压机",
              detail: {
                resources: {
                  精炼碳: -100000 / 80,
                  钻石: 100000 / 80,
                },
                modes: [],
                power: -240,
                heat: 16000,
              },
            },
            {
              name: "氧石精炼炉",
              detail: {
                resources: {
                  氧气: -600,
                  金: -3,
                  氧石: 600,
                },
                modes: [],
                power: -1200,
                heat: 12000,
              },
            },
            {
              name: "乳化器",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "配方",
                    options: [
                      {
                        name: "盐水",
                        resources: {
                          水: -93000 / 40,
                          盐: -7000 / 40,
                          盐水: 100000 / 40,
                        },
                      },
                      {
                        name: "生物柴油",
                        resources: {
                          植物润滑油: -160000 / 40,
                          漂白石: -40000 / 40,
                          生物柴油: 200000 / 40,
                        },
                      },
                      {
                        name: "超级冷却剂",
                        resources: {
                          富勒烯: -1000 / 80,
                          金: -49500 / 80,
                          石油: -49500 / 80,
                          超级冷却剂: 100000 / 80,
                        },
                      },
                      {
                        name: "粘性凝胶流体",
                        resources: {
                          异构树液: -35000 / 80,
                          石油: -65000 / 80,
                          粘性凝胶流体: 100000 / 80,
                        },
                      },
                    ],
                  },
                ],
                power: -480,
                heat: 1000,
              },
            },
            {
              name: "分子熔炉",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "配方",
                    options: [
                      {
                        name: "富勒烯",
                        resources: {
                          石墨: -90000 / 80,
                          硫: -5000 / 80,
                          铝: -5000 / 80,
                          富勒烯: 100000 / 80,
                        },
                      },
                      {
                        name: "塑料质",
                        resources: {
                          导热质: -15000 / 80,
                          塑料: -70000 / 80,
                          咸乳蜡: -15000 / 80,
                          塑料质: 100000 / 80,
                        },
                      },
                      {
                        name: "芦苇纤维->隔热质",
                        resources: {
                          异构树液: -15000 / 80,
                          深渊晶石: -80000 / 80,
                          芦苇纤维: -5000 / 80,
                          隔热质: 100000 / 80,
                        },
                      },
                      {
                        name: "羽毛纤维->隔热质",
                        resources: {
                          异构树液: -15000 / 80,
                          深渊晶石: -80000 / 80,
                          羽毛纤维: -5000 / 80,
                          隔热质: 100000 / 80,
                        },
                      },
                      {
                        name: "导热质",
                        resources: {
                          铌: -5000 / 80,
                          钨: -95000 / 80,
                          导热质: 100000 / 80,
                        },
                      },
                      {
                        name: "原子能移动电源",
                        resources: {
                          浓缩铀: -10000 / 80,
                          原子能移动电源: 1000 / 80,
                        },
                      },
                    ],
                  },
                ],
                power: -1600,
                heat: 16000,
              },
            },
            {
              name: "漂白石料斗",
              detail: {
                resources: {
                  盐: -30000 / 40,
                  金: 500 / 40,
                  漂白石: 10000 / 40,
                  沙子: 20000 / 40,
                },
                modes: [],
                power: -480,
                heat: 3000,
              },
            },
            {
              name: "脱盐器",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "配方",
                    options: [
                      {
                        name: "盐水",
                        resources: {
                          盐水: -5000,
                          水: 4650,
                          盐: 350,
                        },
                      },
                      {
                        name: "浓盐水",
                        resources: {
                          浓盐水: -5000,
                          水: 3500,
                          盐: 1500,
                        },
                      },
                    ],
                  },
                ],
                power: -480,
                heat: 8000,
              },
            },
            {
              name: "玻璃熔炉",
              detail: {
                resources: {
                  沙子: -100000 / 40,
                  熔融玻璃: 25000 / 40,
                },
                modes: [],
                power: -1200,
                heat: 16000,
              },
            },
            {
              name: "金属精炼器",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "配方",
                    options: [
                      {
                        name: "铜",
                        resources: {
                          铜矿: -100000 / 40,
                          铜: 100000 / 40,
                        },
                      },
                      {
                        name: "钴",
                        resources: {
                          钴矿: -100000 / 40,
                          钴: 100000 / 40,
                        },
                      },
                      {
                        name: "钨",
                        resources: {
                          黑钨矿: -100000 / 40,
                          钨: 100000 / 40,
                        },
                      },
                      {
                        name: "金（银金矿）",
                        resources: {
                          银金矿: -100000 / 40,
                          金: 100000 / 40,
                        },
                      },
                      {
                        name: "铝",
                        resources: {
                          铝矿: -100000 / 40,
                          铝: 100000 / 40,
                        },
                      },
                      {
                        name: "金（金汞齐）",
                        resources: {
                          金汞齐: -100000 / 40,
                          金: 100000 / 40,
                        },
                      },
                      {
                        name: "镍",
                        resources: {
                          镍矿: -100000 / 40,
                          镍: 100000 / 40,
                        },
                      },
                      {
                        name: "铌",
                        resources: {
                          导热质: -100000 / 40,
                          铌: 100000 / 40,
                        },
                      },
                      {
                        name: "铁（铁矿）",
                        resources: {
                          铁矿: -100000 / 40,
                          铁: 100000 / 40,
                        },
                      },
                      {
                        name: "汞",
                        resources: {
                          朱砂矿: -100000 / 40,
                          汞: 100000 / 40,
                        },
                      },
                      {
                        name: "铁（黄铁矿）",
                        resources: {
                          黄铁矿: -100000 / 40,
                          铁: 100000 / 40,
                        },
                      },
                      {
                        name: "钢",
                        resources: {
                          铁: -70000 / 40,
                          精炼碳: -20000 / 40,
                          石灰: -10000 / 40,
                          钢: 100000 / 40,
                        },
                      },
                    ],
                  },
                ],
                power: -1200,
                heat: 16000,
              },
            },
            {
              name: "窑炉",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "配方",
                    options: [
                      {
                        name: "陶瓷（煤炭）",
                        resources: {
                          粘土: -100000 / 40,
                          煤炭: -25000 / 40,
                          陶瓷: 100000 / 40,
                        },
                      },
                      {
                        name: "陶瓷（木材）",
                        resources: {
                          粘土: -100000 / 40,
                          木材: -25000 / 40,
                          陶瓷: 100000 / 40,
                        },
                      },
                      {
                        name: "陶瓷（泥炭）",
                        resources: {
                          粘土: -100000 / 40,
                          泥炭: -25000 / 40,
                          陶瓷: 100000 / 40,
                        },
                      },
                      {
                        name: "精炼碳（煤炭）",
                        resources: {
                          煤炭: -125000 / 40,
                          精炼碳: 100000 / 40,
                        },
                      },
                      {
                        name: "精炼碳（木材）",
                        resources: {
                          木材: -200000 / 40,
                          精炼碳: 100000 / 40,
                        },
                      },
                      {
                        name: "精炼碳（泥炭）",
                        resources: {
                          泥炭: -300000 / 40,
                          精炼碳: 100000 / 40,
                        },
                      },
                    ],
                  },
                ],
                power: 0,
                heat: 20000,
              },
            },
            {
              name: "碎石机",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "原料",
                    options: [
                      {
                        name: "页岩",
                        resources: { 页岩: -100000 / 40, 沙子: 100000 / 40 },
                      },
                      {
                        name: "陶瓷",
                        resources: { 陶瓷: -100000 / 40, 沙子: 100000 / 40 },
                      },
                      {
                        name: "黑曜石",
                        resources: { 黑曜石: -100000 / 40, 沙子: 100000 / 40 },
                      },
                      {
                        name: "火成岩",
                        resources: { 火成岩: -100000 / 40, 沙子: 100000 / 40 },
                      },
                      {
                        name: "花岗岩",
                        resources: { 花岗岩: -100000 / 40, 沙子: 100000 / 40 },
                      },
                      {
                        name: "沉积岩",
                        resources: { 沉积岩: -100000 / 40, 沙子: 100000 / 40 },
                      },
                      {
                        name: "砂岩",
                        resources: { 砂岩: -100000 / 40, 沙子: 100000 / 40 },
                      },
                      {
                        name: "隔热质",
                        resources: { 隔热质: -100000 / 40, 沙子: 100000 / 40 },
                      },
                      {
                        name: "铜矿",
                        resources: {
                          铜矿: -100000 / 40,
                          铜: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "钴矿",
                        resources: {
                          钴矿: -100000 / 40,
                          钴: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "黑钨矿",
                        resources: {
                          黑钨矿: -100000 / 40,
                          钨: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "银金矿",
                        resources: {
                          银金矿: -100000 / 40,
                          金: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "铝矿",
                        resources: {
                          铝矿: -100000 / 40,
                          铝: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "金汞齐",
                        resources: {
                          金汞齐: -100000 / 40,
                          金: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "镍矿",
                        resources: {
                          镍矿: -100000 / 40,
                          镍: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "导热质",
                        resources: {
                          导热质: -100000 / 40,
                          铌: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "铁矿",
                        resources: {
                          铁矿: -100000 / 40,
                          铁: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "朱砂矿",
                        resources: {
                          朱砂矿: -100000 / 40,
                          汞: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "黄铁矿",
                        resources: {
                          黄铁矿: -100000 / 40,
                          铁: 50000 / 40,
                          沙子: 50000 / 40,
                        },
                      },
                      {
                        name: "蛋壳",
                        resources: { 蛋壳: -5000 / 40, 石灰: 5000 / 40 },
                      },
                      {
                        name: "蟹壳",
                        resources: { 蟹壳: -10000 / 40, 石灰: 10000 / 40 },
                      },
                      {
                        name: "木蟹壳",
                        resources: { 木蟹壳: -500000 / 40, 木材: 500000 / 40 },
                      },
                      {
                        name: "化石",
                        resources: {
                          化石: -100000 / 40,
                          石灰: 5000 / 40,
                          沉积岩: 95000 / 40,
                        },
                      },
                      {
                        name: "移动电源废料",
                        resources: {
                          移动电源废料: -1000 / 40,
                          深渊晶石: 100000 / 40,
                        },
                      },
                      {
                        name: "盐",
                        resources: {
                          盐: -100000 / 40,
                          食盐: 5000 / 40,
                          沙子: 100000 / 40,
                        },
                      },
                      {
                        name: "富勒烯",
                        resources: {
                          富勒烯: -100000 / 40,
                          石墨: 90000 / 40,
                          沙子: 10000 / 40,
                        },
                      },
                      {
                        name: "绒犸兔碎糜",
                        resources: {
                          绒犸兔碎糜: -120000 / 40,
                          磷矿: 32000 / 40,
                          粘土: 88000 / 40,
                        },
                      },
                      {
                        name: "皇犸兔头冠",
                        resources: {
                          皇犸兔头冠: -1000 / 40,
                          金汞齐: 250000 / 40,
                        },
                      },
                    ],
                  },
                ],
                power: -240,
                heat: 16000,
              },
            },
            {
              name: "净水器",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "过滤介质",
                    options: [
                      {
                        name: "沙子",
                        resources: {
                          沙子: -1000,
                          水: 5000,
                          污染水: -5000,
                          污染土: 200,
                        },
                      },
                      {
                        name: "浮土",
                        resources: {
                          浮土: -1000,
                          水: 5000,
                          污染水: -5000,
                          污染土: 200,
                        },
                      },
                    ],
                  },
                ],
                power: -120,
                heat: 4000,
              },
            },
            {
              name: "原油精炼器",
              detail: {
                resources: {
                  原油: -10000,
                  石油: 5000,
                  天然气: 90,
                },
                modes: [],
                power: -480,
                heat: 10000,
              },
            },
            {
              name: "聚合物压塑器",
              detail: {
                resources: {
                  塑料: 500,
                  蒸汽: 8.33,
                  二氧化碳: 8.33,
                },
                modes: [
                  {
                    name: "塑料单体",
                    options: [
                      {
                        name: "石油",
                        resources: {
                          石油: -833.33,
                        },
                      },
                      {
                        name: "花蜜",
                        resources: {
                          花蜜: -833.33,
                        },
                      },
                      {
                        name: "树脂",
                        resources: {
                          树脂: -833.33,
                        },
                      },
                    ],
                  },
                ],
                power: -240,
                heat: 32000,
              },
            },
            {
              name: "藻类蒸馏器",
              detail: {
                resources: {
                  菌泥: -600,
                  藻类: 200,
                  污染水: 400,
                },
                modes: [],
                power: -120,
                heat: 1000,
              },
            },
            {
              name: "咸乳蜡收集器",
              detail: {
                resources: {
                  咸乳: -1000,
                  咸乳蜡: 90,
                  浓盐水: 810,
                  二氧化碳: 100,
                },
                modes: [],
                power: -480,
                heat: 8000,
              },
            },
            {
              name: "泥浆分离器",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "泥浆",
                    options: [
                      {
                        name: "污染泥",
                        resources: {
                          污染泥: -150000 / 20,
                          污染水: 90000 / 20,
                          污染土: 60000 / 20,
                        },
                      },
                      {
                        name: "泥巴",
                        resources: {
                          泥巴: -150000 / 20,
                          水: 90000 / 20,
                          泥土: 60000 / 20,
                        },
                      },
                    ],
                  },
                ],
                power: -120,
                heat: 4000,
              },
            },
            {
              name: "乙醇蒸馏器",
              detail: {
                resources: {
                  木材: -1000,
                  乙醇: 500,
                  污染土: 333.33,
                  二氧化碳: 166.67,
                },
                modes: [],
                power: -240,
                heat: 4000,
              },
            },
            {
              name: "肥料合成器",
              detail: {
                resources: {
                  污染水: -39,
                  泥土: -65,
                  磷矿: -26,
                  肥料: 120,
                },
                modes: [],
                power: -120,
                heat: 3000,
              },
            },
            {
              name: "植物粉碎机",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "原料",
                    options: [
                      {
                        name: "冰霜麦粒",
                        resources: {
                          冰霜麦粒: -10000 / 40,
                          水: -15000 / 40,
                          咸乳: 20000 / 40,
                        },
                      },
                      {
                        name: "火椒粒",
                        resources: {
                          火椒粒: -3000 / 40,
                          水: -17000 / 40,
                          咸乳: 20000 / 40,
                        },
                      },
                      {
                        name: "小吃豆",
                        resources: {
                          小吃豆: -2000 / 40,
                          水: -18000 / 40,
                          咸乳: 20000 / 40,
                        },
                      },
                      {
                        name: "露珠",
                        resources: {
                          露珠: -2000 / 40,
                          咸乳: 20000 / 40,
                        },
                      },
                      {
                        name: "菌泥",
                        resources: {
                          菌泥: -100000 / 40,
                          植物润滑油: 70000 / 40,
                          泥土: 30000 / 40,
                        },
                      },
                      {
                        name: "海梳蕨叶",
                        resources: {
                          海梳蕨叶: -25000 / 40,
                          水: -75000 / 40,
                          植物润滑油: 100000 / 40,
                        },
                      },
                      {
                        name: "树脂",
                        resources: {
                          琥珀: -100000 / 40,
                          树脂: 50000 / 40,
                          化石: 25000 / 40,
                          沙子: 25000 / 40,
                        },
                      },
                    ],
                  },
                ],
                power: 0,
                heat: 2000,
              },
            },
            {
              name: "堆肥堆",
              detail: {
                resources: {
                  污染土: -100,
                  泥土: 100,
                },
                modes: [],
                power: 0,
                heat: 1000,
              },
            },
          ],
        },
        {
          name: "食物",
          items: [
            {
              name: "电动烤炉",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "食谱",
                    options: [
                      {
                        name: "腌制米虱",
                        resources: { 米虱: -3000 / 30, 腌制米虱: 1000 / 30 },
                      },
                      {
                        name: "煎泥膏",
                        resources: { 软泥膏: -1000 / 50, 煎泥膏: 1000 / 50 },
                      },
                      {
                        name: "煎蘑菇",
                        resources: { 蘑菇: -1000 / 50, 煎蘑菇: 1000 / 50 },
                      },
                      {
                        name: "蛋奶酥煎饼(冰霜麦粒)",
                        resources: {
                          生蛋: -1000 / 50,
                          冰霜麦粒: -2000 / 50,
                          蛋奶酥煎饼: 1000 / 50,
                        },
                      },
                      {
                        name: "蛋奶酥煎饼(巨蕨谷粒)",
                        resources: {
                          生蛋: -1000 / 50,
                          巨蕨谷粒: -2000 / 50,
                          蛋奶酥煎饼: 1000 / 50,
                        },
                      },
                      {
                        name: "烤肉串",
                        resources: { 肉: -2000 / 50, 烤肉串: 1000 / 50 },
                      },
                      {
                        name: "烤海鲜",
                        resources: { 帕库鱼片: -1000 / 50, 烤海鲜: 1000 / 50 },
                      },
                      {
                        name: "烤海鲜",
                        resources: { 生蟹肉: -1000 / 50, 烤海鲜: 1000 / 50 },
                      },
                      {
                        name: "炙烤刺果",
                        resources: {
                          毛刺浆果: -1000 / 50,
                          炙烤刺果: 1000 / 50,
                        },
                      },
                      {
                        name: "沼泽欢愉",
                        resources: {
                          沼浆果冻: -1000 / 50,
                          沼泽欢愉: 1000 / 50,
                        },
                      },
                      {
                        name: "冰霜面包(冰霜麦粒)",
                        resources: {
                          冰霜麦粒: -3000 / 50,
                          冰霜面包: 1000 / 50,
                        },
                      },
                      {
                        name: "冰霜面包(巨蕨谷粒)",
                        resources: {
                          巨蕨谷粒: -3000 / 50,
                          冰霜面包: 1000 / 50,
                        },
                      },
                      {
                        name: "煎蛋卷",
                        resources: { 生蛋: -1000 / 50, 煎蛋卷: 1000 / 50 },
                      },
                      {
                        name: "烤虫果仁",
                        resources: {
                          贫瘠虫果: -1000 / 50,
                          烤虫果仁: 1000 / 50,
                        },
                      },
                      {
                        name: "虫果果酱",
                        resources: {
                          虫果: -8000 / 50,
                          蔗糖: -4000 / 50,
                          虫果果酱: 1000 / 50,
                        },
                      },
                      {
                        name: "刺壳果烤串",
                        resources: {
                          刺壳果: -1000 / 50,
                          刺壳果烤串: 1000 / 50,
                        },
                      },
                      {
                        name: "烘烤拟种",
                        resources: { 拟种: -1000 / 50, 烘烤拟种: 1000 / 50 },
                      },
                    ],
                  },
                ],
                power: 60,
                heat: 4000,
              },
            },
            {
              name: "油炸锅",

              detail: {
                resources: {},
                modes: [
                  {
                    name: "食谱",
                    options: [
                      {
                        name: "果薯条",
                        resources: {
                          羽叶果薯: -1000 / 50,
                          动物油脂: -1000 / 50,
                          果薯条: 1000 / 50,
                        },
                      },
                      {
                        name: "炸豆小吃",
                        resources: {
                          小吃豆: -6000 / 50,
                          动物油脂: -1000 / 50,
                          炸豆小吃: 1000 / 50,
                        },
                      },
                      {
                        name: "鱼肉卷",
                        resources: {
                          帕库鱼片: -1000 / 50,
                          动物油脂: -2400 / 50,
                          冰霜麦粒: -2000 / 50,
                          鱼肉卷: 1000 / 50,
                        },
                      },
                      {
                        name: "鱼肉卷",
                        resources: {
                          帕库鱼片: -1000 / 50,
                          动物油脂: -2400 / 50,
                          巨蕨谷粒: -2000 / 50,
                          鱼肉卷: 1000 / 50,
                        },
                      },
                      {
                        name: "蟹肉天妇罗(巨蕨谷粒)",
                        resources: {
                          生蟹肉: -1000 / 50,
                          动物油脂: -2400 / 50,
                          冰霜麦粒: -2000 / 50,
                          蟹肉天妇罗: 1000 / 50,
                        },
                      },
                      {
                        name: "蟹肉天妇罗(巨蕨谷粒)",
                        resources: {
                          生蟹肉: -1000 / 50,
                          动物油脂: -2400 / 50,
                          巨蕨谷粒: -2000 / 50,
                          蟹肉天妇罗: 1000 / 50,
                        },
                      },
                    ],
                  },
                ],
                power: 480,
                heat: 10000,
              },
            },
            {
              name: "食物压制器",

              detail: {
                resources: {},
                modes: [
                  {
                    name: "食谱",
                    options: [
                      {
                        name: "软泥膏",
                        resources: {
                          泥土: -75000 / 40,
                          水: -75000 / 40,
                          软泥膏: 1000 / 40,
                        },
                      },
                      {
                        name: "米虱糕",
                        resources: {
                          米虱: -2000 / 50,
                          水: -50000 / 50,
                          米虱糕: 1000 / 50,
                        },
                      },
                      {
                        name: "豆腐",
                        resources: {
                          小吃豆: -6000 / 50,
                          水: -50000 / 50,
                          豆腐: 1000 / 50,
                        },
                      },
                      {
                        name: "浆果糕(冰霜麦粒+毛刺浆果)",
                        resources: {
                          冰霜麦粒: -5000 / 50,
                          毛刺浆果: -1000 / 50,
                          浆果糕: 1000 / 50,
                        },
                      },
                      {
                        name: "浆果糕(冰霜麦粒+刺壳果)",
                        resources: {
                          冰霜麦粒: -5000 / 50,
                          刺壳果: -2000 / 50,
                          浆果糕: 1000 / 50,
                        },
                      },
                      {
                        name: "浆果糕(巨蕨谷粒+毛刺浆果)",
                        resources: {
                          巨蕨谷粒: -5000 / 50,
                          毛刺浆果: -1000 / 50,
                          浆果糕: 1000 / 50,
                        },
                      },
                      {
                        name: "浆果糕(巨蕨谷粒+刺壳果)",
                        resources: {
                          巨蕨谷粒: -5000 / 50,
                          刺壳果: -2000 / 50,
                          浆果糕: 1000 / 50,
                        },
                      },
                      {
                        name: "干肉饼",
                        resources: {
                          肉: -1000 / 50,
                          动物油脂: -1000 / 50,
                          干肉饼: 1000 / 50,
                        },
                      },
                    ],
                  },
                ],
                power: 240,
                heat: 2000,
              },
            },
            {
              name: "燃气灶",
              detail: {
                resources: {
                  天然气: -100,
                  二氧化碳: 25,
                },
                modes: [
                  {
                    name: "食谱",
                    options: [
                      {
                        name: "浆果酿",
                        resources: {
                          炙烤刺果: -2000 / 50,
                          火椒粒: -2000 / 50,
                          浆果酿: 1000 / 50,
                        },
                      },
                      {
                        name: "蘑菇卷",
                        resources: {
                          煎蘑菇: -1000 / 50,
                          海生菜: -4000 / 50,
                          蘑菇卷: 1000 / 50,
                        },
                      },
                      {
                        name: "海陆双拼",
                        resources: {
                          烤肉串: -1000 / 50,
                          烤海鲜: -1000 / 50,
                          海陆双拼: 1000 / 50,
                        },
                      },
                      {
                        name: "火椒面包(冰霜麦粒)",
                        resources: {
                          冰霜麦粒: -10000 / 50,
                          火椒粒: -1000 / 50,
                          火椒面包: 1000 / 50,
                        },
                      },
                      {
                        name: "火椒面包(巨蕨谷粒)",
                        resources: {
                          巨蕨谷粒: -10000 / 50,
                          火椒粒: -1000 / 50,
                          火椒面包: 1000 / 50,
                        },
                      },
                      {
                        name: "麻婆豆腐",
                        resources: {
                          豆腐: -1000 / 50,
                          火椒粒: -1000 / 50,
                          麻婆豆腐: 1000 / 50,
                        },
                      },
                      {
                        name: "咖喱豆",
                        resources: {
                          滋补根: -4000 / 50,
                          小吃豆: -4000 / 50,
                          咖喱豆: 1000 / 50,
                        },
                      },
                      {
                        name: "蘑菇乳蛋饼",
                        resources: {
                          煎蛋卷: -1000 / 50,
                          海生菜: -1000 / 50,
                          煎蘑菇: -1000 / 50,
                          蘑菇乳蛋饼: 1000 / 50,
                        },
                      },
                      {
                        name: "冰霜汉堡",
                        resources: {
                          冰霜面包: -1000 / 50,
                          海生菜: -1000 / 50,
                          烤肉串: -1000 / 50,
                          冰霜汉堡: 1000 / 50,
                        },
                      },
                      {
                        name: "混合浆果派(冰霜麦粒+炙烤刺果)",
                        resources: {
                          冰霜麦粒: -3000 / 50,
                          虫果: -4000 / 50,
                          炙烤刺果: -1000 / 50,
                          混合浆果派: 1000 / 50,
                        },
                      },
                      {
                        name: "混合浆果派(冰霜麦粒+刺壳果烤串)",
                        resources: {
                          冰霜麦粒: -3000 / 50,
                          虫果: -4000 / 50,
                          刺壳果烤串: -1670 / 50,
                          混合浆果派: 1000 / 50,
                        },
                      },
                      {
                        name: "混合浆果派(冰霜麦粒+漫花果)",
                        resources: {
                          冰霜麦粒: -3000 / 50,
                          虫果: -4000 / 50,
                          漫花果: -6150 / 50,
                          混合浆果派: 1000 / 50,
                        },
                      },
                      {
                        name: "混合浆果派(巨蕨谷粒+炙烤刺果)",
                        resources: {
                          巨蕨谷粒: -3000 / 50,
                          虫果: -4000 / 50,
                          炙烤刺果: -1000 / 50,
                          混合浆果派: 1000 / 50,
                        },
                      },
                      {
                        name: "混合浆果派(巨蕨谷粒+刺壳果烤串)",
                        resources: {
                          巨蕨谷粒: -3000 / 50,
                          虫果: -4000 / 50,
                          刺壳果烤串: -1670 / 50,
                          混合浆果派: 1000 / 50,
                        },
                      },
                      {
                        name: "混合浆果派(巨蕨谷粒+漫花果)",
                        resources: {
                          巨蕨谷粒: -3000 / 50,
                          虫果: -4000 / 50,
                          漫花果: -6150 / 50,
                          混合浆果派: 1000 / 50,
                        },
                      },
                    ],
                  },
                ],
                power: 240,
                heat: 9000,
              },
            },
            {
              name: "熏炉",
              detail: {
                resources: {
                  二氧化碳: 20,
                },
                modes: [
                  {
                    name: "食谱",
                    options: [
                      {
                        name: "嫩肋排",
                        resources: {
                          硬肉: -6000 / 600,
                          嫩肋排: 3200 / 600,
                        },
                      },
                      {
                        name: "熏鱼(帕库鱼)",
                        resources: {
                          帕库鱼片: -6000 / 600,
                          熏鱼: 4000 / 600,
                        },
                      },
                      {
                        name: "熏鱼(颚鱼片)",
                        resources: {
                          颚鱼片: -6000 / 600,
                          熏鱼: 4000 / 600,
                        },
                      },
                      {
                        name: "爆米花(汗甜玉米)",
                        resources: {
                          汗甜玉米: -7000 / 600,
                          爆米花: 4000 / 600,
                        },
                      },
                      {
                        name: "爆米花(刺壳果)",
                        resources: {
                          刺壳果: -7000 / 600,
                          爆米花: 4000 / 600,
                        },
                      },
                      {
                        name: "爆米花(贫瘠虫果)",
                        resources: {
                          贫瘠虫果: -7000 / 600,
                          爆米花: 4000 / 600,
                        },
                      },
                    ],
                  },
                  {
                    name: "燃料",
                    options: [
                      {
                        name: "木材",
                        resources: {
                          木材: -100000 / 600,
                        },
                      },
                      {
                        name: "泥炭",
                        resources: {
                          泥炭: -100000 / 600,
                        },
                      },
                    ],
                  },
                ],
                heat: 9000,
              },
            },
          ],
        },
        {
          name: "医疗",
          items: [
            {
              name: "配药桌",
              detail: {
                resources: {},
                modes: [
                  {
                    name: "配方",
                    options: [
                      {
                        name: "齿轮膏",
                        resources: {
                          粘渣油: -80000 / 100,
                          水: -200000 / 100,
                          齿轮膏: 80000 / 100,
                          污染水: 200000 / 100,
                        },
                      },
                      {
                        name: "动物油脂齿轮膏",
                        resources: {
                          动物油脂: -10000 / 100,
                          水: -70000 / 100,
                          动物油脂齿轮膏: 80000 / 100,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "实用",
          items: [
            {
              name: "油井",
              detail: {
                resources: {
                  水: 1000,
                  原油: 3300,
                },
                modes: [],
                power: -240,
                heat: 2000,
              },
            },
            {
              name: "柴火炉",
              detail: {
                resources: {
                  木材: 25,
                  二氧化碳: 4,
                },
                modes: [],
                power: 0,
                heat: 8000,
              },
            },
          ],
        },
      ],
    },
    {
      name: "动物",
      items: [
        {
          name: "绒犸兔",
          items: [
            {
              name: "绒犸兔",
              detail: {
                resources: {
                  肉: (14000 * Math.floor((200 - 5) / 12.5)) / 200 / 600,
                  绒犸兔碎糜: 30000 / 600,
                  芦苇纤维: (5000 * (195 / 10)) / 200 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "羽叶果薯植株",
                        resources: {
                          羽叶果薯植株: -0.4444,
                        },
                      },
                      {
                        name: "羽叶果薯",
                        resources: {
                          羽叶果薯: -444.4,
                        },
                      },
                      {
                        name: "果薯条",
                        resources: {
                          果薯条: -250,
                        },
                      },
                      {
                        name: "小吃芽",
                        resources: {
                          小吃芽: -0.1417,
                        },
                      },
                      {
                        name: "小吃豆",
                        resources: {
                          小吃豆: -1600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "皇犸兔",
              detail: {
                resources: {
                  肉: (14000 * Math.floor((200 - 5) / 12.5)) / 200 / 600,
                  绒犸兔碎糜: 30000 / 600,
                  皇犸兔头冠: (1000 * (195 / 10)) / 200 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "羽叶果薯植株",
                        resources: {
                          羽叶果薯植株: -0.4444,
                        },
                      },
                      {
                        name: "羽叶果薯",
                        resources: {
                          羽叶果薯: -444.4,
                        },
                      },
                      {
                        name: "果薯条",
                        resources: {
                          果薯条: -250,
                        },
                      },
                      {
                        name: "小吃芽",
                        resources: {
                          小吃芽: -0.1417,
                        },
                      },
                      {
                        name: "小吃豆",
                        resources: {
                          小吃豆: -1600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "逸蜥",
          detail: {
            resources: {
              肉: (500 * Math.floor((50 - 5) / 3)) / 50 / 600,
              露珠: -1000 / 600,
              漂白石: 10000 / 600,
            },
            modes: [],
          },
        },
        {
          name: "抛壳蟹",
          items: [
            {
              name: "抛壳蟹",
              detail: {
                resources: {
                  蟹壳: 15000 / 100 / 600,
                  沙子: 35000 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "污染土",
                        resources: {
                          污染土: -70000 / 600,
                        },
                      },
                      {
                        name: "腐烂物",
                        resources: {
                          腐烂物: -70000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "沙泥蟹",
              detail: {
                resources: {
                  生蟹肉: (4000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                  沙子: 35000 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "污染土",
                        resources: {
                          污染土: -70000 / 600,
                        },
                      },
                      {
                        name: "腐烂物",
                        resources: {
                          腐烂物: -70000 / 600,
                        },
                      },
                      {
                        name: "菌泥",
                        resources: {
                          菌泥: -70000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "木壳蟹",
              detail: {
                resources: {
                  木蟹壳: ((500 + 10 + 95 * 100) * 1000) / 100 / 600,
                  沙子: 17500 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "污染土",
                        resources: {
                          污染土: -70000 / 600,
                        },
                      },
                      {
                        name: "腐烂物",
                        resources: {
                          腐烂物: -70000 / 600,
                        },
                      },
                      {
                        name: "菌泥",
                        resources: {
                          菌泥: -70000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "狐鹿",
          detail: {
            resources: {
              泥土: 5000 / 100 / 600,
              木材: (360000 * Math.floor((100 - 5 - 3) / 6)) / 100 / 600,
              肉: (1000 * Math.floor((100 - 5) / 6)) / 100 / 600,
            },
            modes: [
              {
                name: "食物",
                options: [
                  {
                    name: "刺壳果灌木",
                    resources: {
                      刺壳果灌木: -0.2,
                    },
                  },
                  {
                    name: "刺壳果",
                    resources: {
                      刺壳果: -200 / 600,
                    },
                  },
                  {
                    name: "毛刺浆果",
                    resources: {
                      毛刺浆果: -100 / 600,
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          name: "异化虫",
          items: [
            {
              name: "甜素甲虫",
              detail: {
                resources: {
                  硫: -20000 / 75 / 600,
                  蔗糖: 10000 / 75 / 600,
                  肉: (1000 * Math.floor((75 - 5) / 4.5)) / 75 / 600,
                },
                modes: [],
              },
            },
            {
              name: "虫果果虫",
              detail: {
                resources: {
                  肉: (3000 * Math.floor((150 - 5) / 9)) / 150 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "硫",
                        resources: {
                          硫: -50000 / 600,
                          泥巴: 5000 / 600,
                        },
                      },
                      {
                        name: "蔗糖",
                        resources: {
                          蔗糖: -30000 / 600,
                          泥巴: 30000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "壁虎",
          items: [
            {
              name: "毛鳞壁虎",
              detail: {
                resources: {
                  磷矿: 10000 / 150 / 600,
                  肉: (2000 * Math.floor((150 - 5) / 9)) / 150 / 600,
                  芦苇纤维: (2000 * ((150 - 5) / 8)) / 150 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "火椒藤",
                        resources: {
                          火椒藤: -0.09375,
                        },
                      },
                      {
                        name: "芳香百合",
                        resources: {
                          芳香百合: -0.0625,
                        },
                      },
                      {
                        name: "米虱木",
                        resources: {
                          米虱木: -0.25,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "滑鳞壁虎",
              detail: {
                resources: {
                  磷矿: 9000 / 150 / 600,
                  肉: (2000 * Math.floor((150 - 5) / 9)) / 150 / 600,
                  塑料: (150000 * ((150 - 5) / 3)) / 150 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "米虱木",
                        resources: {
                          米虱木: -0.3333,
                        },
                      },
                      {
                        name: "毛刺花",
                        resources: {
                          毛刺花: -0.1667,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "疫病章鱼",
          detail: {
            resources: {
              污染氧: 6.667,
            },
            modes: [],
          },
        },
        {
          name: "哈奇",
          items: [
            {
              name: "好吃哈奇",
              detail: {
                resources: {
                  肉: (2000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "沙子",
                        resources: {
                          沙子: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "砂岩",
                        resources: {
                          砂岩: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "粘土",
                        resources: {
                          粘土: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "碎岩",
                        resources: {
                          碎岩: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "泥土",
                        resources: {
                          泥土: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "沉积岩",
                        resources: {
                          沉积岩: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "页岩",
                        resources: {
                          页岩: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "营养棒",
                        resources: {
                          营养棒: -875 / 600,
                          煤炭: 656.2 / 600,
                        },
                      },
                      {
                        name: "软泥膏",
                        resources: {
                          软泥膏: -875 / 600,
                          煤炭: 656.2 / 600,
                        },
                      },
                      {
                        name: "米虱",
                        resources: {
                          米虱: -1200 / 600,
                          煤炭: 875 / 600,
                        },
                      },
                      {
                        name: "漫花果",
                        resources: {
                          漫花果: -2200 / 600,
                          煤炭: 1600 / 600,
                        },
                      },
                      {
                        name: "淤泥根",
                        resources: {
                          淤泥根: -875 / 600,
                          煤炭: 656.2 / 600,
                        },
                      },
                      {
                        name: "六角根果实",
                        resources: {
                          六角根果实: -109.4 / 600,
                          煤炭: 82.0 / 600,
                        },
                      },
                      {
                        name: "沼泽甜菜心",
                        resources: {
                          沼泽甜菜心: -291.7 / 600,
                          煤炭: 218.7 / 600,
                        },
                      },
                      {
                        name: "雪莓",
                        resources: {
                          雪莓: -875 / 600,
                          煤炭: 656.2 / 600,
                        },
                      },
                      {
                        name: "蘑菇",
                        resources: {
                          蘑菇: -291.7 / 600,
                          煤炭: 218.7 / 600,
                        },
                      },
                      {
                        name: "海生菜",
                        resources: {
                          海生菜: -1700 / 600,
                          煤炭: 1300 / 600,
                        },
                      },
                      {
                        name: "生蛋",
                        resources: {
                          生蛋: -437.5 / 600,
                          煤炭: 328.1 / 600,
                        },
                      },
                      {
                        name: "肉",
                        resources: {
                          肉: -437.5 / 600,
                          煤炭: 328.1 / 600,
                        },
                      },
                      {
                        name: "植物肉",
                        resources: {
                          植物肉: -583.3 / 600,
                          煤炭: 437.5 / 600,
                        },
                      },
                      {
                        name: "毛刺浆果",
                        resources: {
                          毛刺浆果: -437.5 / 600,
                          煤炭: 328.1 / 600,
                        },
                      },
                      {
                        name: "沼浆果冻",
                        resources: {
                          沼浆果冻: -380.4 / 600,
                          煤炭: 285.3 / 600,
                        },
                      },
                      {
                        name: "帕库鱼片",
                        resources: {
                          帕库鱼片: -700 / 600,
                          煤炭: 525 / 600,
                        },
                      },
                      {
                        name: "生蟹肉",
                        resources: {
                          生蟹肉: -700 / 600,
                          煤炭: 525 / 600,
                        },
                      },
                      {
                        name: "颚鱼片",
                        resources: {
                          颚鱼片: -700 / 600,
                          煤炭: 525 / 600,
                        },
                      },
                      {
                        name: "贫瘠虫果",
                        resources: {
                          贫瘠虫果: -875 / 600,
                          煤炭: 656.2 / 600,
                        },
                      },
                      {
                        name: "虫果",
                        resources: {
                          虫果: -2800 / 600,
                          煤炭: 2100 / 600,
                        },
                      },
                      {
                        name: "刺壳果",
                        resources: {
                          刺壳果: -875 / 600,
                          煤炭: 656.2 / 600,
                        },
                      },
                      {
                        name: "羽叶果薯",
                        resources: {
                          羽叶果薯: -175 / 600,
                          煤炭: 131.2 / 600,
                        },
                      },
                      {
                        name: "干肉饼",
                        resources: {
                          干肉饼: -269.2 / 600,
                          煤炭: 201.9 / 600,
                        },
                      },
                      {
                        name: "果薯条",
                        resources: {
                          果薯条: -129.6 / 600,
                          煤炭: 97.2 / 600,
                        },
                      },
                      {
                        name: "烘烤拟种",
                        resources: {
                          烘烤拟种: -466.7 / 600,
                          煤炭: 350 / 600,
                        },
                      },
                      {
                        name: "炸肉块",
                        resources: {
                          炸肉块: -175 / 600,
                          煤炭: 131.2 / 600,
                        },
                      },
                      {
                        name: "炸豆小吃",
                        resources: {
                          炸豆小吃: -140 / 600,
                          煤炭: 105 / 600,
                        },
                      },
                      {
                        name: "鱼肉卷",
                        resources: {
                          鱼肉卷: -166.7 / 600,
                          煤炭: 125 / 600,
                        },
                      },
                      {
                        name: "蟹肉天妇罗",
                        resources: {
                          蟹肉天妇罗: -166.7 / 600,
                          煤炭: 125 / 600,
                        },
                      },
                      {
                        name: "汗甜玉米",
                        resources: {
                          汗甜玉米: -875 / 600,
                          煤炭: 656.2 / 600,
                        },
                      },
                      {
                        name: "菌斑果",
                        resources: {
                          菌斑果: -875 / 600,
                          煤炭: 656.2 / 600,
                        },
                      },
                      {
                        name: "腌制米虱",
                        resources: {
                          腌制米虱: -388.9 / 600,
                          煤炭: 291.7 / 600,
                        },
                      },
                      {
                        name: "米虱糕",
                        resources: {
                          米虱糕: -411.8 / 600,
                          煤炭: 308.8 / 600,
                        },
                      },
                      {
                        name: "煎泥膏",
                        resources: {
                          煎泥膏: -666.7 / 600,
                          煤炭: 500 / 600,
                        },
                      },
                      {
                        name: "伽马泥膏",
                        resources: {
                          伽马泥膏: -666.7 / 600,
                          煤炭: 500 / 600,
                        },
                      },
                      {
                        name: "炙烤刺果",
                        resources: {
                          炙烤刺果: -350 / 600,
                          煤炭: 262.5 / 600,
                        },
                      },
                      {
                        name: "沼泽欢愉",
                        resources: {
                          沼泽欢愉: -312.5 / 600,
                          煤炭: 234.4 / 600,
                        },
                      },
                      {
                        name: "煎蘑菇",
                        resources: {
                          煎蘑菇: -250 / 600,
                          煤炭: 187.5 / 600,
                        },
                      },
                      {
                        name: "刺壳果烤串",
                        resources: {
                          刺壳果烤串: -583.3 / 600,
                          煤炭: 437.5 / 600,
                        },
                      },
                      {
                        name: "冰霜面包",
                        resources: {
                          冰霜面包: -583.3 / 600,
                          煤炭: 437.5 / 600,
                        },
                      },
                      {
                        name: "煎蛋卷",
                        resources: {
                          煎蛋卷: -250 / 600,
                          煤炭: 187.5 / 600,
                        },
                      },
                      {
                        name: "烤海鲜",
                        resources: {
                          烤海鲜: -437.5 / 600,
                          煤炭: 328.1 / 600,
                        },
                      },
                      {
                        name: "爆米花",
                        resources: {
                          爆米花: -244.5 / 600,
                          煤炭: 183.4 / 600,
                        },
                      },
                      {
                        name: "蛋奶酥煎饼",
                        resources: {
                          蛋奶酥煎饼: -194.4 / 600,
                          煤炭: 145.8 / 600,
                        },
                      },
                      {
                        name: "熏鱼",
                        resources: {
                          熏鱼: -250 / 600,
                          煤炭: 187.5 / 600,
                        },
                      },
                      {
                        name: "烤肉串",
                        resources: {
                          烤肉串: -175 / 600,
                          煤炭: 131.2 / 600,
                        },
                      },
                      {
                        name: "嫩肋排",
                        resources: {
                          嫩肋排: -140 / 600,
                          煤炭: 105 / 600,
                        },
                      },
                      {
                        name: "烤虫果仁",
                        resources: {
                          烤虫果仁: -583.3 / 600,
                          煤炭: 437.5 / 600,
                        },
                      },
                      {
                        name: "虫果果酱",
                        resources: {
                          虫果果酱: -291.7 / 600,
                          煤炭: 218.7 / 600,
                        },
                      },
                      {
                        name: "浆果糕",
                        resources: {
                          浆果糕: -175 / 600,
                          煤炭: 131.2 / 600,
                        },
                      },
                      {
                        name: "浆果酿",
                        resources: {
                          浆果酿: -159.1 / 600,
                          煤炭: 119.3 / 600,
                        },
                      },
                      {
                        name: "海陆双拼",
                        resources: {
                          海陆双拼: -116.7 / 600,
                          煤炭: 87.5 / 600,
                        },
                      },
                      {
                        name: "蘑菇卷",
                        resources: {
                          蘑菇卷: -145.8 / 600,
                          煤炭: 109.4 / 600,
                        },
                      },
                      {
                        name: "豆腐",
                        resources: {
                          豆腐: -194.4 / 600,
                          煤炭: 145.8 / 600,
                        },
                      },
                      {
                        name: "咖喱豆",
                        resources: {
                          咖喱豆: -140 / 600,
                          煤炭: 105 / 600,
                        },
                      },
                      {
                        name: "火椒面包",
                        resources: {
                          火椒面包: -175 / 600,
                          煤炭: 131.2 / 600,
                        },
                      },
                      {
                        name: "麻婆豆腐",
                        resources: {
                          麻婆豆腐: -175 / 600,
                          煤炭: 131.2 / 600,
                        },
                      },
                      {
                        name: "蘑菇乳蛋饼",
                        resources: {
                          蘑菇乳蛋饼: -109.4 / 600,
                          煤炭: 82.0 / 600,
                        },
                      },
                      {
                        name: "混合浆果派",
                        resources: {
                          混合浆果派: -166.7 / 600,
                          煤炭: 125 / 600,
                        },
                      },
                      {
                        name: "冰霜汉堡",
                        resources: {
                          冰霜汉堡: -116.7 / 600,
                          煤炭: 87.5 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "草质哈奇",
              detail: {
                resources: {
                  肉: (2000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "泥土",
                        resources: {
                          泥土: -140000 / 600,
                          煤炭: 140000 / 600,
                        },
                      },
                      {
                        name: "菌泥",
                        resources: {
                          菌泥: -140000 / 600,
                          煤炭: 140000 / 600,
                        },
                      },
                      {
                        name: "藻类",
                        resources: {
                          藻类: -140000 / 600,
                          煤炭: 140000 / 600,
                        },
                      },
                      {
                        name: "肥料",
                        resources: {
                          肥料: -140000 / 600,
                          煤炭: 140000 / 600,
                        },
                      },
                      {
                        name: "污染土",
                        resources: {
                          污染土: -140000 / 600,
                          煤炭: 140000 / 600,
                        },
                      },
                      {
                        name: "营养棒",
                        resources: {
                          营养棒: -875 / 600,
                          煤炭: 875 / 600,
                        },
                      },
                      {
                        name: "软泥膏",
                        resources: {
                          软泥膏: -875 / 600,
                          煤炭: 875 / 600,
                        },
                      },
                      {
                        name: "米虱",
                        resources: {
                          米虱: -1200 / 600,
                          煤炭: 1200 / 600,
                        },
                      },
                      {
                        name: "漫花果",
                        resources: {
                          漫花果: -2200 / 600,
                          煤炭: 2200 / 600,
                        },
                      },
                      {
                        name: "淤泥根",
                        resources: {
                          淤泥根: -875 / 600,
                          煤炭: 875 / 600,
                        },
                      },
                      {
                        name: "六角根果实",
                        resources: {
                          六角根果实: -109.4 / 600,
                          煤炭: 109.4 / 600,
                        },
                      },
                      {
                        name: "沼泽甜菜心",
                        resources: {
                          沼泽甜菜心: -291.7 / 600,
                          煤炭: 291.7 / 600,
                        },
                      },
                      {
                        name: "雪莓",
                        resources: {
                          雪莓: -875 / 600,
                          煤炭: 875 / 600,
                        },
                      },
                      {
                        name: "蘑菇",
                        resources: {
                          蘑菇: -291.7 / 600,
                          煤炭: 291.7 / 600,
                        },
                      },
                      {
                        name: "海生菜",
                        resources: {
                          海生菜: -1700 / 600,
                          煤炭: 1700 / 600,
                        },
                      },
                      {
                        name: "生蛋",
                        resources: {
                          生蛋: -437.5 / 600,
                          煤炭: 437.5 / 600,
                        },
                      },
                      {
                        name: "肉",
                        resources: {
                          肉: -437.5 / 600,
                          煤炭: 437.5 / 600,
                        },
                      },
                      {
                        name: "植物肉",
                        resources: {
                          植物肉: -583.3 / 600,
                          煤炭: 583.3 / 600,
                        },
                      },
                      {
                        name: "毛刺浆果",
                        resources: {
                          毛刺浆果: -437.5 / 600,
                          煤炭: 437.5 / 600,
                        },
                      },
                      {
                        name: "沼浆果冻",
                        resources: {
                          沼浆果冻: -380.4 / 600,
                          煤炭: 380.4 / 600,
                        },
                      },
                      {
                        name: "帕库鱼片",
                        resources: {
                          帕库鱼片: -700 / 600,
                          煤炭: 700 / 600,
                        },
                      },
                      {
                        name: "生蟹肉",
                        resources: {
                          生蟹肉: -700 / 600,
                          煤炭: 700 / 600,
                        },
                      },
                      {
                        name: "颚鱼片",
                        resources: {
                          颚鱼片: -700 / 600,
                          煤炭: 700 / 600,
                        },
                      },
                      {
                        name: "贫瘠虫果",
                        resources: {
                          贫瘠虫果: -875 / 600,
                          煤炭: 875 / 600,
                        },
                      },
                      {
                        name: "虫果",
                        resources: {
                          虫果: -2800 / 600,
                          煤炭: 2800 / 600,
                        },
                      },
                      {
                        name: "刺壳果",
                        resources: {
                          刺壳果: -875 / 600,
                          煤炭: 875 / 600,
                        },
                      },
                      {
                        name: "羽叶果薯",
                        resources: {
                          羽叶果薯: -175 / 600,
                          煤炭: 175 / 600,
                        },
                      },
                      {
                        name: "干肉饼",
                        resources: {
                          干肉饼: -269.2 / 600,
                          煤炭: 269.2 / 600,
                        },
                      },
                      {
                        name: "果薯条",
                        resources: {
                          果薯条: -129.6 / 600,
                          煤炭: 129.6 / 600,
                        },
                      },
                      {
                        name: "烘烤拟种",
                        resources: {
                          烘烤拟种: -466.7 / 600,
                          煤炭: 466.7 / 600,
                        },
                      },
                      {
                        name: "炸肉块",
                        resources: {
                          炸肉块: -175 / 600,
                          煤炭: 175 / 600,
                        },
                      },
                      {
                        name: "炸豆小吃",
                        resources: {
                          炸豆小吃: -140 / 600,
                          煤炭: 140 / 600,
                        },
                      },
                      {
                        name: "鱼肉卷",
                        resources: {
                          鱼肉卷: -166.7 / 600,
                          煤炭: 166.7 / 600,
                        },
                      },
                      {
                        name: "蟹肉天妇罗",
                        resources: {
                          蟹肉天妇罗: -166.7 / 600,
                          煤炭: 166.7 / 600,
                        },
                      },
                      {
                        name: "汗甜玉米",
                        resources: {
                          汗甜玉米: -875 / 600,
                          煤炭: 875 / 600,
                        },
                      },
                      {
                        name: "菌斑果",
                        resources: {
                          菌斑果: -875 / 600,
                          煤炭: 875 / 600,
                        },
                      },
                      {
                        name: "腌制米虱",
                        resources: {
                          腌制米虱: -388.9 / 600,
                          煤炭: 388.9 / 600,
                        },
                      },
                      {
                        name: "米虱糕",
                        resources: {
                          米虱糕: -411.8 / 600,
                          煤炭: 411.8 / 600,
                        },
                      },
                      {
                        name: "煎泥膏",
                        resources: {
                          煎泥膏: -666.7 / 600,
                          煤炭: 666.7 / 600,
                        },
                      },
                      {
                        name: "伽马泥膏",
                        resources: {
                          伽马泥膏: -666.7 / 600,
                          煤炭: 666.7 / 600,
                        },
                      },
                      {
                        name: "炙烤刺果",
                        resources: {
                          炙烤刺果: -350 / 600,
                          煤炭: 350 / 600,
                        },
                      },
                      {
                        name: "沼泽欢愉",
                        resources: {
                          沼泽欢愉: -312.5 / 600,
                          煤炭: 312.5 / 600,
                        },
                      },
                      {
                        name: "煎蘑菇",
                        resources: {
                          煎蘑菇: -250 / 600,
                          煤炭: 250 / 600,
                        },
                      },
                      {
                        name: "刺壳果烤串",
                        resources: {
                          刺壳果烤串: -583.3 / 600,
                          煤炭: 583.3 / 600,
                        },
                      },
                      {
                        name: "冰霜面包",
                        resources: {
                          冰霜面包: -583.3 / 600,
                          煤炭: 583.3 / 600,
                        },
                      },
                      {
                        name: "煎蛋卷",
                        resources: {
                          煎蛋卷: -250 / 600,
                          煤炭: 250 / 600,
                        },
                      },
                      {
                        name: "烤海鲜",
                        resources: {
                          烤海鲜: -437.5 / 600,
                          煤炭: 437.5 / 600,
                        },
                      },
                      {
                        name: "爆米花",
                        resources: {
                          爆米花: -244.5 / 600,
                          煤炭: 244.5 / 600,
                        },
                      },
                      {
                        name: "蛋奶酥煎饼",
                        resources: {
                          蛋奶酥煎饼: -194.4 / 600,
                          煤炭: 194.4 / 600,
                        },
                      },
                      {
                        name: "熏鱼",
                        resources: {
                          熏鱼: -250 / 600,
                          煤炭: 250 / 600,
                        },
                      },
                      {
                        name: "烤肉串",
                        resources: {
                          烤肉串: -175 / 600,
                          煤炭: 175 / 600,
                        },
                      },
                      {
                        name: "嫩肋排",
                        resources: {
                          嫩肋排: -140 / 600,
                          煤炭: 140 / 600,
                        },
                      },
                      {
                        name: "烤虫果仁",
                        resources: {
                          烤虫果仁: -583.3 / 600,
                          煤炭: 583.3 / 600,
                        },
                      },
                      {
                        name: "虫果果酱",
                        resources: {
                          虫果果酱: -291.7 / 600,
                          煤炭: 291.7 / 600,
                        },
                      },
                      {
                        name: "浆果糕",
                        resources: {
                          浆果糕: -175 / 600,
                          煤炭: 175 / 600,
                        },
                      },
                      {
                        name: "浆果酿",
                        resources: {
                          浆果酿: -159.1 / 600,
                          煤炭: 159.1 / 600,
                        },
                      },
                      {
                        name: "海陆双拼",
                        resources: {
                          海陆双拼: -116.7 / 600,
                          煤炭: 116.7 / 600,
                        },
                      },
                      {
                        name: "蘑菇卷",
                        resources: {
                          蘑菇卷: -145.8 / 600,
                          煤炭: 145.8 / 600,
                        },
                      },
                      {
                        name: "豆腐",
                        resources: {
                          豆腐: -194.4 / 600,
                          煤炭: 194.4 / 600,
                        },
                      },
                      {
                        name: "咖喱豆",
                        resources: {
                          咖喱豆: -140 / 600,
                          煤炭: 140 / 600,
                        },
                      },
                      {
                        name: "火椒面包",
                        resources: {
                          火椒面包: -175 / 600,
                          煤炭: 175 / 600,
                        },
                      },
                      {
                        name: "麻婆豆腐",
                        resources: {
                          麻婆豆腐: -175 / 600,
                          煤炭: 175 / 600,
                        },
                      },
                      {
                        name: "蘑菇乳蛋饼",
                        resources: {
                          蘑菇乳蛋饼: -109.4 / 600,
                          煤炭: 109.4 / 600,
                        },
                      },
                      {
                        name: "混合浆果派",
                        resources: {
                          混合浆果派: -166.7 / 600,
                          煤炭: 166.7 / 600,
                        },
                      },
                      {
                        name: "冰霜汉堡",
                        resources: {
                          冰霜汉堡: -116.7 / 600,
                          煤炭: 116.7 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "石壳哈奇",
              detail: {
                resources: {
                  肉: (2000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "沉积岩",
                        resources: {
                          沉积岩: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "火成岩",
                        resources: {
                          火成岩: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "黑曜石",
                        resources: {
                          黑曜石: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "花岗岩",
                        resources: {
                          花岗岩: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "铜矿",
                        resources: {
                          铜矿: -140000 / 600,
                          煤炭: 35000 / 600,
                        },
                      },
                      {
                        name: "钴矿",
                        resources: {
                          钴矿: -140000 / 600,
                          煤炭: 35000 / 600,
                        },
                      },
                      {
                        name: "铝矿",
                        resources: {
                          铝矿: -140000 / 600,
                          煤炭: 35000 / 600,
                        },
                      },
                      {
                        name: "镍矿",
                        resources: {
                          镍矿: -140000 / 600,
                          煤炭: 35000 / 600,
                        },
                      },
                      {
                        name: "朱砂矿",
                        resources: {
                          朱砂矿: -140000 / 600,
                          煤炭: 35000 / 600,
                        },
                      },
                      {
                        name: "铁矿",
                        resources: {
                          铁矿: -140000 / 600,
                          煤炭: 35000 / 600,
                        },
                      },
                      {
                        name: "金汞齐",
                        resources: {
                          金汞齐: -140000 / 600,
                          煤炭: 35000 / 600,
                        },
                      },
                      {
                        name: "黑钨矿",
                        resources: {
                          黑钨矿: -140000 / 600,
                          煤炭: 35000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "光滑哈奇",
              detail: {
                resources: {
                  肉: (2000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "铜矿",
                        resources: {
                          铜矿: -100000 / 600,
                          铜: 75000 / 600,
                        },
                      },
                      {
                        name: "钴矿",
                        resources: {
                          钴矿: -100000 / 600,
                          钴: 75000 / 600,
                        },
                      },
                      {
                        name: "铝矿",
                        resources: {
                          铝矿: -100000 / 600,
                          铝: 75000 / 600,
                        },
                      },
                      {
                        name: "镍矿",
                        resources: {
                          镍矿: -100000 / 600,
                          镍: 75000 / 600,
                        },
                      },
                      {
                        name: "朱砂矿",
                        resources: {
                          朱砂矿: -100000 / 600,
                          固态汞: 75000 / 600,
                        },
                      },
                      {
                        name: "铁矿",
                        resources: {
                          铁矿: -100000 / 600,
                          铁: 75000 / 600,
                        },
                      },
                      {
                        name: "金汞齐",
                        resources: {
                          金汞齐: -100000 / 600,
                          金: 75000 / 600,
                        },
                      },
                      {
                        name: "黑钨矿",
                        resources: {
                          黑钨矿: -100000 / 600,
                          钨: 75000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "田鼠",
          items: [
            {
              name: "锹环田鼠",
              detail: {
                resources: {
                  肉: (10000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "浮土",
                        resources: {
                          浮土: -2400000 / 600,
                        },
                      },
                      {
                        name: "泥土",
                        resources: {
                          泥土: -2400000 / 600,
                        },
                      },
                      {
                        name: "铁矿",
                        resources: {
                          铁矿: -2400000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "珍馐田鼠",
              detail: {
                resources: {
                  肉: (5000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                  滋补根: (8000 * ((100 - 5) / 8)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "浮土",
                        resources: {
                          浮土: -2400000 / 600,
                        },
                      },
                      {
                        name: "泥土",
                        resources: {
                          泥土: -2400000 / 600,
                        },
                      },
                      {
                        name: "铁矿",
                        resources: {
                          铁矿: -2400000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "释气海牛",
          detail: {
            resources: {
              释气草: 0.5,
              天然气: 10000 / 600,
              肉: (10000 * Math.floor(75 / 16)) / 75 / 600,
              咸乳: (200000 * (75 / 4)) / 75 / 600,
            },
            modes: [],
          },
        },
        {
          name: "浮油生物",
          items: [
            {
              name: "浮油生物",
              detail: {
                resources: {
                  二氧化碳: -20000 / 600,
                  原油: 10000 / 600,
                  肉: (2000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                },
                modes: [],
              },
            },
            {
              name: "长毛浮油生物",
              detail: {
                resources: {
                  氧气: -30000 / 600,
                  肉: (2000 * Math.floor((150 - 5) / 6)) / 150 / 600,
                },
                modes: [],
              },
            },
            {
              name: "熔岩浮油生物",
              detail: {
                resources: {
                  二氧化碳: -20000 / 600,
                  石油: 10000 / 600,
                  肉: (2000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                },
                modes: [],
              },
            },
          ],
        },
        {
          name: "帕库鱼",
          detail: {
            resources: {
              帕库鱼片: 1000 / 25 / 600,
              生蛋: (4000 * 12) / 25 / 600,
            },
            modes: [
              {
                name: "食物",
                options: [
                  {
                    name: "藻类",
                    resources: {
                      藻类: -7500 / 600,
                      污染土: 3800 / 600,
                    },
                  },
                  {
                    name: "海梳蕨叶",
                    resources: {
                      海梳蕨叶: -20000 / 600,
                      污染土: 10000 / 600,
                    },
                  },
                  {
                    name: "海梳蕨",
                    resources: {
                      海梳蕨: -0.4,
                      污染土: 10000 / 600,
                    },
                  },
                  {
                    name: "羽叶果薯种子",
                    resources: {
                      羽叶果薯种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "拟种",
                    resources: {
                      拟种: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "气囊芦荟种子",
                    resources: {
                      气囊芦荟种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "小吃豆",
                    resources: {
                      小吃豆: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "顶针芦苇种子",
                    resources: {
                      顶针芦苇种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "米虱木种子",
                    resources: {
                      米虱木种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "冰霜麦粒",
                    resources: {
                      冰霜麦粒: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "汗甜玉米种子",
                    resources: {
                      汗甜玉米种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "露珠藤种子",
                    resources: {
                      露珠藤种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "露饵花种子",
                    resources: {
                      露饵花种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "释气草种子",
                    resources: {
                      释气草种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "火椒种子",
                    resources: {
                      火椒种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "糖心树种子",
                    resources: {
                      糖心树种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "水草种子",
                    resources: {
                      水草种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "沙盐藤种子",
                    resources: {
                      沙盐藤种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "毛刺花种子",
                    resources: {
                      毛刺花种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "夜幕菇孢子",
                    resources: {
                      夜幕菇孢子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "沼浆笼种子",
                    resources: {
                      沼浆笼种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "芳香百合种子",
                    resources: {
                      芳香百合种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "虫果种子",
                    resources: {
                      虫果种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                  {
                    name: "刺壳果灌木种子",
                    resources: {
                      刺壳果灌木种子: -1000 / 600,
                      污染土: 500 / 600,
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          name: "颚鱼",
          detail: {
            resources: {
              颚鱼片: (12000 * Math.floor((100 - 5) / 6)) / 100 / 600,
              帕库鱼片: -1000 / 600,
              铁锈: 60000 / 600,
            },
            modes: [],
          },
        },
        {
          name: "飞鱼",
          items: [
            {
              name: "喷浮飞鱼",
              detail: {
                resources: {
                  污染氧: -50000 / 600,
                  菌泥: 47500 / 600,
                  肉: (1000 * Math.floor((75 - 5) / 4.5)) / 75 / 600,
                },
                modes: [],
              },
            },
            {
              name: "贵族飞鱼",
              detail: {
                resources: {
                  肉: (1000 * Math.floor((75 - 5) / 4.5)) / 75 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "污染氧",
                        resources: {
                          污染氧: -30000 / 600,
                          菌泥: 3000 / 600,
                        },
                      },
                      {
                        name: "氯气",
                        resources: {
                          氯气: -30000 / 600,
                          漂白石: 3000 / 600,
                        },
                      },
                      {
                        name: "氧气",
                        resources: {
                          氧气: -30000 / 600,
                          氧石: 3000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "洁净飞鱼",
              detail: {
                resources: {
                  氯气: -30000 / 600,
                  漂白石: 28500 / 600,
                  肉: (1000 * Math.floor((75 - 5) / 4.5)) / 75 / 600,
                },
                modes: [],
              },
            },
            {
              name: "厚壳飞鱼",
              detail: {
                resources: {
                  氧气: -50000 / 600,
                  氧石: 47500 / 600,
                  肉: (1000 * Math.floor((75 - 5) / 4.5)) / 75 / 600,
                },
                modes: [],
              },
            },
          ],
        },
        {
          name: "霸王鹦",
          detail: {
            resources: {
              浓盐冰: 64000 / 600,
              硬肉: (5000 * Math.floor((200 - 5) / 12.5)) / 200 / 600,
            },
            modes: [
              {
                name: "食物",
                options: [
                  {
                    name: "硬肉",
                    resources: {
                      硬肉: -500 / 600,
                    },
                  },
                  {
                    name: "肉",
                    resources: {
                      肉: -500 / 600,
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          name: "栓角海豹",
          detail: {
            resources: {
              乙醇: 40000 / 600,
              动物油脂: (50000 * Math.floor((100 - 5) / 6)) / 100 / 600,
            },
            modes: [
              {
                name: "食物",
                options: [
                  {
                    name: "花蜜",
                    resources: {
                      花蜜: -40000 / 600,
                    },
                  },
                  {
                    name: "蔗糖",
                    resources: {
                      蔗糖: -30800 / 600,
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          name: "树鼠",
          items: [
            {
              name: "树鼠",
              detail: {
                resources: {
                  泥土: 20000 / 600,
                  肉: 1000 / 100 / 600,
                  生蛋: (2000 * (Math.floor((100 - 5) / 6) - 1)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "乔木树",
                        resources: {
                          乔木树: -0.08888,
                        },
                      },
                      {
                        name: "顶针芦苇",
                        resources: {
                          顶针芦苇: -0.25,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "毛绒树鼠",
              detail: {
                resources: {
                  泥土: 12500 / 600,
                  肉: 1000 / 100 / 600,
                  生蛋: (2000 * (Math.floor((100 - 5) / 6) - 1)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "乔木树",
                        resources: {
                          乔木树: -0.1111,
                        },
                      },
                      {
                        name: "顶针芦苇",
                        resources: {
                          顶针芦苇: -0.25,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "蛞蝓",
          items: [
            {
              name: "电弧蛞蝓",
              detail: {
                resources: {
                  氢气: 3000 / 600,
                  肉: (2000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "铜矿",
                        resources: {
                          铜矿: -60000 / 600,
                        },
                      },
                      {
                        name: "钴矿",
                        resources: {
                          钴矿: -60000 / 600,
                        },
                      },
                      {
                        name: "铝矿",
                        resources: {
                          铝矿: -60000 / 600,
                        },
                      },
                      {
                        name: "金汞齐",
                        resources: {
                          金汞齐: -60000 / 600,
                        },
                      },
                      {
                        name: "镍矿",
                        resources: {
                          镍矿: -60000 / 600,
                        },
                      },
                      {
                        name: "铁矿",
                        resources: {
                          铁矿: -60000 / 600,
                        },
                      },
                      {
                        name: "朱砂矿",
                        resources: {
                          朱砂矿: -60000 / 600,
                        },
                      },
                      {
                        name: "镍",
                        resources: {
                          镍: -60000 / 600,
                        },
                      },
                      {
                        name: "铜",
                        resources: {
                          铜: -60000 / 600,
                        },
                      },
                      {
                        name: "钨",
                        resources: {
                          钨: -60000 / 600,
                        },
                      },
                      {
                        name: "铅",
                        resources: {
                          铅: -60000 / 600,
                        },
                      },
                      {
                        name: "固态汞",
                        resources: {
                          固态汞: -60000 / 600,
                        },
                      },
                      {
                        name: "金",
                        resources: {
                          金: -60000 / 600,
                        },
                      },
                      {
                        name: "铱",
                        resources: {
                          铱: -60000 / 600,
                        },
                      },
                      {
                        name: "钴",
                        resources: {
                          钴: -60000 / 600,
                        },
                      },
                      {
                        name: "贫铀",
                        resources: {
                          贫铀: -60000 / 600,
                        },
                      },
                      {
                        name: "铁",
                        resources: {
                          铁: -60000 / 600,
                        },
                      },
                      {
                        name: "铝",
                        resources: {
                          铝: -60000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "烟雾蛞蝓",
              detail: {
                resources: {
                  氢气: 1500 / 600,
                  肉: (2000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "铜矿",
                        resources: {
                          铜矿: -30000 / 600,
                        },
                      },
                      {
                        name: "钴矿",
                        resources: {
                          钴矿: -30000 / 600,
                        },
                      },
                      {
                        name: "铝矿",
                        resources: {
                          铝矿: -30000 / 600,
                        },
                      },
                      {
                        name: "金汞齐",
                        resources: {
                          金汞齐: -30000 / 600,
                        },
                      },
                      {
                        name: "镍矿",
                        resources: {
                          镍矿: -30000 / 600,
                        },
                      },
                      {
                        name: "铁矿",
                        resources: {
                          铁矿: -30000 / 600,
                        },
                      },
                      {
                        name: "朱砂矿",
                        resources: {
                          朱砂矿: -30000 / 600,
                        },
                      },
                      {
                        name: "镍",
                        resources: {
                          镍: -30000 / 600,
                        },
                      },
                      {
                        name: "铜",
                        resources: {
                          铜: -30000 / 600,
                        },
                      },
                      {
                        name: "钨",
                        resources: {
                          钨: -30000 / 600,
                        },
                      },
                      {
                        name: "铅",
                        resources: {
                          铅: -30000 / 600,
                        },
                      },
                      {
                        name: "固态汞",
                        resources: {
                          固态汞: -30000 / 600,
                        },
                      },
                      {
                        name: "金",
                        resources: {
                          金: -30000 / 600,
                        },
                      },
                      {
                        name: "铱",
                        resources: {
                          铱: -30000 / 600,
                        },
                      },
                      {
                        name: "钴",
                        resources: {
                          钴: -30000 / 600,
                        },
                      },
                      {
                        name: "贫铀",
                        resources: {
                          贫铀: -30000 / 600,
                        },
                      },
                      {
                        name: "铁",
                        resources: {
                          铁: -30000 / 600,
                        },
                      },
                      {
                        name: "铝",
                        resources: {
                          铝: -30000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              name: "海绵蛞蝓",
              detail: {
                resources: {
                  氢气: 1500 / 600,
                  肉: (2000 * Math.floor((100 - 5) / 6)) / 100 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "铜矿",
                        resources: {
                          铜矿: -30000 / 600,
                        },
                      },
                      {
                        name: "钴矿",
                        resources: {
                          钴矿: -30000 / 600,
                        },
                      },
                      {
                        name: "铝矿",
                        resources: {
                          铝矿: -30000 / 600,
                        },
                      },
                      {
                        name: "金汞齐",
                        resources: {
                          金汞齐: -30000 / 600,
                        },
                      },
                      {
                        name: "镍矿",
                        resources: {
                          镍矿: -30000 / 600,
                        },
                      },
                      {
                        name: "铁矿",
                        resources: {
                          铁矿: -30000 / 600,
                        },
                      },
                      {
                        name: "朱砂矿",
                        resources: {
                          朱砂矿: -30000 / 600,
                        },
                      },
                      {
                        name: "镍",
                        resources: {
                          镍: -30000 / 600,
                        },
                      },
                      {
                        name: "铜",
                        resources: {
                          铜: -30000 / 600,
                        },
                      },
                      {
                        name: "钨",
                        resources: {
                          钨: -30000 / 600,
                        },
                      },
                      {
                        name: "铅",
                        resources: {
                          铅: -30000 / 600,
                        },
                      },
                      {
                        name: "固态汞",
                        resources: {
                          固态汞: -30000 / 600,
                        },
                      },
                      {
                        name: "金",
                        resources: {
                          金: -30000 / 600,
                        },
                      },
                      {
                        name: "铱",
                        resources: {
                          铱: -30000 / 600,
                        },
                      },
                      {
                        name: "钴",
                        resources: {
                          钴: -30000 / 600,
                        },
                      },
                      {
                        name: "贫铀",
                        resources: {
                          贫铀: -30000 / 600,
                        },
                      },
                      {
                        name: "铁",
                        resources: {
                          铁: -30000 / 600,
                        },
                      },
                      {
                        name: "铝",
                        resources: {
                          铝: -30000 / 600,
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: "尖块兽",
          detail: {
            resources: {
              乙醇: 40000 / 600,
              硬肉: (12000 * Math.floor((200 - 5) / 12.5)) / 200 / 600,
            },
            modes: [
              {
                name: "食物",
                options: [
                  {
                    name: "漫花果",
                    resources: {
                      漫花果: -4000 / 600,
                      泥炭: 200000 / 600,
                    },
                  },
                  {
                    name: "毛刺浆果",
                    resources: {
                      毛刺浆果: -812.5 / 600,
                      泥炭: 200000 / 600,
                    },
                  },
                  {
                    name: "沼浆果冻",
                    resources: {
                      沼浆果冻: -706.5 / 600,
                      泥炭: 300000 / 600,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    },
    {
      name: "植物",
      items: [
        {
          name: "食用性植物",
          items: [
            {
              name: "米虱木",
              detail: {
                resources: {
                  泥土: -10000 / 600,
                  米虱: 1000 / 3 / 600,
                  米虱木种子: (1000 * 0.133) / 3,
                },
                growth: 3,
                modes: [],
              },
            },
            {
              name: "毛刺花",
              detail: {
                resources: {
                  水: -20000 / 600,
                  毛刺浆果: 1000 / 6 / 600,
                  毛刺花种子: (1000 * 0.133) / 6,
                },
                growth: 6,
                modes: [],
              },
            },
            {
              name: "夜幕菇",
              detail: {
                resources: {
                  菌泥: -4000 / 600,
                  蘑菇: 1000 / 7.5 / 600,
                  真菌孢子: (1000 * 0.133) / 7.5,
                },
                growth: 7.5,
                modes: [],
              },
            },
            {
              name: "冰霜小麦",
              detail: {
                resources: {
                  水: -20000 / 600,
                  泥土: -5000 / 600,
                  冰霜麦粒: (18 * 1000) / 18 / 600,
                },
                growth: 18,
                modes: [],
              },
            },
            {
              name: "小吃芽",
              detail: {
                resources: {
                  乙醇: -20000 / 600,
                  泥土: -5000 / 600,
                  小吃豆: (12 * 1000) / 21 / 600,
                },
                growth: 21,
                modes: [],
              },
            },
            {
              name: "水草",
              detail: {
                resources: {
                  盐水: -5000 / 600,
                  漂白石: -500 / 600,
                  海生菜: (12 * 1000) / 12 / 600,
                  水草种子: (1000 * 0.133) / 12,
                },
                growth: 12,
                modes: [],
              },
            },
            {
              name: "火椒藤",
              detail: {
                resources: {
                  污染水: -35000 / 600,
                  磷矿: -1000 / 600,
                  火椒粒: (4 * 1000) / 8 / 600,
                  火椒藤种子: (1000 * 0.133) / 8,
                },
                growth: 8,
                modes: [],
              },
            },
            {
              name: "沼浆笼",
              detail: {
                resources: {
                  污染水: -40000 / 600,
                  沼浆果冻: 1000 / 6.6 / 600,
                  沼浆笼种子: (1000 * 0.133) / 6.6,
                },
                growth: 6.6,
                modes: [],
              },
            },
            {
              name: "贫瘠虫果芽",
              detail: {
                resources: {
                  硫: -10000 / 600,
                  贫瘠虫果: 1000 / 4 / 600,
                  贫瘠虫果芽种子: (1000 * 0.133) / 4,
                },
                growth: 4,
                modes: [],
              },
            },
            {
              name: "虫果芽",
              detail: {
                resources: {
                  硫: -10000 / 600,
                  虫果: (8 * 1000) / 8 / 600,
                  虫果芽种子: (1000 * 0.133) / 8,
                },
                growth: 8,
                modes: [],
              },
            },
            {
              name: "土星动物捕草",
              detail: {
                resources: {
                  污染水: -10000 / 600,
                  植物肉: (10 * 1000) / 30 / 600,
                  土星动物捕草种子: (1000 * 0.133) / 30,
                },
                growth: 30,
                modes: [],
              },
            },
            {
              name: "刺壳果灌木",
              detail: {
                resources: {
                  磷矿: -5000 / 600,
                  刺壳果: 1000 / 3 / 600,
                  刺壳果灌木种子: (1000 * 0.133) / 3,
                },
                growth: 3,
                modes: [],
              },
            },
            {
              name: "羽叶果薯植株",
              detail: {
                resources: {
                  乙醇: -15000 / 600,
                  羽叶果薯: 1000 / 9 / 600,
                  羽叶果薯种子: (1000 * 0.133) / 9,
                },
                growth: 9,
                modes: [],
              },
            },
            {
              name: "汗甜玉米秆",
              detail: {
                resources: {
                  泥炭: -10000 / 600,
                  汗甜玉米: 1000 / 3 / 600,
                  汗甜玉米种子: (1000 * 0.133) / 3,
                },
                growth: 3,
                modes: [],
              },
            },
          ],
        },
        {
          name: "工业性植物",
          items: [
            {
              name: "乔木树",
              detail: {
                resources: {
                  污染水: -70000 / 4.5 / 600,
                  泥土: -10000 / 4.5 / 600,
                  木材: 300000 / 4.5 / 600,
                  乔木橡实: (1000 * 0.133) / 4.5,
                },
                growth: 4.5,
                modes: [],
              },
            },
            {
              name: "沙盐藤",
              detail: {
                resources: {
                  沙子: -7000 / 6 / 600,
                  盐: 65000 / 6 / 600,
                  沙盐藤种子: (1000 * 0.133) / 6,
                },
                growth: 6,
                modes: [],
              },
            },
            {
              name: "芳香百合",
              detail: {
                resources: {
                  芳香百合花: 2000 / 12 / 600,
                  芳香百合种子: (1000 * 0.133) / 12,
                },
                growth: 12,
                modes: [],
              },
            },
            {
              name: "释气草",
              detail: {
                resources: {
                  液态氯: -500 / 4 / 600,
                  泥土: -25000 / 4 / 600,
                  释气草: 1000 / 4 / 600,
                },
                growth: 4,
                modes: [],
              },
            },
            {
              name: "顶针芦苇",
              detail: {
                resources: {
                  污染水: -160000 / 2 / 600,
                  芦苇纤维: 1000 / 2 / 600,
                  顶针芦苇种子: (1000 * 0.133) / 2,
                },
                growth: 2,
                modes: [],
              },
            },
            {
              name: "气囊芦荟",
              detail: {
                resources: {
                  冰: -20000 / 2 / 600,
                  氧石: 36000 / 2 / 600,
                  气囊芦荟种子: (1000 * 0.133) / 2,
                },
                growth: 2,
                modes: [],
              },
            },
            {
              name: "氧齿蕨",
              detail: {
                resources: {
                  水: -19000 / 600,
                  泥土: 400 / 600,
                },
                growth: 2,
                modes: [],
              },
            },
            {
              name: "糖心树",
              detail: {
                resources: {
                  雪: -100000 / 600,
                  花蜜: 20000 / 4.5 / 600,
                  糖心树种子: (1000 * 0.133) / 4.5,
                },
                growth: 4.5,
                modes: [],
              },
            },
            // {
            //   name: "仙水掌",
            //   detail: {
            //     resources: {
            //       污染水: -65000 / 600,
            //       沙子: -5000 / 600,
            //       氧气: -8.33,
            //       水: 350000 / 10 / 600,
            //       仙水掌种子: (1000 * 0.133) / 10,
            //     },
            //     growth: 10,
            //     modes: [],
            //   },
            // },
          ],
        },
      ],
    },
    {
      name: "相变",
      items: [
        {
          name: "挥发",
          items: [
            {
              name: "污染水",

              detail: {
                resources: {
                  污染水: -30000 / 600,
                  污染氧: 30000 / 600,
                },
                modes: [],
              },
            },
          ],
        },
        {
          name: "融化",
          items: [
            {
              name: "浓盐冰",

              detail: {
                resources: {
                  浓盐冰: -1000,
                  浓盐水: 1000,
                },
                modes: [],
              },
            },
          ],
        },
      ],
    },
  ],
};

// 食物卡路里映射表 (1g对应卡路里值)
export const foodCalorieMap = {
  米虱糕: 1.7,
  米虱: 0.6,
  混合浆果派: 4.2,
  冰霜汉堡: 6,
  烘烤拟种: 1.5,
  羽叶果薯: 4,
  冰霜面包: 1.2,
  煎蛋卷: 2.8,
  烤海鲜: 1.6,
  烤肉串: 4,
  刺壳果烤串: 1.2,
  咖喱豆: 5,
  鱼肉卷: 4.2,
  炸肉块: 4,
  炸豆小吃: 5,
  蟹肉天妇罗: 4.2,
  帕库鱼片: 1,
  煎泥膏: 1.05,
  煎蘑菇: 2.8,
  果薯条: 5.4,
  浆果糕: 4,
  伽马泥膏: 1.05,
  汗甜玉米: 0.8,
  菌斑果: 0.8,
  炙烤刺果: 2,
  刺壳果: 0.8,
  雪莓: 0.8,
  海生菜: 0.4,
  肉: 1.6,
  软泥膏: 0.8,
  蘑菇: 2.4,
  蘑菇卷: 4.8,
  蛋奶酥煎饼: 3.6,
  干肉饼: 2.6,
  腌制米虱: 1.8,
  植物肉: 1.2,
  颚鱼片: 1,
  毛刺浆果: 1.6,
  蘑菇乳蛋饼: 6.4,
  生蛋: 1.6,
  浆果酿: 4.4,
  生蟹肉: 1,
  嫩肋排: 5,
  熏鱼: 2.8,
  爆米花: 2.8625,
  火椒面包: 4,
  麻婆豆腐: 4,
  海陆双拼: 6,
  沼泽欢愉: 2.24,
  沼泽甜菜心: 2.4,
  沼浆果冻: 1.84,
  豆腐: 3.6,
  漫花果: 0.325,
  烤虫果仁: 1.2,
  贫瘠虫果: 0.8,
  虫果果酱: 2.4,
  虫果: 0.25,
};

const dupe = data.items[0].items?.[0] as Item;
const category = data.items[0].name;
const modes = dupe.detail!.modes.map((mode) => {
  return new Map<string, number>(
    mode.options.map((option, index) => [option.name, index ? 0 : 100])
  );
});

export const initialSelections: Array<Selection> = [
  {
    item: dupe,
    count: 3,
    category,
    modes,
  },
];
