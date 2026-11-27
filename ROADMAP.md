# ONI 产物计算器重构与升级路线图

> 协作方式：架构拆解与验收由主控负责，独立开发/调研任务通过 `run-shell` MCP 转包给 **Codex CLI** 执行。

## 已确认技术决策

1. **前端技术栈**：保留现有 **Taro + React** 方案，升级 Taro 与京东组件库（NutUI React Taro）至最新版。
2. **游戏数据与静态资源**：先搭建 **Wiki 数据提取管线**；静态图片**继续托管在自有服务器（暂不迁移 OSS/COS）**，统一做图片压缩优化。
3. **线性规划计算器**：延后至后续独立 Session 推进，当前仅在路线图中保留规划。
4. **目标平台**：以微信小程序为核心发布平台。H5 仅用于本地开发预览与自动化验证，不再部署到线上，也不做 PC 端宽屏适配。

---

## Phase 1：升级 Taro 与 NutUI 至最新版（已完成）

- [x] 将所有 `@tarojs/*`、`babel-preset-taro`、`eslint-config-taro` 统一升级并对齐至 `4.3.3`（原 `4.1.9` / `4.1.11`）
- [x] 将 `@nutui/nutui-react-taro` 升级至 `4.0.0`（原 `^3.0.18`）、`@nutui/icons-react-taro` 升级至 `4.1.1`（原 `^3.0.1`），并移除源码未使用的 `@nutui/nutui-react`
- [x] 验证 NutUI v4 按需加载路径（`dist/es/packages/<name>/style`）、主题变量 `--nutui-color-primary` 及全部 12 个已用组件类型兼容
- [x] 验收 `pnpm run lint`（0 error）、`pnpm exec tsc --noEmit`（无升级引入报错）、`taro build --type weapp`（成功，产物 `dist/weapp` 共 `1.0M`）、`taro build --type h5`（成功）
- [x] 移除 GitHub Actions / Crane 线上部署，H5 改用根路径进行本地预览，保留本地 `/api` 代理与 H5 构建命令

---

## Phase 2：Wiki 游戏数据管线与静态图片压缩（下一 Session）

- [ ] 在 Mac 安装《缺氧》游戏，定位 `Assembly-CSharp.dll`、本地化 `.po` 与贴图资源路径
- [ ] 审计前后端现有 Wiki 数据结构（`src/contexts/WikiContext.tsx`、`src/pages/wiki/`、`src/components/wiki/` 及后端接口），定义可版本化的统一 Wiki Schema
- [ ] 搭建「游戏导出（反编译或轻量导出 Mod）→ 清洗校验 → Diff → 一键上传服务器」工作流
- [ ] 对现有服务器静态图片做批量压缩（如 WebP / 无损压缩），优化加载体验与流量占用

---

## Phase 3：线性规划（LP）核心计算器（后续 Session）

- [ ] 基于 Phase 2 游戏数据构建统一的物质/能源转换节点表（建筑、小动物、植物、复制人等）
- [ ] 引入轻量纯 TS 线性规划求解器（如 `yalps`），实现小程序本地实时求解：
  - 节点双模式：**固定值** / **待求解（允许小数）**
  - 资源三约束：**自由不限** / **自给自足（≥ 0）** / **完全消耗（= 0）**
- [ ] 重构计算器交互页面并清理可替代的旧汇总计算模块

---

## Handoff（Phase 1 → Phase 2 交接）

- **本地仓库**：`/Users/wayne/code/oni`（当前分支 `master`，改动未 commit，含 `package.json`、`pnpm-lock.yaml`、`ROADMAP.md`；注意远端 `origin/dev` 另有 1 个广告位相关提交 `02ecd60`）
- **Phase 1 成果**：Taro 全面对齐至 `4.3.3`，NutUI 升级至 `4.0.0` / Icons `4.1.1`，小程序与 H5 构建均通过（`dist/weapp` 总大小 `1.0M`）。
- **人工确认项（进入 Phase 2 前建议顺手做）**：
  1. 用微信开发者工具打开 `/Users/wayne/code/oni`（或 `dist/weapp`）真机/模拟器目视抽查页面样式（尤其是 `InputNumber`、`Collapse`、`Popup`、`Radio` 在 NutUI v4 下的外观与间距）。
  2. 确认无误后在本地提交/合并变更。
  3. 留意 `src/pages/other-tools/food/food.tsx:275` 有一处原有未使用参数 `preferredMachine`（`tsc` 报 `TS6133`），以及 NutUI v4 `InputNumber` 的一条无害 `postcss-calc` 压缩 warning（不阻断构建）。
- **下一 Session 启动入口**：直接读取 `/Users/wayne/code/oni/ROADMAP.md`，从 **Phase 2** 开始——先审计 `src/contexts/WikiContext.tsx`、`src/pages/wiki/` 与对应后端 Wiki 数据结构，再对接 Mac 本机已安装的《缺氧》游戏目录搭建 Wiki 数据提取与图片压缩管线。
