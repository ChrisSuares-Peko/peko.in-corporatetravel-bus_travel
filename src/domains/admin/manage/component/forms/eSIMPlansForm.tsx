import React from 'react';

import { Flex, Form, Skeleton } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { DropDown } from '@customtypes/general';

type Props = {
    countryData: DropDown | undefined;
    setSearchCountry: (val: string) => void;
};

const EsimPlanForm = ({ countryData, setSearchCountry }: Props) => (
    <Flex vertical className="w-full ">
        <Form layout="vertical">
            <TextInput
                name="name"
                label="Name"
                type="text"
                placeholder="Enter Plan Name"
                isRequired
                classes=" rounded-sm"
                maxLength={30}
            />
            {countryData ? (
                <SelectInput
                    isRequired
                    name="country"
                    options={countryData}
                    placeholder="Select a Country"
                    label="Country"
                    allowClear
                    filterOption={false}
                    showSearch
                    onSearch={setSearchCountry}
                    handleChange={e => {
                        if (e===undefined){
                            setSearchCountry('');
                        }                       
                    }}
                />
            ) : (
                <Skeleton.Input active block />
            )}

            <TextInput
                name="dataMBs"
                label="Data Pack in MB's"
                type="text"
                placeholder="Enter Plan Data Pack"
                isRequired
                classes="rounded-sm"
                maxLength={100}
                allowDecimalsOnly
            />

            <TextInput
                name="periodDays"
                label="Plan Validity in Days"
                type="text"
                placeholder="Enter Plan validity"
                classes="rounded-sm"
                maxLength={10}
                allowNumbersOnly
                isRequired
            />
            <TextInput
                name="amount"
                label="Plan Amount"
                type="text"
                isRequired
                placeholder="Enter Plan Amount"
                classes="rounded-sm"
                maxLength={10}
                allowDecimalsOnly
            />
        </Form>
    </Flex>
);

export default EsimPlanForm;
