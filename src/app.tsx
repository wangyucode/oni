import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";

import { SelectionsProvider } from "./components/SelectionsContext";
import "./app.scss";
import { DataProvider } from "./components/DataContext";
import { FoodCalories, Item } from "./components/data";

function App(props) {
  const [items, setItems] = useState<Array<Item>>([]);
  const [plantNames, setPlantNames] = useState<Array<string>>([]);
  const [foodCalories, setFoodCalories] = useState<FoodCalories>({});
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    Taro.showLoading({
      title: '加载数据库...',
    });
    const appVersion = Taro.getStorageSync('appVersion');
    if (appVersion !== process.env.TARO_APP_VERSION) {
      Taro.clearStorageSync();
      Taro.setStorageSync('appVersion', process.env.TARO_APP_VERSION);
    }
    Taro.request({
      url: 'https://wycode.cn/api/v1/config?key=ONI_DATA',
      method: 'GET',
      success: (res) => {
        console.log('getItems', res);
        if (res.data.success) {
          setItems(res.data.payload.data.items);
        }
      },
      complete: () => {
        Taro.hideLoading();
      }
    });
    Taro.request({
      url: 'https://wycode.cn/api/v1/config?key=ONI_PLANT_NAMES',
      method: 'GET',
      success: (res) => {
        console.log('getPlantNames', res);
        if (res.data.success) {
          setPlantNames(res.data.payload.data);
        }
      }
    });
    Taro.request({
      url: 'https://wycode.cn/api/v1/config?key=ONI_FOOD_CALORIES',
      method: 'GET',
      success: (res) => {
        console.log('getFoodCalories', res);
        if (res.data.success) {
          setFoodCalories(res.data.payload.data);
        }
      }
    });
    Taro.request({
      url: 'https://wycode.cn/api/v1/config?key=ONI_IMAGES',
      method: 'GET',
      success: (res) => {
        console.log('getImages', res);
        if (res.data.success) {
          setImages(res.data.payload.data);
        }
      }
    });
  }, []);

  return (
    <DataProvider items={items} plantNames={plantNames} foodCalories={foodCalories} images={images}>
      <SelectionsProvider>
        {props.children}
      </SelectionsProvider>
    </DataProvider>
  );
}

export default App;
