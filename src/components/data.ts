export interface Menu {
  name: string;
  icon: string;
  file: string;
}

export const API_BASE = process.env.TARO_ENV === 'h5' && process.env.NODE_ENV === 'development'
  ? ''
  : 'https://wycode.cn';

export const sharedMessage = {
  title: "oni产物计算器",
  path: "/pages/index/index",
  imageUrl: "https://wycode.cn/upload/image/oni/oni.png",
};
