import React, { useState } from 'react';

import { Button, Card, Col, Form, Row, Typography } from 'antd';
import { Formik } from 'formik';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import TextInput from '@components/atomic/inputs/TextInput';

const { Text } = Typography;

const ChangeDateTime = () => {
    const [selectedFlight, setSelectedFlight] = useState(null);

    const onFlightChange = (e: any) => {
        setSelectedFlight(e.target.value);
    };

    const handleDateTiemChange = (e: any) => {
        setSelectedFlight(e.target.value);
    };

    return (
        <Card bordered={false} bodyStyle={{ padding: '0', borderRadius: '8px' }}>
            {/* Header section with grey background */}
            <Row
                style={{
                    backgroundColor: '#f7f7f7',
                    padding: '20px',
                    borderRadius: '8px 8px 0 0',
                }}
            >
                <Col span={24}>
                    <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>Change Date/Time</Text>
                </Col>
            </Row>

            {/* Formik Form */}
            <Formik
                initialValues={{
                    departure: '',
                    arrival: '',
                    depDate: null,
                }}
                onSubmit={handleDateTiemChange}
            >
                {({ handleSubmit }) => (
                    <Form layout="vertical" style={{ padding: '20px' }}>
                        <Row gutter={2}>
                            <Col md={8} xs={24}>
                                <Col span={20}>
                                    <TextInput
                                        label="Departure"
                                        isRequired
                                        name="departure"
                                        placeholder="Enter departure location"
                                        type="text"
                                        allowAlphabetsAndSpaceOnly
                                        maxLength={20}
                                    />
                                </Col>
                                <Col span={20}>
                                    <TextInput
                                        label="Arrival"
                                        isRequired
                                        name="arrival"
                                        placeholder="Enter arrival"
                                        type="text"
                                        allowAlphabetsAndSpaceOnly
                                        maxLength={20}
                                    />
                                </Col>
                            </Col>
                            <Col md={8} xs={24}>
                                <Col span={20}>
                                    <DatePickerInput
                                        label="Departure Date"
                                        isRequired
                                        name="departureDate"
                                        placeholder="Select Date"
                                        classes=" rounded-sm w-full"
                                        // maxDate={dayjs(new Date())}
                                    />
                                </Col>
                                <Col span={20}>
                                    <DatePickerInput
                                        label="Arrival Date"
                                        isRequired
                                        name="arrivalDate"
                                        placeholder="Select Date"
                                        classes=" rounded-sm w-full"
                                        // maxDate={dayjs(new Date())}
                                    />
                                </Col>
                            </Col>
                            <Col span={8} style={{ textAlign: 'center' }}>
                                <Button
                                    type="primary"
                                    style={{
                                        backgroundColor: '#FF4D4F',
                                        borderColor: '#FF4D4F',
                                    }}
                                >
                                    Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default ChangeDateTime;
