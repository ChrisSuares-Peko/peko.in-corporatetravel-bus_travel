import React from 'react';

import { Col, Flex, Row, Skeleton, Typography } from 'antd';

import ServicePlanRow from './ServicePlanRow';
import useGetPackageTableDetails from '../hooks/useGetPackageTableDetails';
import { tableData } from '../utils/TableData';

type Props = {};

const PlansCompareTable = (props: Props) => {
    const { individualPackages, groupPackages, isLoading } = useGetPackageTableDetails();
    if (isLoading) {
        return (
            <Row>
                <Col span={24}>
                    <Skeleton
                        paragraph={{ rows: 10 }}
                        className="py-5"
                        round
                        loading
                        title={false}
                        active
                    />
                </Col>
            </Row>
        );
    }
    return (
        <Row className="hidden sm:block">
            <Flex justify="center" className="my-5 mb-10">
                <Typography.Text className="text-xl font-medium">Compare Plans</Typography.Text>
            </Flex>
            <Col span={24} className="flex flex-col gap-10">
                <Row align="middle" gutter={30} className="flex-wrap">
                    <Col xs={24} sm={5} className="mb-4 sm:mb-0">
                        <Typography.Text className="text-lg font-medium">Services</Typography.Text>
                    </Col>
                    <Col xs={24} sm={5} className="mb-4 sm:mb-0">
                        <Typography.Text className="text-lg font-medium">
                            Individual Plans
                        </Typography.Text>
                    </Col>
                    <Col xs={24} sm={4} className="mb-4 sm:mb-0">
                        <Flex vertical className="items-center sm:items-start">
                            <Typography.Text className="text-base font-medium">
                                Basic
                            </Typography.Text>
                            <Typography.Text className="text-lg font-semibold">
                                FREE
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={24} sm={5} className="mb-4 sm:mb-0">
                        <Flex vertical className="items-center sm:items-start">
                            <Typography.Text className="text-base font-medium text-lightRed">
                                Standard
                            </Typography.Text>
                            <Typography.Text className="text-lg font-semibold">
                                AED {groupPackages?.Standard}
                            </Typography.Text>
                            <Typography.Text className="text-xs font-normal">
                                per month
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={24} sm={5} className="mb-4 sm:mb-0">
                        <Flex vertical className="items-center sm:items-start">
                            <Typography.Text className="text-base font-medium text-lightRed">
                                Premium
                            </Typography.Text>
                            <Typography.Text className="text-lg font-semibold">
                                AED {groupPackages?.Premium}
                            </Typography.Text>
                            <Typography.Text className="text-xs font-normal">
                                per month
                            </Typography.Text>
                        </Flex>
                    </Col>
                </Row>
                <ServicePlanRow data={tableData} price={individualPackages} />
            </Col>
        </Row>
    );
};

export default PlansCompareTable;
