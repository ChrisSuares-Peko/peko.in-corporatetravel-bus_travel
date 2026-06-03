import React from 'react';

import { ShoppingOutlined } from '@ant-design/icons';
import { Col, Image, Row, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import { retrieveAirlineName } from '../../utils/airlineData';
import AirlineDetailsCardAdaptive from '../AirlineDetailsCardAdaptive';

const FlightCardMobile = () => {
    const bookingData = useAppSelector(state => state.reducer.airline.selectedAirline);

    return (
        <>
            <Row className="justify-between pb-2 gap-4">
                <Col className="flex gap-4 items-center">
                    <Image preview={false} height={20} src={bookingData?.logo} />
                    <Typography.Text>{retrieveAirlineName(bookingData.flightCode)}</Typography.Text>
                </Col>
            </Row>

            <AirlineDetailsCardAdaptive />
            <Row>
                <Typography.Paragraph className="pb-3">
                    <ShoppingOutlined className="mr-1" />
                    Cabin Baggage:
                    <Typography.Text className="mx-2 text-gray-500 text-xs font-normal leading-4">
                        {bookingData.baggageAllowance?.checkedInBaggage[0]?.value}{' '}
                        {bookingData.baggageAllowance?.checkedInBaggage[0]?.unit}
                    </Typography.Text>
                </Typography.Paragraph>
                <Typography.Paragraph>
                    <ShoppingOutlined className="mr-1" />
                    Check-In Baggage:
                    <Typography.Text className="mx-2 text-gray-500 text-xs font-normal leading-4">
                        {bookingData.baggageAllowance?.checkedInBaggage[0]?.value}{' '}
                        {bookingData.baggageAllowance?.checkedInBaggage[0]?.unit}
                    </Typography.Text>
                </Typography.Paragraph>
            </Row>
            {/* <Divider className="border-t-2" /> */}
        </>
    );
};

export default FlightCardMobile;
