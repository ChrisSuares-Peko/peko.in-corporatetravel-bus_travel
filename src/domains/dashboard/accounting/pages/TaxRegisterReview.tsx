import React from 'react';

import { Button, Flex, Row, Typography, Grid, Col, Card } from 'antd';
import { Content } from 'antd/es/layout/layout';

import { useAppSelector } from '@src/hooks/store';

import useForm from '../hooks/useForm';

const { useBreakpoint } = Grid;

const TaxRegisterReview: React.FC = () => {
    const screens = useBreakpoint();
    const { formDetails } = useAppSelector(state => state.reducer.accounting);
    const { handleSubmission } = useForm();
    return (
        <Content>
            <Flex vertical gap={8}>
                <Flex justify="space-between" className="mb-14 " align="center">
                    <Typography.Text className=" font-medium text-lg sm:text-xl">
                        Review your application
                    </Typography.Text>
                </Flex>
            </Flex>

            <Card>
                <Row>
                    <Col xs={24}>
                        {' '}
                        <Flex>
                            <Typography.Text className="text-base font-medium">
                                Your Information{' '}
                            </Typography.Text>
                            {/* <Typography.Text className="text-lightRed ml-2">Edit</Typography.Text> */}
                        </Flex>
                    </Col>
                </Row>
                <Row gutter={[5, 25]} className="mt-6">
                    {/* <Col xs={12} lg={6}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Copy of Trade License{' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                18047339{' '}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={12} lg={6}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Passport Copy{' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                16/10/2023{' '}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={12} lg={6}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Emirates ID{' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                18047339{' '}
                            </Typography.Text>
                        </Flex>
                    </Col> */}
                    <Col xs={12} lg={5}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Authorized Contact Person{' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                {formDetails.contactPerson}{' '}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    {/* <Col xs={12} lg={6}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                MOA & (AOA){' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                Peko Payments LLC{' '}
                            </Typography.Text>
                        </Flex>
                    </Col> */}
                    <Col xs={12} lg={5}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Company Name{' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                {formDetails.companyName}{' '}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={12} lg={5}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Email ID{' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                {formDetails.email}{' '}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={12} lg={4}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Corporate Tax Period{' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                {`${formDetails.startMonth} - ${formDetails.endMonth}`}{' '}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={12} lg={4}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Mobile Number{' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                {formDetails.phoneNumber}{' '}
                            </Typography.Text>
                        </Flex>
                    </Col>
                </Row>
            </Card>
            <Button type="primary" danger onClick={handleSubmission} className="mt-3">
                Submit
            </Button>
        </Content>
    );
};

export default TaxRegisterReview;
