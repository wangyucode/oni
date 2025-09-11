export default defineAppConfig({
  pages: [
    "pages/index/index",
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
        pagePath: "pages/index/index",
        iconPath: "components/icons/refine-1.png",
        selectedIconPath: "components/icons/refine.png",
        text: "产物计算",
      },
      {
        pagePath: "pages/about/about",
        iconPath: "components/icons/idea-1.png",
        selectedIconPath: "components/icons/idea.png",
        text: "关于",
      },
    ],
  },
  lazyCodeLoading: "requiredComponents",
  resizable: true,
});
