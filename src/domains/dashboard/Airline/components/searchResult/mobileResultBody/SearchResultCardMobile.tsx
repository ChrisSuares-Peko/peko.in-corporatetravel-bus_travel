import React, { useEffect, useState } from 'react';

import { Badge, Button, Card, Col, Divider, Flex, Pagination, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { useAppDispatch } from '@src/hooks/store';
import useScrollUpOnPageChange from '@src/hooks/useScrollTopOnPageChange';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import DynamicImageCard from './DynamicImageCard';
import BagSVG from '../../../assets/icons/bag.svg';
import { setSelectedAirline } from '../../../slices/airlineSlice';
import { Flight } from '../../../types/Flight';
import { formattedTimeOnly } from '../../../utils/dateTime';
import { noFlightResults } from '../../../utils/lottie';
import FlightInfoDrawer from '../FlightInfoDrawer';

interface FlightDetailProps {
    flights: Flight[] | undefined;
}

const { Text } = Typography;

function SearchResultCardMobile({ flights }: FlightDetailProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [drawerDetails, setDrawerDetails] = useState<Flight>();
    const [selectedAirlinePrice, setSelectedAirlinePrice] = useState<number>();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5; // Number of items per page

    const handleClick = (item: Flight) => {
        const { offerId } = item;
        if (!offerId) {
            dispatch(
                showToast({
                    description: 'This is not available at this moment',
                    variant: 'warning',
                })
            );
            console.log('offerId is not available');
        } else {
            dispatch(setSelectedAirline(item));
            navigate(
                `${paths.dashboard.corporateTravel}/${paths.airline.index}/${paths.airline.results}/${paths.airline.details}`
            );
        }
    };

    // Paginate flights
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFlights = flights?.slice(startIndex, endIndex) || [];
    useEffect(() => {
        setCurrentPage(1);
    }, [flights]);
    useScrollUpOnPageChange(currentPage);

    return (
        <>
            <Row gutter={16}>
                {flights?.length === 0 ? (
                    <Flex className="w-full h-full" vertical justify="center" align="center">
                        <Lottie options={noFlightResults} height={250} width={350} />
                        <Typography.Text className="text-base text-center">
                            Apologies, no flights found. Kindly consider refining your search or
                            exploring alternative destinations.
                        </Typography.Text>
                    </Flex>
                ) : (
                    paginatedFlights.map((item, index) => (
                        <Col key={index} className="mb-5" span={24}>
                            <Card className="border rounded-md" bodyStyle={{ padding: 10 }}>
                                <Row className="p-0 m-0">
                                    {item.journey.map((ele, i) => (
                                        <>
                                            <Col span={24} className="py-3">
                                                <Row justify="space-between">
                                                    <Col
                                                        span={8}
                                                        className="flex flex-col items-center"
                                                    >
                                                        <Text className="font-bold text-lg mt-2 text-start">
                                                            {ele?.flightSegments[i]
                                                                ?.departureDateTime
                                                                ? formattedTimeOnly(
                                                                      new Date(
                                                                          ele?.flightSegments[
                                                                              i
                                                                          ]?.departureDateTime
                                                                      )
                                                                  )
                                                                : 'N/A'}
                                                        </Text>
                                                        <Text className="text-gray-500 text-xs ">
                                                            {
                                                                ele?.flightSegments[i]
                                                                    ?.departureAirportCode
                                                            }
                                                            <Badge
                                                                dot
                                                                className="mx-1"
                                                                color="#D9D9D9"
                                                            />
                                                            {ele?.flightSegments[i]
                                                                ?.departureDateTime
                                                                ? dayjs(
                                                                      ele?.flightSegments[i]
                                                                          ?.departureDateTime
                                                                  ).format('MMM D')
                                                                : 'N/A'}
                                                        </Text>
                                                    </Col>
                                                    <Col
                                                        span={8}
                                                        className="flex flex-col items-center"
                                                    >
                                                        <Text className="text-gray-500 text-xs">
                                                            {item?.flightDuration
                                                                .replace('H', ' h ')
                                                                .replace('M', ' m')}
                                                        </Text>
                                                        <Divider />
                                                        <Text className="text-gray-500 text-xs">
                                                            {item?.stopCount} stop
                                                        </Text>
                                                    </Col>
                                                    <Col
                                                        span={8}
                                                        className="flex flex-col items-center"
                                                    >
                                                        <Text className="font-bold text-lg mt-2">
                                                            {ele?.flightSegments[i]
                                                                ?.departureDateTime
                                                                ? formattedTimeOnly(
                                                                      new Date(
                                                                          ele?.flightSegments[
                                                                              i
                                                                          ]?.arrivalDateTime
                                                                      )
                                                                  )
                                                                : 'N/A'}
                                                        </Text>
                                                        <Text className="text-gray-500 text-xs text-end">
                                                            {
                                                                ele?.flightSegments[i]
                                                                    ?.arrivalAirportCode
                                                            }
                                                            <Badge
                                                                dot
                                                                className="mx-1"
                                                                color="#D9D9D9"
                                                            />
                                                            {dayjs(
                                                                ele?.flightSegments[i]
                                                                    ?.arrivalDateTime
                                                            ).format('MMM D')}
                                                        </Text>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col
                                                span={24}
                                                className="border-0 rounded-none flex items-start justify-start ms-4"
                                            >
                                                <DynamicImageCard
                                                    item={item}
                                                    flightSegments={ele?.flightSegments}
                                                />
                                            </Col>
                                            <Divider />
                                        </>
                                    ))}
                                    <Col span={24}>
                                        <Row justify="space-between">
                                            <Col
                                                span={12}
                                                className="flex flex-col items-start justify-end"
                                            >
                                                <Flex>
                                                    <ReactSVG src={BagSVG} className="ms-2" />
                                                    <ReactSVG src={BagSVG} className="ms-2" />
                                                </Flex>
                                                <Text className="text-gray-400 text-xs font-normal mt-1 ms-2">
                                                    Baggage -
                                                    {item?.journey[0]?.flightSegments[0]
                                                        ?.baggageAllowance ? (
                                                        <>
                                                            <Text className="text-gray-400 text-xs font-normal ms-1">
                                                                {
                                                                    item?.journey[0]
                                                                        ?.flightSegments[0]
                                                                        ?.baggageAllowance
                                                                        ?.checkedInBaggage[0]?.value
                                                                }
                                                            </Text>
                                                            <Text className="text-gray-400 text-xs font-normal ms-1">
                                                                {
                                                                    item?.journey[0]
                                                                        ?.flightSegments[0]
                                                                        ?.baggageAllowance
                                                                        ?.checkedInBaggage[0]?.unit
                                                                }
                                                            </Text>
                                                        </>
                                                    ) : (
                                                        <Text className="text-gray-400 text-xs font-normal ms-1">
                                                            N/A{' '}
                                                        </Text>
                                                    )}
                                                </Text>
                                            </Col>
                                            <Col
                                                span={12}
                                                className="flex flex-col items-end justify-center"
                                            >
                                                <Text className="font-bold text-md mt-2">
                                                    AED {formatNumberWithLocalString(item.price)}
                                                </Text>

                                                <Text className="text-gray-400 text-xs font-thin text-end">
                                                    Includes taxes and Charges
                                                </Text>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={24}>
                                        <Button
                                            size="large"
                                            type="primary"
                                            className="w-full my-2"
                                            danger
                                            onClick={() => handleClick(item)}
                                        >
                                            Book Now
                                        </Button>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    ))
                )}
                <Col span={24} className="flex justify-center mt-4">
                    {flights && flights.length > 0 && (
                        <Pagination
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={flights.length}
                            onChange={page => setCurrentPage(page)}
                            className="mt-4"
                        />
                    )}
                </Col>
            </Row>
            <FlightInfoDrawer
                handleClose={() => setIsDrawerOpen(!isDrawerOpen)}
                flightDetails={drawerDetails ?? drawerDetails}
                price={selectedAirlinePrice}
                isDrawerOpen={isDrawerOpen}
                handleSubmit={handleClick}
            />
        </>
    );
}

export default SearchResultCardMobile;
