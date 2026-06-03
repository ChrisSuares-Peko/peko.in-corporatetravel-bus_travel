import React from 'react';

import { Card, Col, Flex, Typography } from 'antd';

interface planProps {
    id?: number | null;
    name?: string | null;
    price?: string | null;
    billingCycle?: string | null;
    features?: string | null;
    description?: string | null;
}
const PlanSummaryCard = ({ id, name, billingCycle, price, description, features }: planProps) => {
    const data = features?.split('\n ');
    const isFeaturesValid = Array.isArray(data) && data.length > 0;
    return (
        <Col xs={24} md={10} lg={12} xl={8}>
            <Card bordered className=" border-2 rounded-xl">
                <Flex vertical>
                    <Typography.Text className=" md:text-xl   text-lg font-normal">
                        {name}
                    </Typography.Text>

                    <Typography.Text className="text-gray-400 ">{description}</Typography.Text>
                </Flex>
                <Flex align="center">
                    <Typography.Text className="text-3xl font-normal mt-2">{price}</Typography.Text>
                    <Typography.Text className="text-sm font-normal ml-2">
                        {billingCycle}
                    </Typography.Text>
                </Flex>
                <Flex vertical gap={8} className="mt-2">
                    {isFeaturesValid ? (
                        data?.map((value, index) => (
                            <Typography.Paragraph
                                key={index}
                                className="text-xs font-normal leading-5  overflow-hidden text-ellipsis "
                                style={{ whiteSpace: 'pre-wrap' }}
                            >
                                {value}
                            </Typography.Paragraph>
                        ))
                    ) : (
                        <></>
                    )}
                </Flex>
            </Card>
        </Col>
    );
};

export default PlanSummaryCard;
