import React from 'react';

import { Flex, Form, Typography } from 'antd';

import TextAreaInput from '@components/atomic/inputs/TextAreaInput';

const AddressForm = () => (
    <Flex vertical gap={16}>
        <Typography.Text className="text-lg font-medium">Additional Details:</Typography.Text>

        {/* <Form layout="vertical" className="w-full md:w-[15rem]"> */}
        <Form layout="vertical" className="w-full ">
            <Flex vertical>
                <TextAreaInput name="comments" placeholder="Enter Notes" label="Notes" />
                <TextAreaInput
                    name="termsConditions"
                    placeholder="Enter Terms & Conditions"
                    label="Terms & Conditions"
                />
            </Flex>
        </Form>
    </Flex>
);

export default AddressForm;
