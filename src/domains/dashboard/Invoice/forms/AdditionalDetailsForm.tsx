import React from 'react';

import { Flex, Form, Typography } from 'antd';

import TextAreaComponent from './TextAreaComponent';

const AdditionalDetailsForm = () => (
    <Flex vertical className="w-full" gap={16}>
        <Typography.Text className="text-lg font-medium">Additional Details:</Typography.Text>

        {/* <Form layout="vertical" className="w-full md:w-[15rem]"> */}
        <Form layout="vertical" className="w-full ">
            <Flex vertical>
                <TextAreaComponent
                    name="comments"
                    placeholder="Enter Notes"
                    label="Notes"
                    maxLength={200}
                />
                <TextAreaComponent
                    name="termsConditions"
                    placeholder="Enter Terms & Conditions"
                    label="Terms & Conditions"
                    maxLength={100}
                />
            </Flex>
        </Form>
    </Flex>
);

export default AdditionalDetailsForm;
