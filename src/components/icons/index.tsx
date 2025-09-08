import { Image, ImageProps } from "@nutui/nutui-react-taro";
import refine from "./refine.png";
import refineDisabled from "./refine-1.png";
import idea from "./idea.png";
import ideaDisabled from "./idea-1.png";
import rightArrow from "./right-arrow.png";
import dupe from "./dupe.png";
import bionic from "./bionic.png";
import plus from "./plus.png";

import { useContext } from "react";
import { DataContext } from "../DataContext";

const icons = {
    refine,
    refineDisabled,
    idea,
    ideaDisabled,
    rightArrow,
    plus
}

export default function Icon(props: Partial<ImageProps> & { name: string }) {
    const { images } = useContext(DataContext);
    const src = icons[props.name] || itemIcons[props.name] || images[props.name];
    return <Image {...props} src={src} mode="aspectFit" />;
}

export const itemIcons = {
    复制人: dupe,
    仿生人: bionic,
    精炼: refine,
}