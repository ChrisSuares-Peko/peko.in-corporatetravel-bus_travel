import React from 'react';

import { Col, Flex, Typography } from 'antd';

const PaymentHeader = () => (
    <Col xs={24} className="mb-8">
        <Flex justify="space-between" align="center">
            <Typography.Title level={4}>Review your payment</Typography.Title>
        </Flex>
    </Col>
);

export default PaymentHeader;
