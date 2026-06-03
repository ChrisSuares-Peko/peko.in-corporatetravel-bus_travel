import React from 'react';

import { Flex, Typography } from 'antd';

import { formatNumberWithLocalString } from '@utils/priceFormat';

import { calculateDiscount } from '../utils';

type Props = {
    discount: number;
    packagePrice: number;
};

const DiscountRow = ({ discount, packagePrice }: Props) => {
    const { discountPercentage } = calculateDiscount(packagePrice, discount);
    if (discountPercentage <= 0) {
        return null;
    }

    return (
        <Flex
            className="w-full h-full px-8 py-2 my-4 text-xs rounded-lg bg-lightGreen"
            justify="space-between"
            align="flex-start"
            vertical
            gap={24}
        >
            <Typography.Text className="font-medium text-green-700">
                You have saved {formatNumberWithLocalString(discountPercentage, 0, 0)}%
            </Typography.Text>
        </Flex>
    );
};

export default DiscountRow;
