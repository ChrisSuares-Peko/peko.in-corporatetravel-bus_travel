import React from 'react';

import { Badge, Card, Col, Divider, Flex, Image, Row, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import { useAppSelector } from '@src/hooks/store';

import ClockSVG from '../assets/icons/ClockCircle.svg';
import TicketSVG from '../assets/icons/ic_ticket.svg';
import { retrieveAirlineName } from '../utils/airlineData';
import { formattedDateOnly, formattedTimeOnly } from '../utils/dateTime';

type Props = {};

const PaymentSuccessCard = (props: Props) => {
    const airlineData = useAppSelector(state => state.reducer.airline.selectedAirline);
    return (
        <Col className="mb-5" span={24}>
            <Card className="border-0 rounded-3xl" bodyStyle={{ padding: '4px' }}>
                <Row justify="center" align="middle">
                    <div
                        style={{
                            position: 'absolute',
                            top: '1%',
                            left: '50%',
                            transform: 'translate(-50%,-50%)',
                            width: '100%',
                            height: '60px',
                        }}
                        className="bg-red-50 rounded-t-3xl"
                    >
                        <Col
                            sm={8}
                            md={6}
                            lg={4}
                            className="border-0 rounded-2xl flex items-center justify-center bg-red_25 mt-8"
                        >
                            <Image preview={false} width={100} alt={airlineData.onPoint} src="" />
                            <Typography.Text>
                                {retrieveAirlineName(airlineData.flightCode)}
                            </Typography.Text>
                        </Col>
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '75%',
                            transform: 'translate(-50%,-90%)',
                            width: '70px',
                            height: '60px',
                            borderRadius: '50%',
                        }}
                        className="bg-white"
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: 10,
                            left: '92%',
                            // width: '10%',
                            transform: 'translate(-50%,-80%)',
                        }}
                        className="bg-orange-50 px-3 w-fit rounded-3xl text-red-500"
                    >
                        {airlineData.flightClass} Class
                    </div>
                    <Col md={16} lg={14} className="py-7 px-6">
                        <Row justify="space-evenly">
                            <Col span={8} className="flex flex-col items-center gap-1">
                                <Typography.Text className="text-gray-400 text-base font-normal">
                                    Depart
                                </Typography.Text>
                                <Typography.Text className="font-bold text-2xl mt-2">
                                    {formattedTimeOnly(new Date(airlineData.depart.datetime))}
                                </Typography.Text>
                                <Typography.Text className="text-base font-normal text-center">
                                    {formattedDateOnly(new Date(airlineData.depart.datetime))}
                                </Typography.Text>
                            </Col>
                            <Col span={8} className="flex flex-col items-center justify-center">
                                <Divider
                                    dashed
                                    style={{
                                        borderColor: 'red',
                                        borderTopStyle: 'dashed',
                                        margin: 2,
                                    }}
                                >
                                    <Badge size="default" count={airlineData.flightDuration} />
                                </Divider>
                                <Typography.Text className="text-gray-500 text-base">
                                    {airlineData.stopCount} stop
                                </Typography.Text>
                            </Col>
                            <Col span={8} className="flex flex-col items-center gap-1">
                                <Typography.Text className="text-gray-400 text-base font-normal">
                                    Arrive
                                </Typography.Text>
                                <Typography.Text className="font-bold text-2xl mt-2">
                                    {formattedTimeOnly(new Date(airlineData.arrive.datetime))}
                                </Typography.Text>
                                <Typography.Text className="text-base font-normal text-center">
                                    {formattedDateOnly(new Date(airlineData.arrive.datetime))}
                                </Typography.Text>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={8} lg={8} xl={1} className="flex items-center" />
                    <Col md={4} lg={4}>
                        <Row className="mt-8" gutter={[24, 24]}>
                            <Col span={12}>
                                <Flex vertical>
                                    <Typography.Text className="text-gray-400 text-base font-normal">
                                        Name
                                    </Typography.Text>
                                    <Typography.Text className="font-bold text-2xl">
                                        Jinto
                                    </Typography.Text>
                                </Flex>
                                <Flex className="mt-6" vertical>
                                    <Typography.Text className="text-gray-400 text-base font-normal">
                                        Passport Number
                                    </Typography.Text>
                                    <Typography.Text className="font-bold text-2xl">
                                        123123
                                    </Typography.Text>
                                </Flex>
                            </Col>
                            <Col span={12}>
                                <Flex vertical>
                                    <Typography.Text className="text-gray-400 text-base font-normal">
                                        Email
                                    </Typography.Text>
                                    <Typography.Text className="font-bold text-2xl">
                                        email.com
                                    </Typography.Text>
                                </Flex>
                                <Flex className="mt-6" vertical>
                                    <Typography.Text className="text-gray-400 text-base font-normal">
                                        Airline Booking Code
                                    </Typography.Text>
                                    <Typography.Text className="font-bold text-2xl">
                                        Jinto
                                    </Typography.Text>
                                </Flex>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={24} lg={24}>
                        <Row className="mt-8" gutter={[24, 24]}>
                            <Col
                                className="bg-gray-50 flex items-center justify-evenly rounded-lg ms-6 mb-40"
                                span={16}
                            >
                                <Flex justify="space-between" align="center">
                                    <ReactSVG src={TicketSVG} />
                                    <Typography.Text className="text-gray-400 text-base font-normal ms-4">
                                        Show e-tickets and passenger identities during check-in.
                                    </Typography.Text>
                                </Flex>
                                <Divider className="h-12 my-2" type="vertical" />
                                <Flex justify="space-between" align="center">
                                    <ReactSVG src={ClockSVG} />
                                    <Typography.Text className="text-gray-400 text-base font-normal ms-4">
                                        Please be at the boarding gate at least 30 minutes before
                                        boarding time.
                                    </Typography.Text>
                                </Flex>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
        </Col>
    );
};

export default PaymentSuccessCard;
