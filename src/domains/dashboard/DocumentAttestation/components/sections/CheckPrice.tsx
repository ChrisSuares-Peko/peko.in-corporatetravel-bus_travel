import React from 'react';

import { Card, Flex, Typography } from 'antd';

import { formatNumberWithLocalString } from '@utils/priceFormat';

const { Title } = Typography;

type props = {
    data: {
        price: number;
        actualPrice: number;
    };
    issuedCountry?: string;
};
const CheckPrice = ({ data, issuedCountry }: props) => {
    const { actualPrice, price } = data;

    const savedPrice = actualPrice - price;
    return (
        <Card size="small" className="p-2 w-full h-auto  bg-slate-100 md:bg-white rounded-xl">
            <Flex vertical gap={22}>
                <Flex vertical>
                    <Title level={5}>Issued Country</Title>
                    <Typography.Text className="text-textGrey">{issuedCountry}</Typography.Text>
                </Flex>
                <Flex vertical>
                    <Title level={5}>Submission Country</Title>
                    <Typography.Text className="text-textGrey">AE</Typography.Text>
                </Flex>
                <Flex vertical gap={8}>
                    <Title level={5}>Amount</Title>
                    <Typography.Text className="text-lg font-semibold">
                        AED {formatNumberWithLocalString(data.price)}
                    </Typography.Text>
                    <Flex justify="space-between">
                        <Typography.Text className="text-textGrey">
                            Actual Price AED {formatNumberWithLocalString(data.actualPrice)}
                        </Typography.Text>
                        {savedPrice < 0 && (
                            <Typography.Text className="text-textGreenTitle">
                                You saved AED {formatNumberWithLocalString(savedPrice)}
                            </Typography.Text>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
};

export default CheckPrice;
