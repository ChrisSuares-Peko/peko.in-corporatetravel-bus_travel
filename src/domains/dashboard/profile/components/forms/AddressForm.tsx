import React, { useEffect } from 'react';

import { Flex, Form } from 'antd';
import { useFormikContext } from 'formik';

import UAEFlag from '@assets/svg/uaeflag.svg';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SwitchInput from '@components/atomic/inputs/SwitchInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { DropDown } from '@customtypes/general';

interface AddressFormProps {
    refresh: boolean;
    addressTypesList: DropDown;
}
const AddressForm = ({ refresh, addressTypesList }: AddressFormProps) => {
    const { resetForm } = useFormikContext();
    useEffect(() => {
        resetForm();
    }, [refresh, resetForm]);

    return (
        <Flex vertical className="mt-6 w-full">
            <Form layout="vertical">
                <SelectInput
                    name="addressType"
                    label="Type"
                    placeholder="Select Type"
                    classes=" rounded-sm "
                    options={addressTypesList}
                    isRequired
                />
                <TextInput
                    name="name"
                    label="Name"
                    type="text"
                    placeholder="Enter Name"
                    classes=" rounded-sm "
                    allowAlphabetsAndSpaceOnly
                    maxLength={50}
                    isRequired
                />
                <TextInput
                    name="addressLine1"
                    label="Address Line 1"
                    type="text"
                    placeholder="Enter Address Line 1"
                    classes=" rounded-sm"
                    isRequired
                    maxLength={50}
                />
                <TextInput
                    name="addressLine2"
                    label="Address Line 2"
                    type="text"
                    placeholder="Enter Address Line 2"
                    classes=" rounded-sm"
                    maxLength={50}
                    isRequired
                />
                <TextInput
                    name="phoneNumber"
                    label="Mobile Number"
                    type="text"
                    placeholder="Enter Mobile Number"
                    // classes=" rounded-sm"
                    allowNumbersOnly
                    isRequired
                    maxLength={10}
                    prefix={
                        <Flex
                            align="center"
                            gap={6}
                            className="p-2 h-full border-e me-2 cursor-not-allowed"
                        >
                            <img src={UAEFlag} alt="" />
                            <p>+971</p>
                        </Flex>
                    }
                    classes=" p-0"
                />
                <SwitchInput name="default" label="Default Address" />
            </Form>
        </Flex>
    );
};
export default AddressForm;
