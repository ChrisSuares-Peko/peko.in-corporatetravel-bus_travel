import { ArrowRightOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Col, Divider, Drawer, Flex, Image, Row, Typography } from 'antd';
import moment from 'moment';

import { Flight } from '../../types/Flight';
import { retrieveAirlineName, retrieveAirport } from '../../utils/airlineData';
import { formattedDateOnly, formattedTimeOnly } from '../../utils/dateTime';
import { convertTimeFormat } from '../../utils/formatDateCode';
import FlightDurationBadge from '../FlightDurationBadge';

type Props = {
    flightDetails: Flight | undefined;
    isDrawerOpen: boolean;
    price: number | undefined;
    handleClose: () => void;
    handleSubmit: (item: Flight) => void;
};

const FlightInfoDrawer = ({
    flightDetails,
    isDrawerOpen,
    handleClose,
    price,
    handleSubmit,
}: Props) => {
    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    return (
        <Drawer
            title="Flight Details"
            width={1200}
            onClose={() => handleClose()}
            open={isDrawerOpen}
            footer={[
                <Flex
                    className="w-full h-full px-6"
                    align="center"
                    justify="space-between"
                    gap={10}
                    key=""
                >
                    <Flex vertical>
                        <Typography.Text className="text-base text-gray-400">Price</Typography.Text>
                        <Typography.Text className="text-lg font-medium">
                            AED {price && price}
                        </Typography.Text>
                    </Flex>
                    <Button
                        key="submit"
                        type="primary"
                        danger
                        onClick={() => {
                            // @ts-ignore
                            handleSubmit(flightDetails && flightDetails);
                        }}
                        className=" rounded-sm"
                    >
                        Book Now
                    </Button>
                </Flex>,
            ]}
        >
            {flightDetails &&
                flightDetails.journey.map((item, i) => (
                    <>
                        <Flex className="mb-5" gap={5} key={i} vertical>
                            <Typography.Text className="text-2xl font-medium">
                                {retrieveAirport(item.flight.segmentReference.onPoint)}{' '}
                                <ArrowRightOutlined className="text-xl font-light" />{' '}
                                {retrieveAirport(item.flight.segmentReference.offPoint)}
                            </Typography.Text>
                            <Typography.Text className="text-sm">
                                {moment(item.flightSegments[0].departureDateTime).format(
                                    'ddd, DD MMM'
                                )}
                                <Badge dot color="#111" className="mx-1" />
                                {item.flight.stopQuantity} Stop
                                {item.flight.flightInfo.duration && (
                                    <>
                                        <Badge dot color="#111" className="mx-1" />
                                        {convertTimeFormat(item.flight.flightInfo.duration)}
                                    </>
                                )}
                                {flightDetails.lcc && (
                                    <>
                                        <Badge dot color="#111" className="mx-1" />
                                        LCC
                                    </>
                                )}
                            </Typography.Text>
                        </Flex>
                        <Card className="my-6" size="small">
                            {item?.flightSegments?.map((ele, index) => (
                                <Col key={index} className="mb-5" span={24}>
                                    <Card className="border-0 rounded-3xl ">
                                        <Row justify="space-between">
                                            <Col
                                                sm={8}
                                                md={4}
                                                lg={4}
                                                className="border-0 rounded-2xl flex flex-col items-center justify-center bg-red_50 p-1"
                                            >
                                                <Image
                                                    preview={false}
                                                    width={120}
                                                    alt={ele.operatingAirline}
                                                    src={`https://res.cloudinary.com/dqhshqcqd/image/upload/v1710764763/Airline/${ele.operatingAirline}.png`}
                                                />
                                                <Typography.Text className="capitalize text-center mt-2 font-medium">
                                                    {capitalizeFirstLetter(
                                                        retrieveAirlineName(ele?.operatingAirline)
                                                    )}
                                                </Typography.Text>
                                                <Typography.Text className="capitalize text-center md:text-xs">
                                                    {ele?.operatingAirline}-{ele?.flightNumber}
                                                </Typography.Text>
                                            </Col>

                                            <Col span={4} className="w-full h-full">
                                                <Flex
                                                    className="w-full h-full ms-6 mt-2"
                                                    justify="center"
                                                    align="start"
                                                    vertical
                                                >
                                                    <Typography.Text className="text-gray-400 text-sm font-normal">
                                                        {formattedDateOnly(
                                                            new Date(ele.departureDateTime)
                                                        )}
                                                    </Typography.Text>
                                                    <Typography.Text className="font-bold text-xl mt-2">
                                                        {formattedTimeOnly(
                                                            new Date(ele.departureDateTime)
                                                        )}
                                                    </Typography.Text>
                                                    <Typography.Text className="text-gray-400 text-xs mt-2 font-normal">
                                                        {ele.departureAirportCode}
                                                        {' - '}
                                                        {retrieveAirport(ele.departureAirportCode)}
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>
                                            <Col
                                                span={6}
                                                className="flex flex-col items-center justify-center"
                                            >
                                                <FlightDurationBadge duration={ele.duration} />
                                            </Col>
                                            <Col
                                                span={4}
                                                className="flex flex-col items-center gap-1 mt-2"
                                            >
                                                <Flex
                                                    vertical
                                                    justify="center w-full mt-4"
                                                    align="end"
                                                >
                                                    <Typography.Text className="text-gray-400 text-sm font-normal">
                                                        {formattedDateOnly(
                                                            new Date(ele.arrivalDateTime)
                                                        )}
                                                    </Typography.Text>
                                                    <Typography.Text className="font-bold text-xl mt-2">
                                                        {formattedTimeOnly(
                                                            new Date(ele.arrivalDateTime)
                                                        )}
                                                    </Typography.Text>
                                                    <Typography.Text className="text-gray-400 text-xs mt-2 font-normal text-end">
                                                        {ele.arrivalAirportCode} {' - '}
                                                        {retrieveAirport(ele.arrivalAirportCode)}
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>

                                            <Col md={12} lg={3} className="w-full h-full ps-2">
                                                <Flex
                                                    className="w-full h-full mt-2"
                                                    vertical
                                                    justify="center"
                                                    align="center"
                                                >
                                                    <Typography.Text className="text-gray-400 text-sm font-normal">
                                                        Check-In Baggage
                                                    </Typography.Text>
                                                    <Typography.Text className="font-medium text-xl mt-2 capitalize">
                                                        {
                                                            ele.baggageAllowance
                                                                ?.checkedInBaggage[0]?.value
                                                        }{' '}
                                                        {ele.baggageAllowance?.checkedInBaggage[0]?.unit.toLowerCase()}
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>
                                            <Col md={12} lg={3} className="w-full h-full">
                                                <Flex
                                                    vertical
                                                    justify="center"
                                                    align="center"
                                                    className="w-full h-full mt-2"
                                                >
                                                    <Typography.Text className="text-gray-400 text-sm font-normal">
                                                        Cabin Class
                                                    </Typography.Text>
                                                    <Typography.Text className="font-medium text-xl mt-2">
                                                        {ele.cabinClass}
                                                    </Typography.Text>
                                                </Flex>
                                            </Col>
                                        </Row>
                                    </Card>
                                    <Divider dashed />
                                </Col>
                            ))}
                        </Card>
                    </>
                ))}
        </Drawer>
    );
};

export default FlightInfoDrawer;
