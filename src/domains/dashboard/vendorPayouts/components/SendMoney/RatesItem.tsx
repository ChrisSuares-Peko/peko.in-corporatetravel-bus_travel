import React from 'react';

import { Typography, Flex } from 'antd';

const { Text } = Typography;

interface RatesItemProps {
    label: string;
    value: string | number;
}

const RatesItem: React.FC<RatesItemProps> = ({ label, value }) => (
    <Flex className="flex flex-row md:flex-col justify-between items-start w-full m-2">
        <Text className="md:text-[12px] text-start whitespace-nowrap">{label}</Text>
        <Text className="md:text-[14px] text-start font-bold whitespace-nowrap md:ml-0 mt-0 md:mt-2">
            {value}
        </Text>
    </Flex>
);

export default RatesItem;
