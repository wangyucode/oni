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
  power?: number;
  heat?: number;
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
    {
      name: "建筑",
      items: [
        {
          name: "氧气菜单",
          items: [
            {
              name: "电解器",
              items: [],
              detail: {
                resources: { 水: -1000, 氧气: 888, 氢气: 112 },
                modes: [],
                power: 120,
                heat: 1000,
              },
            },
            {
              name: "铁锈脱氧机",
              items: [],
              detail: {
                resources: {
                  铁锈: -750,
                  盐: -250,
                  氧气: 570,
                  氯气: 30,
                  铁矿: 400,
                },
                modes: [],
                power: 60,
                heat: 1000,
              },
            },
            {
              name: "空气净化器",
              items: [],
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
                power: 5,
                heat: 0,
              },
            },
            {
              name: "碳素脱离器",
              items: [],
              detail: {
                resources: {
                  水: -1000,
                  二氧化碳: -300,
                  污染水: 1000,
                },
                modes: [],
                power: 120,
                heat: 1000,
              },
            },
          ],
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

/*
转换html到json，例如 <aside class="portable-infobox noexcerpt searchaux pi-background pi-theme-default pi-layout-default"><h2 class="pi-item pi-item-spacing pi-title" data-source="标题">电解器</h2><figure class="pi-item pi-media pi-image" data-source="图片">
	<a href="/zh/wiki/File:%E7%94%B5%E8%A7%A3%E5%99%A8.png" class="image image-thumbnail" title="电解器.png">
		<img src="/zh/images/0/04/%E7%94%B5%E8%A7%A3%E5%99%A8.png?cddabf" srcset="/zh/images/0/04/%E7%94%B5%E8%A7%A3%E5%99%A8.png?cddabf 1x, /zh/images/0/04/%E7%94%B5%E8%A7%A3%E5%99%A8.png?cddabf 2x" class="pi-image-thumbnail" alt="电解器.png" width="146" height="134">
		
	</a>
	<figcaption class="pi-item-spacing pi-caption">一端进水，另一端出来维持生命的氧气。</figcaption>
</figure><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="描述">
	<div class="pi-data-value pi-font">将<a href="/zh/wiki/%E6%B0%B4" title="水">水</a>转化为<a href="/zh/wiki/%E6%B0%A7%E6%B0%94" title="氧气">氧气</a>和<a href="/zh/wiki/%E6%B0%A2%E6%B0%94" title="氢气">氢气</a>。<br>当区域的气压达到最大时将会闲置。</div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="ID">
		<h3 class="pi-data-label pi-secondary-font">ID</h3>
	<div class="pi-data-value pi-font"><code>Electrolyzer</code></div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="尺寸">
		<h3 class="pi-data-label pi-secondary-font"><img alt="图标 尺寸.png" src="/zh/images/thumb/e/eb/%E5%9B%BE%E6%A0%87_%E5%B0%BA%E5%AF%B8.png/16px-%E5%9B%BE%E6%A0%87_%E5%B0%BA%E5%AF%B8.png?3542e7" decoding="async" loading="lazy" width="16" height="16" class="dark-invert" data-file-width="256" data-file-height="256"> 尺寸</h3>
	<div class="pi-data-value pi-font">宽 2 高 2</div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="旋转">
		<h3 class="pi-data-label pi-secondary-font"><img alt="图标 旋转.png" src="/zh/images/thumb/9/90/%E5%9B%BE%E6%A0%87_%E6%97%8B%E8%BD%AC.png/16px-%E5%9B%BE%E6%A0%87_%E6%97%8B%E8%BD%AC.png?25cc1f" decoding="async" loading="lazy" width="16" height="16" class="dark-invert" data-file-width="256" data-file-height="256"> 旋转</h3>
	<div class="pi-data-value pi-font">不可旋转</div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="装饰">
		<h3 class="pi-data-label pi-secondary-font"><img alt="图标 装饰.png" src="/zh/images/thumb/2/21/%E5%9B%BE%E6%A0%87_%E8%A3%85%E9%A5%B0.png/16px-%E5%9B%BE%E6%A0%87_%E8%A3%85%E9%A5%B0.png?62ea66" decoding="async" loading="lazy" width="16" height="21" data-file-width="211" data-file-height="279"> 装饰</h3>
	<div class="pi-data-value pi-font"><div class="mw-collapsible mw-collapsed mw-made-collapsible" data-expandtext="不同材料" style="width:100%"><button type="button" class="mw-collapsible-toggle mw-collapsible-toggle-default mw-collapsible-toggle-collapsed" aria-expanded="false" tabindex="0"><span class="mw-collapsible-text">不同材料</span></button>-10（范围：2 格）<div class="mw-collapsible-content" style="display: none;"><small style="display:grid;grid-template-columns:repeat(5, auto);justify-content:start"><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%9C%E7%9F%BF" title="铜矿"><img alt="铜矿" src="/zh/images/thumb/f/f8/%E9%93%9C%E7%9F%BF.png/34px-%E9%93%9C%E7%9F%BF.png?339acd" decoding="async" loading="lazy" width="34" height="32" data-file-width="144" data-file-height="136"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%9C%E7%9F%BF" title="铜矿">铜矿</a></span><div></div><div>：</div><div style="text-align: right">-9</div><div style="text-align: right">（+10%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E6%9C%B1%E7%A0%82%E7%9F%BF" title="朱砂矿"><img alt="朱砂矿" src="/zh/images/thumb/a/a8/%E6%9C%B1%E7%A0%82%E7%9F%BF.png/34px-%E6%9C%B1%E7%A0%82%E7%9F%BF.png?a43979" decoding="async" loading="lazy" width="34" height="32" data-file-width="141" data-file-height="134"></a></span>&nbsp;<a href="/zh/wiki/%E6%9C%B1%E7%A0%82%E7%9F%BF" title="朱砂矿">朱砂矿</a></span><div></div><div>：</div><div style="text-align: right">-10</div><div style="text-align: right">（+0%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%BB%84%E9%93%81%E7%9F%BF" title="黄铁矿"><img alt="黄铁矿" src="/zh/images/thumb/3/35/%E9%BB%84%E9%93%81%E7%9F%BF.png/34px-%E9%BB%84%E9%93%81%E7%9F%BF.png?a2b91d" decoding="async" loading="lazy" width="34" height="32" data-file-width="148" data-file-height="140"></a></span>&nbsp;<a href="/zh/wiki/%E9%BB%84%E9%93%81%E7%9F%BF" title="黄铁矿">黄铁矿</a></span><div></div><div>：</div><div style="text-align: right">-10</div><div style="text-align: right">（+0%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%9D%E7%9F%BF" title="铝矿"><img alt="铝矿" src="/zh/images/thumb/a/a0/%E9%93%9D%E7%9F%BF.png/33px-%E9%93%9D%E7%9F%BF.png?482c3c" decoding="async" loading="lazy" width="33" height="32" data-file-width="152" data-file-height="146"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%9D%E7%9F%BF" title="铝矿">铝矿</a></span><div></div><div>：</div><div style="text-align: right">-10</div><div style="text-align: right">（+0%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%81%E7%9F%BF" title="铁矿"><img alt="铁矿" src="/zh/images/thumb/5/57/%E9%93%81%E7%9F%BF.png/33px-%E9%93%81%E7%9F%BF.png?bcb293" decoding="async" loading="lazy" width="33" height="32" data-file-width="148" data-file-height="142"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%81%E7%9F%BF" title="铁矿">铁矿</a></span><div></div><div>：</div><div style="text-align: right">-10</div><div style="text-align: right">（+0%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%92%B4%E7%9F%BF" title="钴矿"><img alt="钴矿" src="/zh/images/thumb/c/c8/%E9%92%B4%E7%9F%BF.png/34px-%E9%92%B4%E7%9F%BF.png?3b3c90" decoding="async" loading="lazy" width="34" height="32" data-file-width="142" data-file-height="135"></a></span>&nbsp;<a href="/zh/wiki/%E9%92%B4%E7%9F%BF" title="钴矿">钴矿</a></span><div></div><div>：</div><div style="text-align: right">-10</div><div style="text-align: right">（+0%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%95%8D%E7%9F%BF" title="镍矿"><img alt="镍矿" src="/zh/images/thumb/7/72/%E9%95%8D%E7%9F%BF.png/29px-%E9%95%8D%E7%9F%BF.png?73af2a" decoding="async" loading="lazy" width="29" height="32" data-file-width="128" data-file-height="142"></a></span>&nbsp;<a href="/zh/wiki/%E9%95%8D%E7%9F%BF" title="镍矿">镍矿</a></span><div></div><div>：</div><div style="text-align: right">-10</div><div style="text-align: right">（+0%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%87%91%E6%B1%9E%E9%BD%90" title="金汞齐"><img alt="金汞齐" src="/zh/images/thumb/1/1a/%E9%87%91%E6%B1%9E%E9%BD%90.png/34px-%E9%87%91%E6%B1%9E%E9%BD%90.png?44f7e7" decoding="async" loading="lazy" width="34" height="32" data-file-width="146" data-file-height="138"></a></span>&nbsp;<a href="/zh/wiki/%E9%87%91%E6%B1%9E%E9%BD%90" title="金汞齐">金汞齐</a></span><div></div><div>：</div><div style="text-align: right">-9</div><div style="text-align: right">（+10%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%BB%91%E9%92%A8%E7%9F%BF" title="黑钨矿"><img alt="黑钨矿" src="/zh/images/thumb/9/98/%E9%BB%91%E9%92%A8%E7%9F%BF.png/34px-%E9%BB%91%E9%92%A8%E7%9F%BF.png?89c097" decoding="async" loading="lazy" width="34" height="32" data-file-width="158" data-file-height="150"></a></span>&nbsp;<a href="/zh/wiki/%E9%BB%91%E9%92%A8%E7%9F%BF" title="黑钨矿">黑钨矿</a></span><div></div><div>：</div><div style="text-align: right">-10</div><div style="text-align: right">（+0%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%B1" title="铱"><img alt="铱" src="/zh/images/thumb/6/6c/%E9%93%B1.png/29px-%E9%93%B1.png?7e8dfe" decoding="async" loading="lazy" width="29" height="32" data-file-width="124" data-file-height="136"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%B1" title="铱">铱</a></span><div></div><div>：</div><div style="text-align: right">-8</div><div style="text-align: right">（+20%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%80%E7%9F%BF" title="铀矿"><img alt="铀矿" src="/zh/images/thumb/9/96/%E9%93%80%E7%9F%BF.png/29px-%E9%93%80%E7%9F%BF.png?d6dffd" decoding="async" loading="lazy" width="29" height="32" data-file-width="140" data-file-height="152"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%80%E7%9F%BF" title="铀矿">铀矿</a></span><div></div><div>：</div><div style="text-align: right">-10</div><div style="text-align: right">（+0%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%92%A2" title="钢"><img alt="钢" src="/zh/images/thumb/8/86/%E9%92%A2.png/41px-%E9%92%A2.png?c944c4" decoding="async" loading="lazy" width="41" height="32" data-file-width="143" data-file-height="113"></a></span>&nbsp;<a href="/zh/wiki/%E9%92%A2" title="钢">钢</a></span><div></div><div>：</div><div style="text-align: right">-10</div><div style="text-align: right">（+0%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%8C" title="铌"><img alt="铌" src="/zh/images/thumb/9/94/%E9%93%8C.png/33px-%E9%93%8C.png?5387b5" decoding="async" loading="lazy" width="33" height="32" data-file-width="146" data-file-height="140"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%8C" title="铌">铌</a></span><div></div><div>：</div><div style="text-align: right">-5</div><div style="text-align: right">（+50%）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E5%AF%BC%E7%83%AD%E8%B4%A8" title="导热质"><img alt="导热质" src="/zh/images/thumb/7/76/%E5%AF%BC%E7%83%AD%E8%B4%A8.png/39px-%E5%AF%BC%E7%83%AD%E8%B4%A8.png?b928c9" decoding="async" loading="lazy" width="39" height="32" data-file-width="156" data-file-height="128"></a></span>&nbsp;<a href="/zh/wiki/%E5%AF%BC%E7%83%AD%E8%B4%A8" title="导热质">导热质</a></span><div></div><div>：</div><div style="text-align: right">-10</div><div style="text-align: right">（+0%）</div></small></div></div></div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="建筑血量">
		<h3 class="pi-data-label pi-secondary-font">建筑血量</h3>
	<div class="pi-data-value pi-font">30</div>
</div><section class="pi-item pi-group pi-border-color pi-collapse pi-collapse-open"><h2 class="pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background">效果</h2><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="电力">
		<h3 class="pi-data-label pi-secondary-font"><img alt="图标 电力.png" src="/zh/images/thumb/c/cd/%E5%9B%BE%E6%A0%87_%E7%94%B5%E5%8A%9B.png/16px-%E5%9B%BE%E6%A0%87_%E7%94%B5%E5%8A%9B.png?7431f4" decoding="async" loading="lazy" width="16" height="16" data-file-width="249" data-file-height="254"> 电力</h3>
	<div class="pi-data-value pi-font">消耗 120 瓦</div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="产热">
		<h3 class="pi-data-label pi-secondary-font"><img alt="图标 温度.png" src="/zh/images/thumb/7/72/%E5%9B%BE%E6%A0%87_%E6%B8%A9%E5%BA%A6.png/16px-%E5%9B%BE%E6%A0%87_%E6%B8%A9%E5%BA%A6.png?5febc6" decoding="async" loading="lazy" width="16" height="21" data-file-width="196" data-file-height="256"> <a href="/zh/wiki/%E8%AE%A1%E9%87%8F%E5%8D%95%E4%BD%8D#热量（Q）" title="计量单位">产热</a></h3>
	<div class="pi-data-value pi-font">1 千复制热/秒</div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="配方">
	<div class="pi-data-value pi-font">每秒：<wbr><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E6%B0%B4" title="水"><img alt="水" src="/zh/images/thumb/a/a9/%E6%B0%B4.png/31px-%E6%B0%B4.png?26c664" decoding="async" loading="lazy" width="31" height="32" data-file-width="108" data-file-height="113"></a></span>&nbsp;<a href="/zh/wiki/%E6%B0%B4" title="水">水</a></span> 1000 克<wbr>⇒<span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E6%B0%A7%E6%B0%94" title="氧气"><img alt="氧气" src="/zh/images/thumb/f/f9/%E6%B0%A7%E6%B0%94.png/29px-%E6%B0%A7%E6%B0%94.png?324fc0" decoding="async" loading="lazy" width="29" height="32" data-file-width="108" data-file-height="119"></a></span>&nbsp;<a href="/zh/wiki/%E6%B0%A7%E6%B0%94" title="氧气">氧气</a></span> 888 克 + <span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E6%B0%A2%E6%B0%94" title="氢气"><img alt="氢气" src="/zh/images/thumb/0/09/%E6%B0%A2%E6%B0%94.png/29px-%E6%B0%A2%E6%B0%94.png?5abd13" decoding="async" loading="lazy" width="29" height="32" data-file-width="108" data-file-height="119"></a></span>&nbsp;<a href="/zh/wiki/%E6%B0%A2%E6%B0%94" title="氢气">氢气</a></span> 112 克</div>
</div></section><section class="pi-item pi-group pi-border-color pi-collapse pi-collapse-open"><h2 class="pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background">建造</h2><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="类别">
		<h3 class="pi-data-label pi-secondary-font"><img alt="图标 工作 建造.png" src="/zh/images/thumb/c/c6/%E5%9B%BE%E6%A0%87_%E5%B7%A5%E4%BD%9C_%E5%BB%BA%E9%80%A0.png/16px-%E5%9B%BE%E6%A0%87_%E5%B7%A5%E4%BD%9C_%E5%BB%BA%E9%80%A0.png?86145d" decoding="async" loading="lazy" width="16" height="16" data-file-width="253" data-file-height="247"> 类别</h3>
	<div class="pi-data-value pi-font">氧气 &gt; 生产</div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="科技">
		<h3 class="pi-data-label pi-secondary-font"><img alt="高级研究.png" src="/zh/images/thumb/e/ec/%E9%AB%98%E7%BA%A7%E7%A0%94%E7%A9%B6.png/16px-%E9%AB%98%E7%BA%A7%E7%A0%94%E7%A9%B6.png?208b0a" decoding="async" loading="lazy" width="16" height="16" data-file-width="234" data-file-height="235"> <a href="/zh/wiki/%E7%A0%94%E7%A9%B6" title="研究">科技</a></h3>
	<div class="pi-data-value pi-font"><a href="/zh/wiki/%E6%8A%80%E6%9C%AF/%E7%A9%BA%E6%B0%94%E7%B3%BB%E7%BB%9F" title="技术/空气系统">空气系统</a></div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="基础建造时间">
		<h3 class="pi-data-label pi-secondary-font"><img alt="图标 时间.png" src="/zh/images/thumb/a/a8/%E5%9B%BE%E6%A0%87_%E6%97%B6%E9%97%B4.png/16px-%E5%9B%BE%E6%A0%87_%E6%97%B6%E9%97%B4.png?d6dee3" decoding="async" loading="lazy" width="16" height="16" class="dark-invert" data-file-width="256" data-file-height="256"> 建造时间</h3>
	<div class="pi-data-value pi-font">30 秒</div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="建筑材料">
		<h3 class="pi-data-label pi-secondary-font"><img alt="图标 材料.png" src="/zh/images/thumb/9/9e/%E5%9B%BE%E6%A0%87_%E6%9D%90%E6%96%99.png/16px-%E5%9B%BE%E6%A0%87_%E6%9D%90%E6%96%99.png?248b6a" decoding="async" loading="lazy" width="16" height="15" data-file-width="219" data-file-height="207"> 建筑材料</h3>
	<div class="pi-data-value pi-font"><a href="/zh/wiki/Category:%E9%87%91%E5%B1%9E%E7%9F%BF%E7%9F%B3" title="Category:金属矿石">金属矿石</a> 200 千克</div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="导热系数">
		<h3 class="pi-data-label pi-secondary-font">导热系数</h3>
	<div class="pi-data-value pi-font">1</div>
</div></section><section class="pi-item pi-group pi-border-color pi-collapse pi-collapse-open"><h2 class="pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background">工作条件</h2><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="过热">
		<h3 class="pi-data-label pi-secondary-font"><img alt="复制人 状态 升温.png" src="/zh/images/thumb/8/8f/%E5%A4%8D%E5%88%B6%E4%BA%BA_%E7%8A%B6%E6%80%81_%E5%8D%87%E6%B8%A9.png/16px-%E5%A4%8D%E5%88%B6%E4%BA%BA_%E7%8A%B6%E6%80%81_%E5%8D%87%E6%B8%A9.png?cdc376" decoding="async" loading="lazy" width="16" height="15" data-file-width="132" data-file-height="121"> 过热</h3>
	<div class="pi-data-value pi-font"><div class="mw-collapsible mw-collapsed mw-made-collapsible" data-expandtext="不同材料" style="width:100%"><button type="button" class="mw-collapsible-toggle mw-collapsible-toggle-default mw-collapsible-toggle-collapsed" aria-expanded="false" tabindex="0"><span class="mw-collapsible-text">不同材料</span></button>75°C<div class="mw-collapsible-content" style="display: none;"><small style="display:grid;grid-template-columns:repeat(5, auto);justify-content:start"><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%9C%E7%9F%BF" title="铜矿"><img alt="铜矿" src="/zh/images/thumb/f/f8/%E9%93%9C%E7%9F%BF.png/34px-%E9%93%9C%E7%9F%BF.png?339acd" decoding="async" loading="lazy" width="34" height="32" data-file-width="144" data-file-height="136"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%9C%E7%9F%BF" title="铜矿">铜矿</a></span><div></div><div>：</div><div style="text-align: right">75°C</div><div style="text-align: right">（+0°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E6%9C%B1%E7%A0%82%E7%9F%BF" title="朱砂矿"><img alt="朱砂矿" src="/zh/images/thumb/a/a8/%E6%9C%B1%E7%A0%82%E7%9F%BF.png/34px-%E6%9C%B1%E7%A0%82%E7%9F%BF.png?a43979" decoding="async" loading="lazy" width="34" height="32" data-file-width="141" data-file-height="134"></a></span>&nbsp;<a href="/zh/wiki/%E6%9C%B1%E7%A0%82%E7%9F%BF" title="朱砂矿">朱砂矿</a></span><div></div><div>：</div><div style="text-align: right">75°C</div><div style="text-align: right">（+0°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%BB%84%E9%93%81%E7%9F%BF" title="黄铁矿"><img alt="黄铁矿" src="/zh/images/thumb/3/35/%E9%BB%84%E9%93%81%E7%9F%BF.png/34px-%E9%BB%84%E9%93%81%E7%9F%BF.png?a2b91d" decoding="async" loading="lazy" width="34" height="32" data-file-width="148" data-file-height="140"></a></span>&nbsp;<a href="/zh/wiki/%E9%BB%84%E9%93%81%E7%9F%BF" title="黄铁矿">黄铁矿</a></span><div></div><div>：</div><div style="text-align: right">75°C</div><div style="text-align: right">（+0°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%9D%E7%9F%BF" title="铝矿"><img alt="铝矿" src="/zh/images/thumb/a/a0/%E9%93%9D%E7%9F%BF.png/33px-%E9%93%9D%E7%9F%BF.png?482c3c" decoding="async" loading="lazy" width="33" height="32" data-file-width="152" data-file-height="146"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%9D%E7%9F%BF" title="铝矿">铝矿</a></span><div></div><div>：</div><div style="text-align: right">75°C</div><div style="text-align: right">（+0°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%81%E7%9F%BF" title="铁矿"><img alt="铁矿" src="/zh/images/thumb/5/57/%E9%93%81%E7%9F%BF.png/33px-%E9%93%81%E7%9F%BF.png?bcb293" decoding="async" loading="lazy" width="33" height="32" data-file-width="148" data-file-height="142"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%81%E7%9F%BF" title="铁矿">铁矿</a></span><div></div><div>：</div><div style="text-align: right">75°C</div><div style="text-align: right">（+0°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%92%B4%E7%9F%BF" title="钴矿"><img alt="钴矿" src="/zh/images/thumb/c/c8/%E9%92%B4%E7%9F%BF.png/34px-%E9%92%B4%E7%9F%BF.png?3b3c90" decoding="async" loading="lazy" width="34" height="32" data-file-width="142" data-file-height="135"></a></span>&nbsp;<a href="/zh/wiki/%E9%92%B4%E7%9F%BF" title="钴矿">钴矿</a></span><div></div><div>：</div><div style="text-align: right">75°C</div><div style="text-align: right">（+0°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%95%8D%E7%9F%BF" title="镍矿"><img alt="镍矿" src="/zh/images/thumb/7/72/%E9%95%8D%E7%9F%BF.png/29px-%E9%95%8D%E7%9F%BF.png?73af2a" decoding="async" loading="lazy" width="29" height="32" data-file-width="128" data-file-height="142"></a></span>&nbsp;<a href="/zh/wiki/%E9%95%8D%E7%9F%BF" title="镍矿">镍矿</a></span><div></div><div>：</div><div style="text-align: right">75°C</div><div style="text-align: right">（+0°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%87%91%E6%B1%9E%E9%BD%90" title="金汞齐"><img alt="金汞齐" src="/zh/images/thumb/1/1a/%E9%87%91%E6%B1%9E%E9%BD%90.png/34px-%E9%87%91%E6%B1%9E%E9%BD%90.png?44f7e7" decoding="async" loading="lazy" width="34" height="32" data-file-width="146" data-file-height="138"></a></span>&nbsp;<a href="/zh/wiki/%E9%87%91%E6%B1%9E%E9%BD%90" title="金汞齐">金汞齐</a></span><div></div><div>：</div><div style="text-align: right">125°C</div><div style="text-align: right">（+50°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%BB%91%E9%92%A8%E7%9F%BF" title="黑钨矿"><img alt="黑钨矿" src="/zh/images/thumb/9/98/%E9%BB%91%E9%92%A8%E7%9F%BF.png/34px-%E9%BB%91%E9%92%A8%E7%9F%BF.png?89c097" decoding="async" loading="lazy" width="34" height="32" data-file-width="158" data-file-height="150"></a></span>&nbsp;<a href="/zh/wiki/%E9%BB%91%E9%92%A8%E7%9F%BF" title="黑钨矿">黑钨矿</a></span><div></div><div>：</div><div style="text-align: right">75°C</div><div style="text-align: right">（+0°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%B1" title="铱"><img alt="铱" src="/zh/images/thumb/6/6c/%E9%93%B1.png/29px-%E9%93%B1.png?7e8dfe" decoding="async" loading="lazy" width="29" height="32" data-file-width="124" data-file-height="136"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%B1" title="铱">铱</a></span><div></div><div>：</div><div style="text-align: right">575°C</div><div style="text-align: right">（+500°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%80%E7%9F%BF" title="铀矿"><img alt="铀矿" src="/zh/images/thumb/9/96/%E9%93%80%E7%9F%BF.png/29px-%E9%93%80%E7%9F%BF.png?d6dffd" decoding="async" loading="lazy" width="29" height="32" data-file-width="140" data-file-height="152"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%80%E7%9F%BF" title="铀矿">铀矿</a></span><div></div><div>：</div><div style="text-align: right">75°C</div><div style="text-align: right">（+0°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%92%A2" title="钢"><img alt="钢" src="/zh/images/thumb/8/86/%E9%92%A2.png/41px-%E9%92%A2.png?c944c4" decoding="async" loading="lazy" width="41" height="32" data-file-width="143" data-file-height="113"></a></span>&nbsp;<a href="/zh/wiki/%E9%92%A2" title="钢">钢</a></span><div></div><div>：</div><div style="text-align: right">275°C</div><div style="text-align: right">（+200°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E9%93%8C" title="铌"><img alt="铌" src="/zh/images/thumb/9/94/%E9%93%8C.png/33px-%E9%93%8C.png?5387b5" decoding="async" loading="lazy" width="33" height="32" data-file-width="146" data-file-height="140"></a></span>&nbsp;<a href="/zh/wiki/%E9%93%8C" title="铌">铌</a></span><div></div><div>：</div><div style="text-align: right">575°C</div><div style="text-align: right">（+500°C）</div><span class="nowrap"><span class="t-pic entity-link"><a href="/zh/wiki/%E5%AF%BC%E7%83%AD%E8%B4%A8" title="导热质"><img alt="导热质" src="/zh/images/thumb/7/76/%E5%AF%BC%E7%83%AD%E8%B4%A8.png/39px-%E5%AF%BC%E7%83%AD%E8%B4%A8.png?b928c9" decoding="async" loading="lazy" width="39" height="32" data-file-width="156" data-file-height="128"></a></span>&nbsp;<a href="/zh/wiki/%E5%AF%BC%E7%83%AD%E8%B4%A8" title="导热质">导热质</a></span><div></div><div>：</div><div style="text-align: right">975°C</div><div style="text-align: right">（+900°C）</div></small></div></div></div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="淹没">
		<h3 class="pi-data-label pi-secondary-font"><img alt="图标 淹没.png" src="/zh/images/thumb/8/8e/%E5%9B%BE%E6%A0%87_%E6%B7%B9%E6%B2%A1.png/16px-%E5%9B%BE%E6%A0%87_%E6%B7%B9%E6%B2%A1.png?2ddc14" decoding="async" loading="lazy" width="16" height="16" class="dark-invert" data-file-width="256" data-file-height="256"> <abbr title="淹没判定：元素默认质量（一般为满格质量）的 35%">淹没</abbr></h3>
	<div class="pi-data-value pi-font">淹没时无法运作</div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="掩埋">
		<h3 class="pi-data-label pi-secondary-font"><img alt="图标 掩埋.png" src="/zh/images/thumb/6/65/%E5%9B%BE%E6%A0%87_%E6%8E%A9%E5%9F%8B.png/16px-%E5%9B%BE%E6%A0%87_%E6%8E%A9%E5%9F%8B.png?2db6cf" decoding="async" loading="lazy" width="16" height="16" class="dark-invert" data-file-width="256" data-file-height="256"> 掩埋</h3>
	<div class="pi-data-value pi-font">掩埋时无法运作</div>
</div><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="可被蓄意破坏">
		<h3 class="pi-data-label pi-secondary-font"><abbr title="决定复制人压力过大时是否会破坏该建筑">可被毁坏</abbr></h3>
	<div class="pi-data-value pi-font">✖</div>
</div></section><section class="pi-item pi-group pi-border-color pi-collapse pi-collapse-open"><h2 class="pi-item pi-header pi-secondary-font pi-item-spacing pi-secondary-background">自动化</h2><div class="pi-item pi-data pi-item-spacing pi-border-color" data-source="自动化输入">
		<h3 class="pi-data-label pi-secondary-font"><img alt="自动化输入.png" src="/zh/images/thumb/a/a8/%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BE%93%E5%85%A5.png/16px-%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BE%93%E5%85%A5.png?7d1353" decoding="async" loading="lazy" width="16" height="16" data-file-width="256" data-file-height="256"> 自动化输入</h3>
	<div class="pi-data-value pi-font">启用/禁用<br><img alt="自动化输入绿色信号" src="/zh/images/thumb/0/04/%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BE%93%E5%85%A5%E7%BB%BF%E8%89%B2.png/16px-%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BE%93%E5%85%A5%E7%BB%BF%E8%89%B2.png?a3e6b7" decoding="async" loading="lazy" width="16" height="16" data-file-width="256" data-file-height="256"> <b><span class="ingame-logic_on">绿色信号</span></b>：启用建筑<br><img alt="自动化输入红色信号" src="/zh/images/thumb/7/71/%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BE%93%E5%85%A5%E7%BA%A2%E8%89%B2.png/16px-%E8%87%AA%E5%8A%A8%E5%8C%96%E8%BE%93%E5%85%A5%E7%BA%A2%E8%89%B2.png?1d83f1" decoding="async" loading="lazy" width="16" height="16" data-file-width="256" data-file-height="256"> <b><span class="ingame-logic_off">红色信号</span></b>：禁用建筑</div>
</div></section></aside> 
可以转换为{
              name: "电解器",
              items: [],
              detail: {
                resources: { 水: -1000, 氧气: 888, 氢气: 112 },
                modes: [],
                power: 120,
                heat: 1000,
              },
            } 
              同时输出图片地址，不含查询参数，例如 "电解器": "https://oxygennotincluded.wiki.gg/zh/images/0/04/%E7%94%B5%E8%A7%A3%E5%99%A8.png", 
              
              忽略示例中没有的字段，转换为简体中文，帮我转换：

 */
