import { Button, Popup } from "@nutui/nutui-react-taro";

interface SelectProps {
    select: string;
    onClose: () => void;
}

interface SelectOption {
    options: Array<SelectOption>;
    name: string;
    icon: string;
    detail?: {
    }
}

export default function Select({ select, onClose }: SelectProps) {

    return (
        <Popup
            visible={!!select}
            position="bottom"
            title={select}
            left={<Button>返回</Button>}
            onClose={onClose}
            closeable>

        </Popup>
    );
}