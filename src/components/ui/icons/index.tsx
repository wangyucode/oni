import { Image, ImageProps } from "@nutui/nutui-react-taro";
import refine from "@/components/ui/icons/refine.png";
import refineDisabled from "@/components/ui/icons/refine-1.png";
import idea from "@/components/ui/icons/idea.png";
import ideaDisabled from "@/components/ui/icons/idea-1.png";
import research from "@/components/ui/icons/research.png";
import researchDisabled from "@/components/ui/icons/research-1.png";
import rightArrow from "@/components/ui/icons/right-arrow.png";

const icons = {
    refine,
    refineDisabled,
    idea,
    ideaDisabled,
    research,
    researchDisabled,
    rightArrow,
}

export default function Icon(props: Partial<ImageProps> & { name: string }) {
    const src = icons[props.name];
    return <Image {...props} src={src} mode="aspectFit" />;
}