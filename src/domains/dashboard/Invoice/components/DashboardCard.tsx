import React from 'react';

import { Flex, Statistic, Tooltip, Typography } from 'antd';
import CountUp from 'react-countup';
import { ReactSVG } from 'react-svg';

interface PriceInfoCardProps {
    bgColor: string;
    icon: any;
    title: string;
    value: string | number;
    currency: string;
    reference?: React.MutableRefObject<null>;
}
const DashboardCard = ({
    bgColor,
    icon,
    title,
    value,
    currency,
    reference,
}: PriceInfoCardProps) => {
    const { Text } = Typography;
    const formatter = (values: any) => (
        <CountUp end={values} separator="," decimals={values % 1 !== 0 ? 0 : 0} />
    );
    return (
        <Flex
            vertical
            ref={reference}
            className={`${bgColor} rounded-2xl py-4 xxl:py-5 xl:pl-6 md:pl-8 pr-4 flex-1 `}
            gap={16}
            style={{ backgroundColor: `${bgColor}` }}
        >
            <Flex className="w-8 h-8 bg-white rounded-full" align="center" justify="center">
                <ReactSVG src={icon} data-testid="icon-svg" />
            </Flex>
            <Flex vertical gap={3}>
                <Text className="text-base font-semibold sm:text-sm md:text-lg whitespace-nowrap sm:min-w-28">
                    <Flex className={currency !== '' ? 'gap-1' : ''}>
                        <Text className="text-xs font-normal md:text-sm">{currency}</Text>
                        <Statistic
                            data-testid="amount"
                            value={value}
                            // formatter={formatter}
                            // precision={2}
                            className="-mt-3 collector-dashboard"
                        />
                    </Flex>
                </Text>
                <Text className="text-xs font-normal md:text-sm sm:min-w-24">
                    <Tooltip title={title} className="sm:hidden">
                        {title}
                    </Tooltip>
                    <Text className="hidden sm:block">{title}</Text>
                </Text>
            </Flex>
        </Flex>
    );
};

export default DashboardCard;
