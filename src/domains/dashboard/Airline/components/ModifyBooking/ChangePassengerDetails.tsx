import React, { useState } from 'react';

import { Button, Card, Col, Flex, Form, Radio, Row, Typography } from 'antd';
import { Formik } from 'formik';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import TextInput from '@components/atomic/inputs/TextInput';

const { Text } = Typography;

const ChangePassengerDetails = () => {
    const [selectedFlight, setSelectedFlight] = useState(null);

    const onFlightChange = (e: any) => {
        setSelectedFlight(e.target.value);
    };

    const handleDateTiemChange = (e: any) => {
        setSelectedFlight(e.target.value);
    };

    return (
        <Card bordered={false} bodyStyle={{ padding: '0', borderRadius: '8px' }}>
            <Row
                style={{
                    backgroundColor: '#f7f7f7',
                    padding: '20px',
                    borderRadius: '8px 8px 0 0',
                }}
            >
                <Col span={24}>
                    <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        Change Passenger Details
                    </Text>
                </Col>
            </Row>

            <Formik
                initialValues={{
                    firstName: '',
                    lastName: '',
                    expiryDate: '',
                    passportCountry: '',
                }}
                onSubmit={handleDateTiemChange}
            >
                {({ handleSubmit }) => (
                    <Form layout="vertical" style={{ padding: '20px' }}>
                        <Flex className="mt-6 mb-8" gap="middle" vertical>
                            <Typography.Text className="text-sm">Adult Passenger 1</Typography.Text>
                            <Flex gap="middle">
                                <Radio>Male</Radio>
                                <Radio>Female</Radio>
                            </Flex>
                        </Flex>

                        <Row gutter={2}>
                            <Col md={8} xs={24}>
                                <Col md={20} xs={24}>
                                    <TextInput
                                        label="First Name"
                                        isRequired
                                        name="firstName"
                                        placeholder="Enter first name"
                                        type="text"
                                        allowAlphabetsAndSpaceOnly
                                        maxLength={20}
                                    />
                                </Col>
                                <Col md={20}>
                                    <TextInput
                                        label="Last Name"
                                        isRequired
                                        name="lastName"
                                        placeholder="Enter Last Name"
                                        type="text"
                                        allowAlphabetsAndSpaceOnly
                                        maxLength={20}
                                    />
                                </Col>
                                <Col md={20} xs={24}>
                                    <TextInput
                                        label="Passport Issuing Country"
                                        isRequired
                                        name="passportCountry"
                                        placeholder="Enter Passport Issuing Country"
                                        type="text"
                                        allowAlphabetsAndSpaceOnly
                                        maxLength={20}
                                    />
                                </Col>
                            </Col>
                            <Col md={8} xs={24}>
                                <Col md={20} xs={24}>
                                    <DatePickerInput
                                        label="Date Of Birth"
                                        isRequired
                                        name="dob"
                                        placeholder="Select Date"
                                        classes=" rounded-sm w-full"
                                        // maxDate={dayjs(new Date())}
                                    />
                                </Col>
                                <Col md={20} xs={24}>
                                    <TextInput
                                        label="Passport Number"
                                        isRequired
                                        name="passportNo"
                                        placeholder="Enter Passport Number"
                                        type="text"
                                        allowAlphabetsAndSpaceOnly
                                        maxLength={20}
                                    />
                                </Col>
                                <Col md={20}>
                                    <DatePickerInput
                                        label="Expiry Date"
                                        isRequired
                                        name="expiryDate"
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

export default ChangePassengerDetails;
