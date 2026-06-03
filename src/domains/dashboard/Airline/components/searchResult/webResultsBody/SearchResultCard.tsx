/* eslint-disable no-unsafe-optional-chaining */
import { RightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, Row, Typography } from 'antd';

import { formatNumberWithLocalString } from '@utils/priceFormat';

import DynamicImageCard from './DynamicImageCard';
import { Journey } from '../../../types/airlineList';
import { Flight } from '../../../types/Flight';
import { retrieveAirportName } from '../../../utils/airlineData';
import { formattedDateOnly, formattedTimeOnly } from '../../../utils/dateTime';
import '../../../assets/style.css';
import FlightDurationBadge from '../../FlightDurationBadge';

interface FlightDetailProps {
    item: Flight;
    handleClick: (item: Flight) => void;
    setIsDrawerOpen: (v: boolean) => void;
    setDrawerDetails: (item: Flight) => void;
    setSelectedAirlinePrice: (p: number) => void;
}

function SearchResultCard({
    item,
    handleClick,
    setDrawerDetails,
    setSelectedAirlinePrice,
    setIsDrawerOpen,
}: FlightDetailProps) {
    return (
        <Col className="mb-5" span={24}>
            <Card
                className="border-0 rounded-lg search-result-card "
                bodyStyle={{ padding: '4px' }}
            >
                <Row justify="space-around" className="py-1">
                    <Col className="p-0 m-0" span={20}>
                        {item.journey.map((ele: Journey, i: number) => (
                            <Row className="" justify="space-between" align="middle" key={i}>
                                <Col
                                    sm={8}
                                    md={4}
                                    className="border-0 h-36 ms-1 rounded-md flex flex-col items-center justify-center bg-[#FFF7F6]"
                                >
                                    <DynamicImageCard
                                        flightSegments={ele?.flightSegments}
                                        item={item}
                                    />
                                </Col>

                                <Col
                                    sm={24}
                                    md={19}
                                    className={`py-4 ${i === 0 && item.journey.length !== 1 ? 'border-b' : ''}`}
                                >
                                    <Row>
                                        <Col
                                            md={8}
                                            lg={8}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <Typography.Text className="font-normal text-center md:text-sm">
                                                {retrieveAirportName(
                                                    ele.flight.segmentReference.onPoint
                                                )}
                                            </Typography.Text>

                                            <Typography.Text className="mt-1 font-medium md:text-xl">
                                                {formattedTimeOnly(
                                                    new Date(
                                                        ele?.flightSegments[i]?.departureDateTime ??
                                                            ele?.flightSegments[0]
                                                                ?.departureDateTime
                                                    )
                                                )}
                                            </Typography.Text>
                                            <Typography.Text className="font-normal text-center md:text-xs">
                                                {formattedDateOnly(
                                                    new Date(
                                                        ele?.flightSegments[i]?.departureDateTime ??
                                                            ele?.flightSegments[0]
                                                                ?.departureDateTime
                                                    )
                                                )}
                                            </Typography.Text>
                                        </Col>
                                        <Col md={8} lg={8} className="w-full">
                                            <Flex
                                                vertical
                                                className="w-full h-full mt-2"
                                                justify="center"
                                                align="center"
                                            >
                                                {ele.flight.flightInfo.duration ? (
                                                    <>
                                                        <FlightDurationBadge
                                                            duration={
                                                                ele.flight.flightInfo.duration
                                                            }
                                                        />
                                                        <Typography.Text className="mt-3 text-xs text-gray-500">
                                                            {ele.flight.stopQuantity === 0
                                                                ? 'Non stop'
                                                                : `${ele.flight.stopQuantity} stop`}
                                                        </Typography.Text>
                                                    </>
                                                ) : (
                                                    <Typography.Text className="text-xs text-center text-gray-500">
                                                        Flight Duration Depends Upon The Flight
                                                        Timings
                                                    </Typography.Text>
                                                )}
                                            </Flex>
                                        </Col>
                                        <Col
                                            md={8}
                                            lg={8}
                                            className="flex flex-col items-center gap-1"
                                        >
                                            <Typography.Text className="font-normal text-center md:text-sm line-clamp-1">
                                                {retrieveAirportName(
                                                    ele.flight.segmentReference.offPoint
                                                )}
                                            </Typography.Text>
                                            <Typography.Text className="mt-1 font-medium md:text-xl">
                                                {formattedTimeOnly(
                                                    new Date(
                                                        ele?.flightSegments[
                                                            ele.flightSegments.length - 1 || 0
                                                        ]?.arrivalDateTime
                                                    )
                                                ) || ''}
                                            </Typography.Text>
                                            <Typography.Text className="text-xs font-normal text-center">
                                                {formattedDateOnly(
                                                    new Date(
                                                        ele?.flightSegments[
                                                            ele.flightSegments.length - 1 || 0
                                                        ]?.arrivalDateTime
                                                    )
                                                ) || ''}
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        ))}
                    </Col>
                    <Col
                        lg={12}
                        xl={4}
                        className="flex items-end justify-center gap-4 mb-4 align-middle lg:flex-col lg:gap-0 lg:mb-0 lg:items-center md:me-4 lg:me-0"
                    >
                        <Flex gap={10} vertical justify="center" align="center">
                            <Flex vertical justify="center" align="center" gap={1}>
                                <Typography.Text className="font-normal text-gray-400 md:text-sm">
                                    Price
                                </Typography.Text>
                                <Typography.Text className="font-semibold sm:text-base md:text-lg">
                                    AED {formatNumberWithLocalString(item.price)}
                                </Typography.Text>
                            </Flex>
                            <Button
                                onClick={() => handleClick(item)}
                                danger
                                className="flex justify-center"
                                type="primary"
                            >
                                Book Now
                            </Button>
                            <Typography.Text
                                onClick={() => {
                                    setDrawerDetails(item);
                                    setSelectedAirlinePrice(Number(item.price));
                                    setIsDrawerOpen(true);
                                }}
                                className="text-red-500 cursor-pointer text-[10px] flex justify-center items-center mt-2"
                            >
                                Flight Details <RightOutlined className="ms-1" />
                            </Typography.Text>
                        </Flex>
                    </Col>
                </Row>
            </Card>
        </Col>
    );
}

export default SearchResultCard;
