import { useCallback, useEffect, useState } from "react";
import Taro from "@tarojs/taro";

import { DataProvider } from "./components/DataContext";
import { API_BASE, Menu } from "./components/data";
import { UnitProvider } from "./components/UnitContext";

import "./app.scss";

function App(props) {
  const [data, setData] = useState<Menu | null>(null);

  async function requestJson<T>(url: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      Taro.request({
        url,
        header: {
          Accept: "application/json",
        },
        method: "GET",
        success: (res) => {
          if (!res?.data?.success) {
            reject(new Error(res?.data?.message || "Request failed"));
            return;
          }
          resolve(res.data.payload as T);
        },
        fail: (err) => {
          reject(new Error(err?.errMsg || "Request failed"));
        },
      });
    });
  }

  const fetchData = useCallback(async () => {
    try {
      const payload = await requestJson<Menu>(`${API_BASE}/api/v1/yml/calculator/index.yml`);
      setData(payload);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    const appVersion = Taro.getStorageSync('appVersion');
    if (appVersion !== process.env.TARO_APP_VERSION) {
      Taro.clearStorageSync();
      Taro.setStorageSync('appVersion', process.env.TARO_APP_VERSION);
    }
    fetchData();
  }, [fetchData]);

  return (
    <DataProvider value={data}>
      {/* <SelectionsProvider> */}
        <UnitProvider>
          {props.children}
        </UnitProvider>
      {/* </SelectionsProvider> */}
    </DataProvider>
  );
}

export default App;
