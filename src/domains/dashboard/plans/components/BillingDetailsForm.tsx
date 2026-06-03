import React from 'react';

import { Col, Form, Row } from 'antd';

import TextInput from '@components/atomic/inputs/TextInput';

type Props = {};

const BillingDetailsForm = (props: Props) => (
    <Form layout="vertical" className="w-full gap-1 mt-5 sm:w-10/12">
        <Row gutter={10} className="gap-x-9 gap-y-3">
            <Col sm={11}>
                <TextInput
                    isRequired
                    name="firstName"
                    label="First name"
                    placeholder="Enter first name"
                    type="text"
                    allowAlphabetsAndSpaceOnly
                />
            </Col>
            <Col sm={11}>
                <TextInput
                    isRequired
                    name="lastName"
                    label="Last name"
                    placeholder="Enter last name"
                    type="text"
                    allowAlphabetsAndSpaceOnly
                />
            </Col>
            <Col sm={11}>
                <TextInput
                    isRequired
                    name="phoneNumber"
                    label="Mobile Number"
                    placeholder="Enter mobile number"
                    type="text"
                    allowNumbersOnly
                    maxLength={13}
                />
            </Col>
            <Col sm={11}>
                <TextInput
                    isRequired
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    type="text"
                />
            </Col>
            <Col sm={11}>
                <TextInput
                    isRequired
                    name="flatNO"
                    label="Flat/House no."
                    placeholder="Enter flat/house no"
                    type="text"
                    allowAlphabetsSpaceAndNumbersOnly
                />
            </Col>
            <Col sm={11}>
                <TextInput
                    isRequired
                    name="address"
                    label="Address"
                    placeholder="Enter last address"
                    type="text"
                    allowAlphabetsAndSpaceOnly
                />
            </Col>
            <Col sm={11}>
                <TextInput
                    isRequired
                    name="city"
                    label="City"
                    placeholder="Enter city"
                    type="text"
                    allowAlphabetsAndSpaceOnly
                />
            </Col>{' '}
            <Col sm={11}>
                <TextInput
                    isRequired
                    name="state"
                    label="State"
                    placeholder="Enter state"
                    type="text"
                    allowAlphabetsAndSpaceOnly
                />
            </Col>{' '}
            <Col sm={11}>
                <TextInput
                    isRequired
                    name="postalCode"
                    label="Postal Code"
                    placeholder="Enter postal code"
                    type="text"
                    allowNumbersOnly
                />
            </Col>
        </Row>
    </Form>
);

export default BillingDetailsForm;
