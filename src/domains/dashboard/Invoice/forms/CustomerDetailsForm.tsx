import React from 'react';

import { Flex, Form, Typography, Grid } from 'antd';

import TextInput from '@components/atomic/inputs/TextInput';

import MobileViewUploadImage from '../components/MobileViewUploadImage';

const CustomerDetailsForm: React.FC = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    return (
        <Flex vertical gap={18} className="pt-0">
            <Typography.Text className="text-lg font-semibold">Customer Details:</Typography.Text>
            <Form layout="vertical" className="w-full ">
                <TextInput
                    name="customerName"
                    placeholder="Customer Name"
                    label="Customer Name"
                    type="text"
                    allowAlphabetsAndSpaceOnly
                    isRequired
                    maxLength={50}
                />
                <TextInput
                    name="customerEmail"
                    placeholder="Customer Email ID"
                    label="Email ID"
                    type="text"
                    isRequired
                    maxLength={50}
                />
                <TextInput
                    name="customerAddress"
                    placeholder="Customer Address"
                    label="Customer Address"
                    type="text"
                    isRequired
                    maxLength={50}
                />
                <TextInput
                    name="customerPhone"
                    placeholder="Mobile Number"
                    label="Mobile Number"
                    type="text"
                    allowNumbersOnly
                    maxLength={10}
                    minLength={10}
                    isRequired
                />
            </Form>
            {!screens.md && <MobileViewUploadImage />}
        </Flex>
    );
};

export default CustomerDetailsForm;
