import { IconName } from "./icons";

export type Detail = {};

export type Item = {
  name: string;
  icon: IconName;
  items: Array<Item>;
  detail?: Detail;
  parent?: Item;
};

export type Data = {
  items: Array<Item>;
};

export const data: Data = {
  items: [
    {
      name: "复制人/仿生人",
      icon: "",
      items: [
        { name: "复制人", icon: "dupe", items: [], detail: {} },
        { name: "仿生人", icon: "bionic", items: [], detail: {} },
      ],
    },
  ],
};
