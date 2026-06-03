import React from 'react';

import { Flex, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

interface PriceInfoCardProps {
    bgColor: string;
    icon: any;
    title: string;
    value: string;
    currency: string;
    reference?: React.MutableRefObject<null>;
    isMobile?: boolean;
}
const PriceInfoCard = ({
    bgColor,
    icon,
    title,
    value,
    currency,
    reference,
    isMobile = false,
}: PriceInfoCardProps) => {
    const { Text } = Typography;
    if (isMobile) {
        return (
            <Flex
                ref={reference}
                align="center"
                className={`${bgColor} rounded-2xl py-5 lg:py-5 pl-4 md:pl-8 pr-4 flex-1 max-w-[50%]`}
                gap={8}
            >
                <Flex className="rounded-full bg-white w-7 h-7" align="center" justify="center">
                    {icon && <ReactSVG data-testid="icon-svg-mobile" src={icon} />}
                </Flex>
                <Flex vertical gap={3}>
                    <Text className="text-[0.65rem] font-medium md:text-sm text-nowrap sm:min-w-28">
                        {title}
                    </Text>
                    <Text className="text-[0.9rem] font-semibold sm:text-sm md:text-lg whitespace-nowrap sm:min-w-28">
                        {currency} {value}
                    </Text>
                </Flex>
            </Flex>
        );
    }
    return (
        <Flex
            vertical
            ref={reference}
            className={`${bgColor} rounded-2xl py-4 lg:py-5 pl-6 md:pl-8 pr-4 flex-1 md:max-w-[50%]`}
            gap={16}
        >
            <Flex className="w-8 h-8 bg-white rounded-full" align="center" justify="center">
                {icon && <ReactSVG data-testid="icon-svg" src={icon} />}
            </Flex>
            <Flex vertical gap={3}>
                <Text className="text-base font-semibold sm:text-sm md:text-lg whitespace-nowrap sm:min-w-28">
                    <Text className="text-xs font-normal md:text-sm">{currency}</Text> {value}
                </Text>
                <Text className="text-xs font-normal md:text-sm text-nowrap sm:min-w-28">
                    {title}
                </Text>
            </Flex>
        </Flex>
    );
};

export default PriceInfoCard;
