import { useEffect } from 'react';

import { Flex, Form } from 'antd';
import { useFormikContext } from 'formik';

import SelectInput from '@components/atomic/inputs/SelectInput';
import SwitchInput from '@components/atomic/inputs/SwitchInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { DropDown } from '@customtypes/general';

interface BankFormProps {
    refresh: boolean;
    isOtpOpen: boolean;
    accountTypesList: DropDown;
}

const BankForm = ({ refresh, isOtpOpen, accountTypesList }: BankFormProps) => {
    const { resetForm, setSubmitting } = useFormikContext();

    useEffect(() => {
        resetForm();
    }, [refresh, resetForm]);

    useEffect(() => {
        if (!isOtpOpen) setSubmitting(false);
    }, [isOtpOpen, setSubmitting]);

    return (
        <Flex vertical className="mt-6 w-full">
            <Form layout="vertical">
                <TextInput
                    name="accountHolderName"
                    label="Account Holder Name"
                    type="text"
                    placeholder="Enter Account Holder Name"
                    classes=" rounded-sm "
                    allowAlphabetsAndSpaceOnly
                    maxLength={50}
                    isRequired
                />
                <TextInput
                    name="bankName"
                    label="Bank Name"
                    type="text"
                    placeholder="Enter Bank Name"
                    classes=" rounded-sm"
                    allowAlphabetsAndSpaceOnly
                    maxLength={50}
                    isRequired
                />
                <TextInput
                    name="accountNumber"
                    label="Account Number"
                    type="text"
                    placeholder="Enter Account Number"
                    classes=" rounded-sm"
                    allowNumbersOnly
                    maxLength={16}
                    isRequired
                />
                <TextInput
                    name="bankAddress"
                    label="Bank Address"
                    type="text"
                    placeholder="Enter Bank Address"
                    classes=" rounded-sm"
                    maxLength={50}
                    isRequired
                />
                <TextInput
                    name="iban"
                    label="IBAN Number"
                    type="text"
                    placeholder="Enter IBAN Number"
                    classes=" rounded-sm"
                    allowAlphabetsAndNumbersOnly
                    maxLength={23}
                    tooltipText="23 character code starting with 'AE'"
                    showToolTip
                    isRequired
                />
                <TextInput
                    name="swiftCode"
                    label="Swift Code"
                    type="text"
                    placeholder="Enter Swift Code"
                    classes=" rounded-sm"
                    allowAlphabetsAndNumbersOnly
                    maxLength={11}
                    minLength={8}
                    isRequired
                />
                <SelectInput
                    name="accountType"
                    label="Account Type"
                    placeholder="Select Account Type"
                    classes=" rounded-sm "
                    options={accountTypesList}
                    isRequired
                />
                <SwitchInput name="default" label="Primary Bank Account" />
            </Form>
        </Flex>
    );
};

export default BankForm;
