import React from 'react';

import { Col, Flex, Typography } from 'antd';
import dayjs from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';

import { legalStatusOptions } from '../../utils/data';

type Props = {
    countryData: any;
    values: any;
    kybData: any;
};

const CompanyInfoForm = ({ countryData, values, kybData }: Props) => (
    <Col xs={24} md={7}>
        <Flex className="mb-5">
            <Typography.Paragraph className="text-base font-medium ">
                Company Information
            </Typography.Paragraph>
        </Flex>
        <TextInput
            name="icRegNumber"
            label="IC Registration Number"
            type="text"
            placeholder="Enter ic registration number"
            allowAlphabetsAndNumbersOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="companyName"
            label="Company Name"
            type="text"
            placeholder="Enter company name"
            allowAlphabetsSpaceAndNumbersOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="tradeName"
            label="Trade Name"
            type="text"
            placeholder="Enter trade name"
            allowAlphabetsAndSpaceOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <SelectInput
            name="legalStatus"
            options={legalStatusOptions}
            placeholder="Please select a legal status"
            label="Legal Status"
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        {values.legalStatus === 'other' && (
            <TextInput
                name="OtherlegalStatus"
                label="Other Legal Status"
                type="text"
                placeholder="Enter other legal status"
                allowNumbersOnly
                isRequired
                isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
            />
        )}
        <TextInput
            name="natureOfBusiness"
            label="Nature of Business"
            type="text"
            placeholder="Enter nature of business"
            allowAlphabetsAndSpaceOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <SelectInput
            name="countryOfIncorporation"
            options={countryData}
            placeholder="Select country of incorporation"
            label="Country of Incorporation"
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <DatePickerInput
            name="dateOfIncorporation"
            label="Date of Incorporation"
            placeholder="Select date of incorporation"
            classes="w-full"
            needConfirm={false}
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="TLNumber"
            label="TL Number"
            type="text"
            placeholder="Enter tl number"
            allowAlphabetsAndNumbersOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="tlIssuingAuthority"
            label="TL Issuing Authority"
            type="text"
            placeholder="Enter issuing authority"
            allowAlphabetsAndSpaceOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <DatePickerInput
            name="expiryDateofTL"
            label="Expiry Date of TL"
            placeholder="Select date "
            classes="w-full"
            needConfirm={false}
            isRequired
            minDate={dayjs(new Date())}
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <TextInput
            name="VATTRN"
            label="VAT/TRN"
            type="text"
            placeholder="Enter vat or trn"
            allowNumbersOnly
            isRequired
            isDisabled={kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined}
        />
        <FileUploadInput
            name="tradeLicense"
            label="Upload Trade License Copy"
            format="format"
            showNotification
            showFileName
            isRequired
            allowedFileTypes={['application/pdf']}
            maxFileSize={2048}
        />
    </Col>
);

export default CompanyInfoForm;
