export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/wiki/wiki",
    "pages/other-tools/other-tools",
    "pages/other-tools/oxygen/oxygen",
    "pages/other-tools/food/food",
    "pages/other-tools/rocket/rocket",
    "pages/about/about",
    "pages/about/log/log",
    "pages/about/support/support",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "ONI产物计算器",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#eee",
    selectedColor: "#BF7FA8",
    backgroundColor: "#3E4357",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/wiki/wiki",
        iconPath: "components/ui/icons/research-1.png",
        selectedIconPath: "components/ui/icons/research.png",
        text: "百科",
      },
      {
        pagePath: "pages/index/index",
        iconPath: "components/ui/icons/refine-1.png",
        selectedIconPath: "components/ui/icons/refine.png",
        text: "计算器",
      },
      {
        pagePath: "pages/other-tools/other-tools",
        iconPath: "components/ui/icons/home-1.png",
        selectedIconPath: "components/ui/icons/home.png",
        text: "其它工具",
      },
      {
        pagePath: "pages/about/about",
        iconPath: "components/ui/icons/idea-1.png",
        selectedIconPath: "components/ui/icons/idea.png",
        text: "关于",
      },
    ],
  },
  lazyCodeLoading: "requiredComponents",
  resizable: true,
});
