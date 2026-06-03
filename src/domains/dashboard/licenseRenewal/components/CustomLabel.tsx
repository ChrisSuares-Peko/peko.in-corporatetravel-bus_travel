import React from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Flex } from 'antd';

interface CustomLabelProps {
    label: string;
    className: string;
}
const CustomLabel: React.FC<CustomLabelProps> = ({ label, className }) => (
    <Flex gap={10} className={`text-[.9rem] text-center sm:text-[1rem] ${className}`}>
        {label} <InfoCircleOutlined style={{ color: '#D9D9D9' }} />
    </Flex>
);

export default CustomLabel;
