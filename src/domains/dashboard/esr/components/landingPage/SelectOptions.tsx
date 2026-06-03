import React from 'react';

import { Select } from 'antd';
import { Flex } from 'antd/lib';

import { DropDown } from '@customtypes/general';

interface SelectOptionsProps {
    options: DropDown;
    defaultValue?: string;
    value: string;
    dropdownAlign?: object;
    onChange?: ((value: string) => void) | undefined;
}

const SelectOptions: React.FC<SelectOptionsProps> = ({
    options,
    defaultValue,
    dropdownAlign,
    value,
    onChange,
}) => (
    <Select
        value={value}
        style={{ width: '100%' }}
        dropdownAlign={dropdownAlign}
        dropdownRender={menu => <Flex vertical>{menu}</Flex>}
        onChange={onChange}
    >
        {options.map((option, index) => (
            <Select.Option key={index} value={option.value}>
                {option.label}
            </Select.Option>
        ))}
    </Select>
);

export default SelectOptions;
