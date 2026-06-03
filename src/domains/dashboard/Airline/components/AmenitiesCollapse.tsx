import React from 'react';

import { ShoppingOutlined } from '@ant-design/icons';
import { Col, Collapse, Row, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';

type Props = {};

const AmenitiesCollapse = (props: Props) => {
    const bookingData = useAppSelector(state => state.reducer.airline.selectedAirline);

    const { Paragraph, Text } = Typography;
    return (
        <Row className="mt-10">
            <Collapse size="large" expandIconPosition="end" className="w-full border-none">
                <Collapse.Panel
                    key="1"
                    style={{ borderBottom: 0 }}
                    header={
                        <h1 className="font-bold p-2 m-0">
                            {bookingData.onPoint} → {bookingData.offPoint} : Standard fare
                        </h1>
                    }
                >
                    <Row className="gap-4">
                        <Col md={24} xl={10}>
                            <Paragraph className="pb-3">
                                <ShoppingOutlined className="mx-2" />
                                Cabin Baggage:
                                <Text className="mx-2 text-gray-500 text-xs font-normal leading-4">
                                    {bookingData.baggageAllowance?.checkedInBaggage[0]?.value}{' '}
                                    {bookingData.baggageAllowance?.checkedInBaggage[0]?.unit}
                                </Text>
                            </Paragraph>
                            <Paragraph className="pb-3">
                                <ShoppingOutlined className="mx-2" />
                                Check-In Baggage:
                                <Typography.Text className="mx-2 text-gray-500 text-xs font-normal leading-4">
                                    {bookingData.baggageAllowance?.checkedInBaggage[0]?.value}{' '}
                                    {bookingData.baggageAllowance?.checkedInBaggage[0]?.unit}
                                </Typography.Text>
                            </Paragraph>
                        </Col>
                    </Row>
                </Collapse.Panel>
            </Collapse>
        </Row>
    );
};

export default AmenitiesCollapse;
