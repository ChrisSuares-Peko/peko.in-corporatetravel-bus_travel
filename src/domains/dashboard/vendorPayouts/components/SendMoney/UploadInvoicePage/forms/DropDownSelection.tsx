import React from 'react';

import { Typography, Space } from 'antd';

import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';

interface FormSectionProps {
    title: string;
    options: { label: string; value: string }[];
    onChange?: (value: string) => void;
}

const DropDownSelection: React.FC<FormSectionProps> = ({ title, options, onChange }) => (
    <Space direction="vertical" className="w-full text-start">
        <Typography.Text className="text-sm font-semibold">{title}</Typography.Text>

        <SelectInputWithSearch
            placeholder="Select Beneficiary"
            options={options}
            classes="w-full"
            handleChange={onChange}
            name="SelectBeneficiary"
        />
    </Space>
);

export default DropDownSelection;
