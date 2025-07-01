import { Image, ImageProps } from "@nutui/nutui-react-taro";
import refine from "./refine.png";
import refineDisabled from "./refine-1.png";
import idea from "./idea.png";
import ideaDisabled from "./idea-1.png";
import rightArrow from "./right-arrow.png";

export function IconRefine(props: Partial<ImageProps>) {
    props = {
        ...props,
        width: 24,
        height: 24,
        src: refine,
    };
    return <Image {...props} />;
}

export function IconRefineDisabled(props: Partial<ImageProps>) {
    props = {
        ...props,
        width: 24,
        height: 24,
        src: refineDisabled,
    };
    return <Image {...props} />;
}

export function IconIdea(props: Partial<ImageProps>) {
    props = {
        ...props,
        width: 24,
        height: 24,
        src: idea,
    };
    return <Image {...props} />;
}

export function IconIdeaDisabled(props: Partial<ImageProps>) {
    props = {
        ...props,
        width: 24,
        height: 24,
        src: ideaDisabled,
    };
    return <Image {...props} />;
}

export function IconRightArrow(props: Partial<ImageProps>) {
    props = {
        ...props,
        width: 12,
        height: 16,
        src: rightArrow,
    };
    return <Image {...props} />;
}