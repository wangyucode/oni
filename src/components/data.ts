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
                  肉: 14000 / 200 / 600,
                  绒犸兔碎糜: 30000 / 600,
                  芦苇纤维: (5000 * (195 / 10)) / 200 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
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
                  肉: 14000 / 200 / 600,
                  绒犸兔碎糜: 30000 / 600,
                  皇犸兔头冠: (1000 * (195 / 10)) / 200 / 600,
                },
                modes: [
                  {
                    name: "食物",
                    options: [
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
              肉: 500 / 50 / 600,
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
                resources: { 生蟹肉: 4000 / 100 / 600, 沙子: 35000 / 600 },
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
              木材: (360000 * ((100 - 5 - 3) / 6)) / 100 / 600,
            },
            modes: [
              {
                name: "食物",
                options: [
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
                  肉: 1000 / 75 / 600,
                },
                modes: [],
              },
            },
            {
              name: "虫果果虫",
              detail: {
                resources: {
                  肉: 3000 / 150 / 600,
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
                  肉: 2000 / 150 / 600,
                  芦苇纤维: (2000 * ((150 - 5) / 8)) / 150 / 600,
                },
                modes: [],
              },
            },
            {
              name: "滑鳞壁虎",
              detail: {
                resources: {
                  磷矿: 9000 / 150 / 600,
                  肉: 2000 / 150 / 600,
                  塑料: (150000 * ((150 - 5) / 3)) / 150 / 600,
                },
                modes: [],
              },
            },
          ],
        },
        {
          name: "好吃哈奇",
          items: [
            {
              name: "好吃哈奇",
              detail: {
                resources: {
                  肉: 2000 / 100 / 600,
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
                resources: { 肉: 2000 / 100 / 600 },
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
                  肉: 2000 / 100 / 600,
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
                  肉: 2000 / 100 / 600,
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
          name: "霸王鹦",
          detail: {
            resources: {
              硬肉: 5000 / 200 / 600,
              浓盐冰: 64000 / 600,
            },
            modes: [],
          },
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
  肉: 1,
  烤肉串: 4,
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
