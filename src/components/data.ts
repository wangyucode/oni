type Detail = {};

type Item = {
  name: string;
  icon: string;
  items: Array<Item>;
  detail?: Detail;
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
        { name: "复制人", icon: "dupe", items: [] },
        { name: "仿生人", icon: "bionic", items: [] },
      ],
    },
    { name: "Item 2", icon: "icon2", items: [] },
    { name: "Item 3", icon: "icon3", items: [] },
  ],
};
