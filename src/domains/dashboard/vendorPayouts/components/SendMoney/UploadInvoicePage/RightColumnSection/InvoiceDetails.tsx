import React from 'react';

import { Flex, Typography } from 'antd';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import TextInput from '@components/atomic/inputs/TextInput';

const { Text } = Typography;

const InvoiceDetails: React.FC<{}> = () => (
    <Flex className="w-full grid sm:grid-cols-2 sm:gap-20">
        <Flex vertical className="sm:col-span-1">
            <Text>Invoice Number</Text>
            <TextInput
                name="InvoiceNumber"
                type="text"
                placeholder="Please enter Invoice Number"
                isRequired
                classes="rounded-sm"
                allowNumbersOnly
            />
        </Flex>
        <Flex vertical className="sm:col-span-1">
            <Text>Invoice Date</Text>
            <DatePickerInput
                placeholder="Select Invoice Date"
                isRequired
                name="invoiceDate"
                classes="w-full"
            />
        </Flex>
    </Flex>
);

export default InvoiceDetails;
