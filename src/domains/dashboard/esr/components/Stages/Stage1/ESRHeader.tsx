import type { FC } from 'react';

import { Flex, Typography } from 'antd';

interface ESRHeaderProps {}

const ESRHeader: FC<ESRHeaderProps> = () => (
    <Flex vertical>
        <Typography.Paragraph className="text-xl font-medium">ESR Assessment</Typography.Paragraph>
    </Flex>
);

export default ESRHeader;
