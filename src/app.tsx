import { useEffect, useState } from "react";
import Taro from "@tarojs/taro";

import { SelectionsProvider } from "./components/SelectionsContext";
import { DataProvider } from "./components/DataContext";
import { FoodCalories, Item, API_BASE, Menu } from "./components/data";
import { UnitProvider } from "./components/UnitContext";

import "./app.scss";

function App(props) {
  const [items, setItems] = useState<Array<Item>>([]);
  const [plantNames, setPlantNames] = useState<Array<string>>([]);
  const [foodCalories, setFoodCalories] = useState<FoodCalories>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [menus, setMenus] = useState<Array<Menu>>([]);

  function initItemModes(item: Item) {
    if (item.detail) {
      if (item.detail.modes.length === 0) {
        item.detail.modes = [{
          name: '效率',
          options: [{
            name: '效率',
            resources: {}
          }]
        }]
      }
    } else if (item.items) {
      item.items.forEach(initItemModes);
    }
  }

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
      url: `${API_BASE}/api/v1/config?key=ONI_DATA`,
      method: 'GET',
      success: (res) => {
        console.log('getItems', res);
        if (res.data.success) {
          res.data.payload.data.items.forEach(initItemModes);
          setItems(res.data.payload.data.items);
        }
      },
      complete: () => {
        Taro.hideLoading();
      }
    });
    Taro.request({
      url: `${API_BASE}/api/v1/config?key=ONI_PLANT_NAMES`,
      method: 'GET',
      success: (res) => {
        console.log('getPlantNames', res);
        if (res.data.success) {
          setPlantNames(res.data.payload.data);
        }
      }
    });
    Taro.request({
      url: `${API_BASE}/api/v1/config?key=ONI_FOOD_CALORIES`,
      method: 'GET',
      success: (res) => {
        console.log('getFoodCalories', res);
        if (res.data.success) {
          setFoodCalories(res.data.payload.data);
        }
      }
    });
    Taro.request({
      url: `${API_BASE}/api/v1/config?key=ONI_IMAGES`,
      method: 'GET',
      success: (res) => {
        console.log('getImages', res);
        if (res.data.success) {
          setImages(res.data.payload.data);
        }
      }
    });
    Taro.request({
      url: `${API_BASE}/api/v1/yml/calculator/menu.yml`,
      header: {
        'Accept': 'application/json'
      },
      method: 'GET',
      success: (res) => {
        console.log('getMenus', res);
        if (res.data.success) {
          setMenus(res.data.payload);
        }
      }
    });
  }, []);

  return (
    <DataProvider items={items} plantNames={plantNames} foodCalories={foodCalories} images={images} menus={menus}>
      <SelectionsProvider>
        <UnitProvider>
          {props.children}
        </UnitProvider>
      </SelectionsProvider>
    </DataProvider>
  );
}

export default App;
