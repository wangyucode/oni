import { Text } from "@tarojs/components";

interface ModeErrorProps {
    modeName: string;
    optionValueMap: Map<string, number>;
}

export default function ModeError({ modeName, optionValueMap }: ModeErrorProps) {
    let message = '';
    let type = '';

    // 计算所有选项的总和
    const total = Array.from(optionValueMap.values()).reduce((sum, value) => sum + value, 0);

    // 根据总和设置错误消息
    if (total < 100) {
        message = `${modeName}的百分比调整总和小于100%`;
        type = 'warn';
    } else if (total > 100) {
        message = `${modeName}的百分比调整总和不能大于100%`;
        type = 'error';
    }

    if (!message) return null;
    return (
        <Text className={`mode-error ${type}`}>
            {message}
        </Text>
    );
}