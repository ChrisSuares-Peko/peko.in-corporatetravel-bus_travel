import React from 'react';

import { Card, Col, Divider, Flex, Image, Row, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import FlightDurationBadge from './FlightDurationBadge';
import { Flight } from '../types/Flight';
import { retrieveAirlineName, retrieveAirport } from '../utils/airlineData';
import { bookingData } from '../utils/bookingsData';
import { formattedDateOnly, formattedTimeOnly } from '../utils/dateTime';
import { retrieveFlightClass } from '../utils/getFlightClass';

const FlightCard = () => {
    // @ts-ignore
    const airlineData: Flight = useAppSelector(
        state => state.reducer.airline.selectedAirline
    ) as Flight;

    const formData = useAppSelector(state => state.reducer.airline.searchData);
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    return (
        <Card bodyStyle={{ padding: 0 }} className="rounded-md">
            <Row className="justify-between p-6 pb-2 gap-4">
                <Col className="flex gap-4 items-center">
                    <Image preview={false} height={45} src={airlineData.logo} />
                    <Typography.Text className="capitalize">
                        {capitalizeFirstLetter(retrieveAirlineName(airlineData.flightCode))}{' '}
                        {bookingData.offerId}
                    </Typography.Text>
                </Col>
                <Col className="flex gap-4 items-center">
                    <Typography.Text>{retrieveFlightClass(formData.class)}</Typography.Text>
                    <Flex className="bg-tagColor text-brandColor px-2 rounded-full">
                        Partially Refundable
                    </Flex>
                </Col>
            </Row>
            <Divider className="border-t-1 rounded-full" />
            <Row className="mb-10 px-6 pt-6 w-full" justify="space-between" align="middle">
                {airlineData.journey.map((item, index) => (
                    <>
                        <Col span={4} className="flex flex-col items-start ">
                            <Typography.Text className="font-bold md:text-xl xxl:text-2xl">
                                {item.flight.segmentReference.onPoint}
                            </Typography.Text>
                            <Typography.Text className="md:text-sm xxl:text-base font-normal line-clamp-1">
                                {retrieveAirport(item.flight.segmentReference.onPoint)}
                            </Typography.Text>
                        </Col>
                        <Col span={5} className="flex flex-col items-center">
                            <Typography.Text className="text-gray-400 md:text-sm xxl:text-base font-normal">
                                Depart
                            </Typography.Text>
                            <Typography.Text className="font-bold text-xl mt-1">
                                {formattedTimeOnly(
                                    new Date(
                                        item?.flightSegments[index]?.departureDateTime ??
                                            item?.flightSegments[0]?.departureDateTime
                                    )
                                )}
                            </Typography.Text>
                            <Typography.Text className="md:text-sm xxl:text-sm font-normal">
                                {formattedDateOnly(
                                    new Date(
                                        item?.flightSegments[index]?.departureDateTime ??
                                            item?.flightSegments[0]?.departureDateTime
                                    )
                                )}
                            </Typography.Text>
                        </Col>
                        <Col span={5} className="flex flex-col items-center justify-center">
                            {airlineData.flightDuration ? (
                                <>
                                    <FlightDurationBadge duration={airlineData.flightDuration} />
                                    <Typography.Text className="text-gray-500 text-base mt-2">
                                        {airlineData.stopCount} Stop
                                    </Typography.Text>
                                </>
                            ) : (
                                <>
                                    <Typography.Text className="text-gray-500 text-base mt-2">
                                        {airlineData.stopCount} Stop
                                    </Typography.Text>
                                    <Typography.Text
                                        className={`text-gray-500 text-[10px] text-center ${index === 1 ? 'hidden' : 'flex'}`}
                                    >
                                        Flight Duration Depends Upon The Flight Timings
                                    </Typography.Text>
                                </>
                            )}
                        </Col>
                        <Col span={5} className="flex flex-col items-center">
                            <Typography.Text className="text-gray-400 md:text-sm xxl:text-base font-normal">
                                Arrive
                            </Typography.Text>
                            <Typography.Text className="font-bold text-xl mt-1">
                                {formattedTimeOnly(
                                    new Date(
                                        item?.flightSegments[index]?.arrivalDateTime ??
                                            item?.flightSegments[0]?.arrivalDateTime
                                    )
                                )}
                            </Typography.Text>
                            <Typography.Text className="md:text-sm xxl:text-sm font-normal">
                                {formattedDateOnly(
                                    new Date(
                                        item?.flightSegments[index]?.arrivalDateTime ??
                                            item?.flightSegments[0]?.arrivalDateTime
                                    )
                                )}
                            </Typography.Text>
                        </Col>
                        <Col span={4} className="flex flex-col items-end">
                            <Typography.Text className="font-bold md:text-xl xxl:text-2xl">
                                {item.flight.segmentReference.offPoint}
                            </Typography.Text>
                            <Typography.Text className="md:text-sm xxl:text-base font-normal line-clamp-1">
                                {retrieveAirport(item.flight.segmentReference.offPoint)}
                            </Typography.Text>
                        </Col>
                    </>
                ))}
            </Row>
        </Card>
    );
};

export default FlightCard;
