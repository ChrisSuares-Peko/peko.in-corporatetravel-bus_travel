import React from 'react';

import { Flex, Typography } from 'antd';

import TextInput from '@components/atomic/inputs/TextInput';

const { Text } = Typography;

interface InputFieldProps {
    label: string;
    name: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, placeholder, onChange }) => (
    <Flex justify="space-between" align="center" className="mb-4">
        <Text className="font-semibold">{label}</Text>
        <TextInput
            formItemClass="mb-0"
            name={name}
            placeholder={placeholder}
            values={value}
            type="text"
            isRequired
            allowNumbersOnly
            handleChange={onChange}
        />
    </Flex>
);

export default InputField;
