import { ArrowLeft } from "@nutui/icons-react-taro";
import { Button } from "@nutui/nutui-react-taro";
import Taro from "@tarojs/taro";

export default function BackButton() {
    return (
        <Button className='bg-white w-fit' size='large' onClick={() => Taro.navigateBack()}>
            <ArrowLeft />
        </Button>
    )
}