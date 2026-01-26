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
  life: string;
  drop?: ResourceMap;
  spawn?: number;
  modes: Mode[];
}

export interface PlantDetail {
  resources: ResourceMap;
  life?: string;
  modes?: Mode[];
}

export interface TransDetail {
  modes: Mode[];
}

export interface GeyserDetail {
  min: ResourceMap;
  max: ResourceMap;
}

export interface Mode {
  name: string;
  options: Option[];
}

export interface Option {
  name: string;
  resources: ResourceMap;
}

export interface Page {
    title: string; // 页面标题
    link: string; // 相对路径
    parent?: string; // 父页面link
    sections: Section[]; // div.content-container
}

export interface Section {
    id?: string; // [id]
    layout:
    'grid' | // .layout-grid
    'row' |  // .layout-horizontal
    'col'; // .layout-vertical
    widgets: Widgets[]; // .codex-*
}

type Widgets =
    SubtitleWidget | // class="codex-text subtitle"
    ImageWidget | // class="codex-image-container"
    BodyWidget | // class="codex-text body"
    TitleWidget | // class="codex-text title"
    DividerWidget | // class="codex-divider"
    SmallLinkWidget | // class="codex-indented-label-icon" ｜ class="codex-label-with-icon"
    SectionHeaderWidget | // class="codex-section-header"
    ConversionWidget | // class="codex-conversion-panel"
    LargeLinkWidget| // class="codex-label-large-icon"
    VideoWidget | // class="codex-video"
    GridWidget; // class="codex-element-grid"

type GridWidget = {
    type: 'grid';
    data: {
        items: Element[]; // a.element-card
    };
}

type Element = {
    link: string; // a.elemnt-card[href]
    icon: string; // img[src]
    style?: string; // div.large-icon-container[style]
    name: string; // span
}


type VideoWidget = {
    type: 'video';
    data: {
        src: string; // video > source[src]
    };
}

type ConversionWidget = {
    type: 'conversion';
    data: {
        from: ConversionItem[]; // div.conversion-items
        fabricator: ConversionItem; // div.conversion-item.fabricator
        to: ConversionItem[]; // div.conversion-items
    };
}

type ConversionItem = {
    link?: string; // .conversion-item[href]
    icon: string; // img[src]
    style?: string; // div.item-icon[style]
    name: string; // span
    value?: string; // span.item-subtext
}

type SectionHeaderWidget = {
    type: 'section-header';
    data: {
        text: string; // h3
    };
}

type TitleWidget = {
    type: 'title';
    data: {
        text: string; // p
    };
}

type SubtitleWidget = {
    type: 'subtitle';
    data: {
        text: string; // p
    };
}

type ImageWidget = {
    type: 'image';
    data: {
        src: string; // img[src]
        style?: string; // div.codex-image-container[style]
    };
}

type SmallLinkWidget = {
    type: 'small-link';
    data: {
        link: string; // [href]
        icon: string; // img[src]
        style?: string; // div.icon-container[style]
        text: string; // span
    };
}

type BodyWidget = {
    type: 'body';
    data: BodySegment[]
}

type BodySegment = {
    type:
    'text' |
    'link' | // a.codex-link[href]
    "bold"; // b
    data: {
        text: string;
        link?: string;
    };
}

type DividerWidget = {
    type: 'divider';
}

export type LargeLinkWidget = {
    type: 'large-link';
    data: {
        link: string; // a[href]
        icon?: string; // img[src]
        style?: string; // div.large-icon-container[style]
        text: string; // span.bodywhite
    };
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
