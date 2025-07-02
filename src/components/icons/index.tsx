import { Image, ImageProps } from "@nutui/nutui-react-taro";
import refine from "./refine.png";
import refineDisabled from "./refine-1.png";
import idea from "./idea.png";
import ideaDisabled from "./idea-1.png";
import rightArrow from "./right-arrow.png";
import dupe from "./dupe.png";
import bionic from "./bionic.png";

const icons = {
    refine,
    refineDisabled,
    idea,
    ideaDisabled,
    rightArrow,
    dupe,
    bionic,
}

export type IconName = keyof typeof icons | "";

export default function Icon(props: Partial<ImageProps> & { name: IconName }) {
    if (!props.name) return null;
    const src = icons[props.name]
    return <Image {...props} src={src} />;
}