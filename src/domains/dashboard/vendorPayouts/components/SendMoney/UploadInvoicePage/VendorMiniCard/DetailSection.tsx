import React from 'react';

import { Space, Typography } from 'antd';

const { Text } = Typography;

interface DetailSectionProps {
    label: string;
    value: string;
}

const DetailSection: React.FC<DetailSectionProps> = ({ label, value }) => (
    <Space className="mb-2">
        <Text className="text-[16px] md:text-[13px]">{label} -</Text>
        <Text className="font-medium text-[16px] md:text-[13px]">{value}</Text>
    </Space>
);

export default DetailSection;
