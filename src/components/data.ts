export interface Menu {
  title: string;
  items: Link[];
}

export interface Link {
  name: string;
  icon: string;
  iconFilter?: string;
  menu?: Menu;
  detail?: Detail;
}

export interface Detail {
  name: string;
  icon: string;
  iconFilter?: string;
  detail: DupeDetail | BuildingDetail | CreatureDetail | PlantDetail | TransDetail | GeyserDetail;
}

export interface DupeDetail {
  resources: ResourceMap;
  calorie?: string;
  power?: string;
  modes: Mode[];
}

export interface BuildingDetail {
  resources: ResourceMap;
  power: string;
  heat: string;
  modes: Mode[];
}

export interface CreatureDetail {
  resources: ResourceMap;
  life: string;
  modes: Mode[];
}

export interface PlantDetail {
  resources: ResourceMap;
  life: string;
  modes: Mode[];
}

export interface TransDetail {
  modes: Mode[];
}

export interface GeyserDetail {
  modes: Mode[];
}

export interface Mode {
  name: string;
  options: Option[];
}

export interface Option {
  name: string;
  type: "switch" | "slider";
  resources: ResourceMap;
}

export type ResourceMap = Record<string, string>;

export const API_BASE = process.env.TARO_ENV === 'h5' && process.env.NODE_ENV === 'development'
  ? ''
  : 'https://wycode.cn';

export const sharedMessage = {
  title: "oni产物计算器",
  path: "/pages/index/index",
  imageUrl: "https://wycode.cn/upload/image/oni/oni.png",
};
