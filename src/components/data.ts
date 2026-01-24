export interface Menu {
  title: string;
  items: Link[];
}

export interface MenuLink {
  name: string;
  icon?: string;
  menu: Menu;
}

export interface DetailLink {
  name: string;
  icon?: string;
  detail: LinkDetail;
}

export type Link = MenuLink & DetailLink;

export type Images = Record<
  string,
  {
    file: string;
    filter?: string;
  }
>;

export type LinkDetail =
  | DupeDetail
  | BuildingDetail
  | CreatureDetail
  | PlantDetail
  | TransDetail
  | GeyserDetail;

export interface DupeDetail {
  resources: ResourceMap;
  calorie?: string;
  power?: string;
  modes: Mode[];
}

export interface BuildingDetail {
  resources?: ResourceMap;
  power?: string;
  heat?: string;
  modes?: Mode[];
}

export interface CreatureDetail {
  resources: ResourceMap;
  life: string;
  drop?: ResourceMap;
  spawn?: number;
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
  resources: ResourceMap;
}

export type ResourceMap = Record<string, string>;

export const ORIGIN_BASE = "https://wycode.cn";

export const API_BASE = process.env.TARO_ENV === 'h5' && process.env.NODE_ENV === 'development'
  ? ''
  : ORIGIN_BASE;

export const sharedMessage = {
  title: "oni产物计算器",
  path: "/pages/index/index",
  imageUrl: `${ORIGIN_BASE}/upload/image/oni/oni.png`,
};
