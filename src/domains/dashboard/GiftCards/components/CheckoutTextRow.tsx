import { Flex, Typography } from 'antd';

import { formatNumberWithLocalString } from '@utils/priceFormat';

type Props = {
    text: string;
    value: string | number;
    bold?: boolean;
};

const { Text } = Typography;

function CheckoutTextRow({ text, value, bold }: Props) {
    return (
        <Flex className="w-full justify-between  md:space-x-8">
            <Text
                className={`${bold ? 'text-zinc-900 text-base' : 'text-gray-500 text-sm'} font-normal`}
            >
                {text}
            </Text>
            <Text
                className={`${bold ? 'text-base font-semibold' : 'text-sm font-medium'} text-zinc-900`}
            >
                AED {formatNumberWithLocalString(value)}
            </Text>
        </Flex>
    );
}

export default CheckoutTextRow;
