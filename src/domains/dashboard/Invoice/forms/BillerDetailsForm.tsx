import React from 'react';

import { Flex, Form, Typography, Grid } from 'antd';

import TextInput from '@components/atomic/inputs/TextInput';

const BillerDetailsForm: React.FC = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    return (
        <Flex vertical gap={18}>
            <Typography.Text className="text-lg font-semibold">Biller Details:</Typography.Text>
            <Form layout="vertical" className="w-full ">
                <TextInput
                    name="billerName"
                    placeholder="Biller Name"
                    label="Biller Name"
                    type="text"
                    isRequired
                    maxLength={50}
                    allowAlphabetsAndSpaceOnly
                />
                <TextInput
                    name="billerEmail"
                    placeholder="Biller Email ID"
                    label="Email ID"
                    type="text"
                    isRequired
                    maxLength={50}
                />
                <TextInput
                    name="billerCompanyAddress"
                    placeholder="Company Address"
                    label="Company Address"
                    type="text"
                    isRequired
                    maxLength={50}
                />
                <TextInput
                    name="billerPhone"
                    placeholder="Mobile Number"
                    label="Mobile Number"
                    type="text"
                    allowNumbersOnly
                    isRequired
                    maxLength={10}
                />
            </Form>
        </Flex>
    );
};

export default BillerDetailsForm;
