import React from 'react';

import { Card, Divider, Flex, Typography } from 'antd';

import PaymentDetails from './PaymentDetails';

interface AddonDetailsProps {
    title: string;
    description: string;
    rows: {
        column1: string;
        column2: string;
        column3: string;
    }[];
}
const AddonDetails = ({ title, description, rows }: AddonDetailsProps) => (
    <Flex vertical className="w-full lg:w-4/6">
        {/* <Col xs={24} className="mb-5">
            <Flex justify="space-between" align="center">
                <Typography.Title level={4}>Review Your Purchase</Typography.Title>
            </Flex>
        </Col> */}
        <Card
            className="p-3 border-0 sm:rounded-2xl sm:border border-borderGray md:p-7"
            styles={{ body: { padding: 0 } }}
        >
            <Flex gap={10}>
                <Typography.Title level={5}>{title}</Typography.Title>
                <Typography.Text className="mt-1 text-xs">{description}</Typography.Text>
            </Flex>
            <Divider />
            <Flex vertical className="w-full mt-5" gap={15}>
                {/* <PaymentDetails
                    title="Payroll subscription"
                    emp="30 Employees"
                    amount="AED 99 Monthly"
                    desc="Downgrade 01"
                     disc={`AED ${1}`}
                /> */}
                {rows.map((item, index) => (
                    <PaymentDetails
                        key={index}
                        column1={item.column1}
                        column2={item.column2}
                        column3={item.column3}
                    />
                ))}
            </Flex>

            {/* <Divider className="mt-4" />
            <Flex vertical className="w-full mt-5">
                <PaymentDetails
                    title="Next month subscription"
                    emp="30 Employees"
                    // disc={`AED ${1}`}
                    amount="AED 100 Monthly"
                />
            </Flex> */}
        </Card>
        {/* <Alert
            message="Note: Downgrading employees will be reflected after payment date of subscription on 19.06.2024"
            type="warning"
            showIcon
            className="mt-7"
        /> */}
    </Flex>
);

export default AddonDetails;
