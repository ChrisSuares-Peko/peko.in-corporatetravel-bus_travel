import React from 'react';

import { Col, Flex, Typography } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';

type Props = {
    countryData: any;
    kybData: any;
};

const AddressInfoForm = ({ countryData, kybData }: Props) => (
    <Col xs={24} md={7}>
        <Flex className="mb-5">
            <Typography.Paragraph className=" text-base font-medium ">
                Address and Other Information
            </Typography.Paragraph>
        </Flex>

        <TextInput
            name="poBox"
            label="PO Box/Zip Code"
            type="text"
            placeholder="Enter po box or zip code"
            allowNumbersOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="buildingName"
            label="Building Name/Number"
            type="text"
            placeholder="Enter building name or number"
            allowAlphabetsSpaceAndNumbersOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="streetName"
            label="Street Name/Number"
            type="text"
            placeholder="Enter street name or number"
            allowAlphabetsSpaceAndNumbersOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="city"
            label="City"
            type="text"
            placeholder="Enter city"
            allowAlphabetsAndSpaceOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <SelectInput
            name="country"
            options={countryData}
            placeholder="Please select a country"
            label="Country"
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="offWebsite"
            label="Official Website"
            type="text"
            placeholder="Enter official website"
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="offEmail"
            label="Official Email ID"
            type="text"
            placeholder="Enter official email ID"
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="contactPersonName"
            label="Contact Person Name"
            type="text"
            placeholder="Enter contact person name"
            allowAlphabetsAndSpaceOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="phoneNumber"
            label="Phone Number"
            type="text"
            placeholder="Enter phone number"
            allowNumbersOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
    </Col>
);

export default AddressInfoForm;
