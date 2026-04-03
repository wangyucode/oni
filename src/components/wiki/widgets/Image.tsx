
import FilteredImage from "@/components/ui/FilteredImage";
import { ImageWidget, ORIGIN_BASE } from "@/types/data";
import { getFilter } from "@/utils/utils";

interface Props {
    data: ImageWidget['data']
}

export default function Image({ data }: Props) {
    return (
        <FilteredImage
          src={`${ORIGIN_BASE}/upload/oni/v3${data.src}`}
          iconFilter={getFilter(data.style)}
          style={{ width: 128, height: 128 }}
          mode='aspectFit'
        />
    );
}