import { Image, ImageProps } from "@nutui/nutui-react-taro";
import refine from "./refine.png";
import refineDisabled from "./refine-1.png";
import idea from "./idea.png";
import ideaDisabled from "./idea-1.png";
import rightArrow from "./right-arrow.png";

const icons = {
    refine,
    refineDisabled,
    idea,
    ideaDisabled,
    rightArrow,
}

export default function Icon(props: Partial<ImageProps> & { name: string }) {
    const src = icons[props.name] || itemIcons[props.name];
    return <Image {...props} src={src} mode="aspectFit" />;
}

export const itemIcons = {
    精炼: refine,
}