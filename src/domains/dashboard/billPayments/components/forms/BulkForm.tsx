import React from 'react';

import { Flex, Form } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';

const BulkForm = () => {
    const item = useAppSelector(state => state.reducer.billPayment).vendor;
    return (
        <Flex vertical className="w-full ">
            <Form layout="vertical">
                <TextInput
                    name="name"
                    label="Beneficiary Name"
                    type="text"
                    placeholder="Enter Beneficiary Name"
                    isRequired
                    classes="rounded-sm"
                    maxLength={20}
                />
                <TextInput
                    name="accountNo"
                    label="Account Number"
                    type="text"
                    placeholder="Enter Account Number"
                    isRequired
                    classes="rounded-sm"
                    maxLength={20}
                />
                {item?.accessKey === 'etisalat_bill' && (
                    <SelectInput
                        name="optional1"
                        isRequired
                        options={[
                            {
                                label: 'Postpaid',
                                value: 'POSTPAID',
                            },
                            {
                                label: 'Landline',
                                value: 'LANDLINE',
                            },
                            {
                                label: 'Internet',
                                value: 'INTERNET',
                            },
                            {
                                label: 'Alshamil',
                                value: 'ALSHAMIL',
                            },
                            {
                                label: 'Elife',
                                value: 'ELIFE',
                            },
                            {
                                label: 'Evision',
                                value: 'EVISION',
                            },
                        ]}
                        placeholder="Please select a Service Type"
                        label="Service Type"
                        filterOption={false}
                    />
                )}
            </Form>
        </Flex>
    );
};

export default BulkForm;
