import { useCallback, useEffect, useRef, useState } from "react";
import Taro from "@tarojs/taro";

import { SelectionsProvider } from "./components/SelectionsContext";
import { DataProvider } from "./components/DataContext";
import { FoodCalories, Item, API_BASE, Menu } from "./components/data";
import { UnitProvider } from "./components/UnitContext";
import { CalculatorGridModel } from "./components/DataContext";

import "./app.scss";

function App(props) {
  const [items, setItems] = useState<Array<Item>>([]);
  const [plantNames, setPlantNames] = useState<Array<string>>([]);
  const [foodCalories, setFoodCalories] = useState<FoodCalories>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [menus, setMenus] = useState<Array<Menu>>([]);
  const modelsByFileRef = useRef<Record<string, CalculatorGridModel | undefined>>({});
  const inflightByFileRef = useRef<Record<string, Promise<CalculatorGridModel> | undefined>>({});

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

  const getMenuModel = useCallback(async (file: string) => {
    const cached = modelsByFileRef.current[file];
    if (cached) return cached;

    const inflight = inflightByFileRef.current[file];
    if (inflight) return inflight;

    const requestPromise = requestJson<CalculatorGridModel>(`${API_BASE}/api/v1/yml/calculator/${file}`)
      .then((model) => {
        modelsByFileRef.current[file] = model;
        return model;
      })
      .finally(() => {
        delete inflightByFileRef.current[file];
      });

    inflightByFileRef.current[file] = requestPromise;
    return requestPromise;
  }, []);

  const bootstrap = useCallback(async () => {
    try {
      const nextMenus = await requestJson<Array<Menu>>(`${API_BASE}/api/v1/yml/calculator/menu.yml`);
      setMenus(nextMenus);
    } catch (e: any) {
      setMenus([]);
    }
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
        items,
        plantNames,
        foodCalories,
        images,
        menus,
        getMenuModel,
      }}
    >
      <SelectionsProvider>
        <UnitProvider>
          {props.children}
        </UnitProvider>
      </SelectionsProvider>
    </DataProvider>
  );
}

export default App;
