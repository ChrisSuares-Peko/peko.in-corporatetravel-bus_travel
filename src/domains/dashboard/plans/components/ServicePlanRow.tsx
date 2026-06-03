/* eslint-disable no-nested-ternary */
import React from 'react';

import { Row, Col, Flex, Typography } from 'antd';

import { DynamicNumberObject } from '../types';

interface PlanStatus {
    key: string;
    service: string;
    services: React.ReactNode;
    individualPlan: React.ReactNode;
    basic: React.ReactNode;
    premium: React.ReactNode;
    standard: React.ReactNode;
}

interface ServicePlanRowProps {
    data: PlanStatus[];
    price?: DynamicNumberObject;
}

const ServicePlanRow: React.FC<ServicePlanRowProps> = ({ data, price }) => (
    <Flex vertical gap={40} className="overflow-x-hidden">
        {data.map((item, index) => {
            const servicePrice = price?.[item.service] ?? 0;
            return (
                <React.Fragment key={index}>
                    <Row align="middle" gutter={16} className="flex-wrap">
                        <Col xs={24} sm={5} className="mb-4 sm:mb-0">
                            {item.services}
                        </Col>
                        <Col xs={24} sm={5} className="mb-4 sm:mb-0">
                            <Flex className="h-full" align="center">
                                {index === 0 ? (
                                    <Typography.Text>Free</Typography.Text>
                                ) : servicePrice === 0 ? (
                                    <Typography.Text>No Plan</Typography.Text>
                                ) : (
                                    <Flex
                                        className="flex-col justify-end w-full h-full pb-2"
                                        align="flex-start"
                                        gap={2}
                                    >
                                        <Typography.Text className="text-lg font-medium">
                                            AED {servicePrice}
                                        </Typography.Text>
                                        <Typography.Text>per month</Typography.Text>
                                    </Flex>
                                )}
                            </Flex>
                        </Col>
                        <Col xs={24} sm={4} className="mb-4 sm:mb-0">
                            {item.basic}
                        </Col>
                        <Col xs={24} sm={5} className="mb-4 sm:mb-0">
                            {item.premium}
                        </Col>
                        <Col xs={24} sm={5} className="mb-4 sm:mb-0">
                            {item.standard}
                        </Col>
                    </Row>
                </React.Fragment>
            );
        })}
    </Flex>
);

export default ServicePlanRow;
