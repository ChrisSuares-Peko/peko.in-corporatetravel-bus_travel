import React from 'react';

import { Col, Flex, Row, Typography } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';

import { CountryPresenceOptions } from '../../utils/data';

type Props = {
    countryData: any;
};
const AuthorisedPersonForm = ({ countryData }: Props) => (
    <>
        <Flex className="mt-6">
            <Typography.Text className="text-base font-medium">Authorised Person</Typography.Text>
        </Flex>
        <Row className="mt-3" gutter={[40, 0]}>
            <Col xs={24} md={7}>
                <TextInput
                    name="authorizedPersonName"
                    label="Authorized Person Name"
                    type="text"
                    placeholder="Enter company name"
                    allowAlphabetsAndNumbersOnly
                    isRequired
                />
            </Col>
            <Col xs={24} md={7}>
                <SelectInput
                    name="authorizedPersonNationality"
                    options={countryData}
                    placeholder="Please select a country"
                    label="Nationality"
                    isRequired
                />
            </Col>
            <Col xs={24} md={7}>
                <TextInput
                    name="authorizedPersonID"
                    type="text"
                    label="National Dl/Passport No."
                    placeholder="Enter national dl / passport no"
                    allowAlphabetsAndNumbersOnly
                    isRequired
                />
            </Col>
            <Col xs={24} md={14}>
                <SelectInput
                    name="hasPresenceInIranOrNorthKorea"
                    options={CountryPresenceOptions}
                    placeholder="Please select a country"
                    label="Confirm Whether the Corporate Has Direct/Indirect Presence in Iran/North Korea"
                    isRequired
                />
            </Col>
        </Row>
    </>
);

export default AuthorisedPersonForm;
