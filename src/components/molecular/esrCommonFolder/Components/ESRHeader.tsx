import type { FC } from 'react';

import { Flex, Typography } from 'antd';

interface ESRHeaderProps {
    title: string;
}

const ESRHeader: FC<ESRHeaderProps> = ({ title }) => (
    <Flex vertical>
        <Typography.Paragraph className="text-xl font-medium">{title}</Typography.Paragraph>
    </Flex>
);

export default ESRHeader;
