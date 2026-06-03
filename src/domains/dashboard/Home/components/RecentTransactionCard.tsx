import React from 'react';

import { Flex, Typography } from 'antd';

import { formatNumberWithLocalString } from '@utils/priceFormat';

interface RecentTransactionCardProps {
    title: string;
    time: string;
    date: string;
    value: number;
}

const RecentTransactionCard = ({ title, time, date, value }: RecentTransactionCardProps) => (
    <Flex
        justify="space-between"
        className="w-full px-4 py-3 pr-4 border border-solid rounded-md md:pr-0 md:border-none md:px-0 md:py-0"
    >
        <Flex vertical className="gap-2 ">
            <Typography.Text className="font-normal"> {title}</Typography.Text>
            <Flex gap={10}>
                <Typography.Text className="text-xs text-gray-500">{time}</Typography.Text>
                <Typography.Text className="text-xs text-gray-500">{date}</Typography.Text>
            </Flex>
        </Flex>
        <Typography.Text className="text-sm font-normal text-right md:text-base md:font-medium">
            {`AED ${formatNumberWithLocalString(value)}`}
        </Typography.Text>
    </Flex>
);

export default RecentTransactionCard;
