import type { FC } from 'react';

import { Flex, Typography } from 'antd';

interface VatHeaderProps {}

const VatHeader: FC<VatHeaderProps> = () => (
    <Flex vertical>
        <Typography.Paragraph className="text-xl font-medium">
            VAT Registration
        </Typography.Paragraph>
    </Flex>
);

export default VatHeader;
