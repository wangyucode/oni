import { useCallback, useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";

import { DataProvider, type DataContextValue } from "./components/DataContext";
import { API_BASE, Menu } from "./components/data";
import { UnitProvider } from "./components/UnitContext";

import "./app.scss";

function App(props) {
  const modelsByFileRef = useRef<Record<string, unknown | undefined>>({});
  const inflightByFileRef = useRef<Record<string, Promise<unknown> | undefined>>({});

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

  const getModel: DataContextValue["getModel"] = useCallback(async <T = unknown,>(file: string) => {
    const cached = modelsByFileRef.current[file];
    if (cached !== undefined) return cached as T;

    const inflight = inflightByFileRef.current[file];
    if (inflight) return inflight as Promise<T>;

    const requestPromise = requestJson<T>(`${API_BASE}/api/v1/yml/calculator/${file}`)
      .then((model) => {
        modelsByFileRef.current[file] = model;
        return model as T;
      })
      .finally(() => {
        delete inflightByFileRef.current[file];
      });

    inflightByFileRef.current[file] = requestPromise;
    return requestPromise as Promise<T>;
  }, []);

  const bootstrap = useCallback(async () => {
      await getModel<unknown>('index.yml');
  }, []);

  useEffect(() => {
    const appVersion = Taro.getStorageSync('appVersion');
    if (appVersion !== process.env.TARO_APP_VERSION) {
      Taro.clearStorageSync();
      Taro.setStorageSync('appVersion', process.env.TARO_APP_VERSION);
    }
    void bootstrap();
  }, []);

  return (
    <DataProvider
      value={{
        getModel
      }}
    >
      {/* <SelectionsProvider> */}
        <UnitProvider>
          {props.children}
        </UnitProvider>
      {/* </SelectionsProvider> */}
    </DataProvider>
  );
}

export default App;
