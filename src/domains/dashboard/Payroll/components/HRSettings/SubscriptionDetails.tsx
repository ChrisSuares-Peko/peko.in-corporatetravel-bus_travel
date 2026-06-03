import React from 'react';

import { Alert, Card, Col, Divider, Flex, Row, Typography } from 'antd';

import PaymentDetails from './PaymentDetails';

const SubscriptionDetails = () => (
    <Row>
        <Col xs={24} className="mb-5">
            <Flex justify="space-between" align="center">
                <Typography.Title level={4}>Review Your Purchase</Typography.Title>
            </Flex>
        </Col>
        <Col md={24}>
            <Card
                className="sm:rounded-2xl border-0 sm:border border-borderGray h-full md:p-7 p-3"
                styles={{ body: { padding: 0 } }}
            >
                <Flex gap={10}>
                    <Typography.Title level={5}>Payroll</Typography.Title>
                    <Typography.Text className="text-xs mt-1">
                        30 Employees free & AED 1/Employee
                    </Typography.Text>
                </Flex>
                <Divider />
                <Flex vertical className="mt-5 w-full" gap={15}>
                    <PaymentDetails
                        title="Payroll subscription"
                        emp="30 Employees"
                        amount="AED 99 Monthly"
                    />
                    <PaymentDetails
                        title="Additional employees"
                        emp="30 Employees"
                        desc="Downgrade 01"
                        disc={`AED ${1}`}
                        amount="AED 99 Monthly"
                    />
                </Flex>

                <Divider className="mt-4" />
                <Flex vertical className="mt-5 w-full">
                    <PaymentDetails
                        title="Next month subscription"
                        emp="30 Employees"
                        disc={`AED ${1}`}
                        amount="AED 100 Monthly"
                    />
                </Flex>
            </Card>
        </Col>
        <Col md={24}>
            <Alert
                message="Note: Downgrading employees will be reflected after payment date of subscription on 19.06.2024"
                type="warning"
                showIcon
                className="mt-7"
            />
        </Col>
    </Row>
);

export default SubscriptionDetails;
