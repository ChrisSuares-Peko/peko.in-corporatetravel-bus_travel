import React from 'react';

import { Col, Row } from 'antd';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';

interface BankFormFieldsProps {
    bankCodes: { label: string; value: string }[];
    deliveryMode: string;
    bankName: string;
}

const BankFormFields: React.FC<BankFormFieldsProps> = ({ bankCodes, deliveryMode, bankName }) => (
    <Row className="mt-6" gutter={[20, 40]}>
        <Col xs={24} md={12}>
            <TextInput
                name="bankAccountName"
                type="text"
                label="Bank Account Name"
                placeholder="Enter Bank Account Name"
            />
            <TextInput
                name="bankAccountNumber"
                type="text"
                label="Account Number"
                placeholder="Enter Account Number"
            />
            <TextInput
                name="deliveryMode"
                type="text"
                label="Delivery Mode"
                values={deliveryMode || ''}
                placeholder="Enter Delivery Mode"
                readOnly
            />
            <SelectInputWithSearch
                name="bankCode"
                options={bankCodes}
                label="Bank Code"
                placeholder="Select Bank Code"
            />
            <TextInput
                name="bankName"
                type="text"
                label="Bank Name"
                values={bankName || ''}
                placeholder="Enter Bank Name"
                // readOnly
            />
            <InputTextArea
                name="bankAddress"
                label="Bank Address"
                placeholder="Enter Address"
                maxLength={500}
                autoSize
            />
        </Col>
    </Row>
);

export default BankFormFields;
