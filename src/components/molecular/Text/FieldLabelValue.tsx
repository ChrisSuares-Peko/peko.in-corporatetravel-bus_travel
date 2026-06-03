import React from 'react';

import { Flex, Typography } from 'antd';

interface FieldLabelValueProps {
    label: string;
    value: string | number | undefined | null;
}

const FieldLabelValue: React.FC<FieldLabelValueProps> = ({ label, value }) => (
    <Flex vertical gap={12}>
        <Typography.Text className=" text-titleText font-normal text-sm">{label}</Typography.Text>
        <Typography.Text className=" text-valueText font-normal text-custom">
            {value ?? 'N/A'}
        </Typography.Text>
    </Flex>
);

export default FieldLabelValue;
