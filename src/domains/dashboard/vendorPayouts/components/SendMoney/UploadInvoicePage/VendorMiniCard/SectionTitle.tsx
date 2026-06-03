import React from 'react';

import { Flex, Typography } from 'antd';

const { Text } = Typography;

interface SectionTitleProps {
    title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
    <Flex className="mb-4 mt-2 md:mt-0">
        <Text className="md:text-[14px] text-[18px] text-textGrey">{title}</Text>
    </Flex>
);

export default SectionTitle;
