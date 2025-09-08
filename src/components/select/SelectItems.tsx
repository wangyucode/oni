import { Grid } from "@nutui/nutui-react-taro";

import { Item } from "../data";
import Icon from "../icons";

interface SelectItemsProps {
    item: Item;
    handleSelect: (params: { index: number }) => void;
}

function SelectItems({ item, handleSelect }: SelectItemsProps) {
    return (
        <Grid className="select-items" columns={item.items && item.items.length >= 5 ? 5 : item.items?.length || 0} onClick={handleSelect}>
            {item.items?.map((item, index) => (
                <Grid.Item key={index} text={item.name}>
                    <Icon width={48} height={48} name={item.name} />
                </Grid.Item>
            ))}
        </Grid>
    );
}

export default SelectItems;