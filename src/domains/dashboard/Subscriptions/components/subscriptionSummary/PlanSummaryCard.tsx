import React from 'react';

import { Card, Col, Flex, Image, List, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

interface planProps {
    id?: string;
    name?: string;
    price?: string;
    validity?: string;
    features?: string;
    subscriptionType?: string;
}
const PlanSummaryCard = ({ id, name, validity, price, subscriptionType, features }: planProps) => {
    const { subscriptionDetails } = useAppSelector(state => state.reducer.subscription);
    const data = features?.split('\n');
    const isFeaturesValid = Array.isArray(data) && data.length > 0;
    // const formattedAmount = parseFloat(price || '0').toFixed();
    const formattedAmount = formatNumberWithLocalString(price);
    return (
        <Col xs={24} md={10} lg={12} xl={8}>
            <Card bordered className="pt-5 border-2 rounded-xl">
                <Image
                    preview={false}
                    src={subscriptionDetails?.data?.image}
                    className="max-w-24 max-h-24"
                />

                <Typography.Paragraph
                    className="my-5 text-textGrey"
                    style={{ fontSize: '1.3rem', fontWeight: 500 }}
                >
                    {subscriptionDetails?.data?.name}
                </Typography.Paragraph>
                <Typography.Title level={3} style={{ marginTop: '.5rem' }}>
                    {name}
                </Typography.Title>
                <Flex align="end" className="mt-4">
                    <Typography.Title level={2}>{`AED ${formattedAmount}`}</Typography.Title>
                </Flex>

                <List
                    size="large"
                    dataSource={isFeaturesValid ? data : []} // Use an empty array if features is invalid
                    renderItem={item => (
                        <List.Item className="bullet p-0" style={{ paddingLeft: '0' }}>
                            {item}
                        </List.Item>
                    )}
                    bordered={false}
                    split={false}
                    header={null}
                    className="bulleted-list text-textGrey"
                />
            </Card>
        </Col>
    );
};

export default PlanSummaryCard;
