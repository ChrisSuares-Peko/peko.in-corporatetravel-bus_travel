import React from 'react';

import { Form, Grid } from 'antd';
import { useFormikContext } from 'formik';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { accessKeys } from '@utils/accessKeys';

import { BeneficiaryFormProps } from '../../types';
import { beneficiaryOptions, findObjectByAccessKey } from '../../utils/data';

const BeneficiaryForm = ({
    accesskeyValue,
    selectedProvider,
    setSelectedProvider,
}: BeneficiaryFormProps) => {
    const { setFieldValue } = useFormikContext();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const { Salik, Lootah, etisalatPostpaid, dUPostpaid, darb, hafilat } = accessKeys;
    const item = findObjectByAccessKey(accesskeyValue || selectedProvider!)?.inputComponents.find(
        obj => obj.name === 'accountNumber'
    );
    const handleChange = (e: string) => {
        setFieldValue('accountNo', '');
        if (setSelectedProvider) setSelectedProvider(e);
    };
    let labelName;
    if (accesskeyValue === darb) {
        labelName = 'Traffic Number';
    }
    return (
        <Form layout="vertical">
            {!accesskeyValue && (
                <SelectInput
                    name="accessKey"
                    options={beneficiaryOptions}
                    placeholder="Select Service Provider"
                    label="Select Service Provider"
                    handleChange={handleChange}
                    isRequired
                />
            )}

            <TextInput
                name="name"
                label="Beneficiary Name"
                type="text"
                size={screens.xxl ? 'large' : 'middle'}
                placeholder="Example: JoXXX"
                maxLength={40}
                isRequired
                allowedInputKeys={value => value.replace(/[^a-zA-Z0-9.\-_@:&'/,\s]/g, '')}
            />
            <TextInput
                name="accountNo"
                label={item?.label || labelName || 'Mobile Number/Account Number'}
                type="text"
                size={screens.xxl ? 'large' : 'middle'}
                placeholder="Example: XXXXXXX"
                maxLength={item?.max || 15}
                allowAlphabetsAndNumbersOnly={
                    accesskeyValue === Lootah || selectedProvider === Lootah
                }
                allowNumbersOnly
                allowNumbersAndDots={
                    accesskeyValue === dUPostpaid || selectedProvider === dUPostpaid
                }
                isRequired
            />
            {accesskeyValue === Salik || selectedProvider === Salik ? (
                <TextInput
                    name="optional1"
                    label="Account PIN"
                    type="text"
                    size={screens.xxl ? 'large' : 'middle'}
                    placeholder="Example: 1234"
                    maxLength={4}
                    allowNumbersOnly
                    isRequired
                />
            ) : (
                ''
            )}
            {accesskeyValue === darb || selectedProvider === darb ? (
                <TextInput
                    name="optional1"
                    label="Emirates ID"
                    type="text"
                    size={screens.xxl ? 'large' : 'middle'}
                    placeholder="Example:123-XXXX-XXXXXXX-X"
                    maxLength={15}
                    allowNumbersOnly
                    isRequired
                />
            ) : (
                ''
            )}

            {accesskeyValue === etisalatPostpaid || selectedProvider === etisalatPostpaid ? (
                <SelectInput
                    name="optional1"
                    label="Type of Service"
                    size={screens.xxl ? 'large' : 'middle'}
                    placeholder="Please select a service type"
                    isRequired
                    options={[
                        { value: 'GSM', label: 'Postpaid' },
                        { value: 'DEL', label: 'Landline' },
                        { value: 'DAILUP', label: 'Internet' },
                        { value: 'BROADBAND', label: 'AlShamil' },
                        { value: 'EVSION', label: 'eVision' },
                        { value: 'ELIFE', label: 'eLife' },
                    ]}
                />
            ) : (
                ''
            )}
        </Form>
    );
};

export default BeneficiaryForm;
