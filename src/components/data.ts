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
                heat: 0,
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
                power: 480,
                heat: 8000,
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
                power: 240,
                heat: 16000,
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
                resources: {
                  粘渣油: -80000 / 100,
                  水: -200000 / 100,
                  齿轮膏: 80000 / 100,
                  污染水: 200000 / 100,
                },
                modes: [],
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
          name: "好吃哈奇",
          items: [
            {
              name: "好吃哈奇",

              detail: {
                resources: {
                  肉: 300 / 600,
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
                        name: "粘土",
                        resources: {
                          粘土: -140000 / 600,
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
                        name: "砂岩",
                        resources: {
                          砂岩: -140000 / 600,
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
                    ],
                  },
                ],
              },
            },
            {
              name: "草质哈奇",
              detail: {
                resources: { 肉: 300 / 600 },
                modes: [
                  {
                    name: "食物",
                    options: [
                      {
                        name: "泥土",
                        resources: {
                          沙子: -140000 / 600,
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
                          泥土: -140000 / 600,
                          煤炭: 140000 / 600,
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
                  肉: 300 / 600,
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
                        name: "花岗岩",
                        resources: {
                          花岗岩: -140000 / 600,
                          煤炭: 70000 / 600,
                        },
                      },
                      {
                        name: "火成岩",
                        resources: {
                          藻类: -140000 / 600,
                          煤炭: 70000 / 600,
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
              硬肉: ((Math.floor((200 - 5) / 6) * 5000) / 200 - 500) / 600,
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
