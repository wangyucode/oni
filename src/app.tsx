import { useEffect } from "react";
import { useDidShow, useDidHide } from "@tarojs/taro";
import { SelectionsProvider } from "./components/SelectionsContext";
// 全局样式
import "./app.scss";

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => { });

  // 对应 onShow
  useDidShow(() => { });

  // 对应 onHide
  useDidHide(() => { });

  return <SelectionsProvider>{props.children}</SelectionsProvider>;
}

export default App;
