import type { FC } from 'react';

import { Flex, Typography } from 'antd';

interface TaxRegistrationHeaderProps {}

const TaxRegistrationHeader: FC<TaxRegistrationHeaderProps> = () => (
    <Flex vertical>
        <Typography.Paragraph className="text-xl font-medium">
            Corporate Tax Registration
        </Typography.Paragraph>
    </Flex>
);

export default TaxRegistrationHeader;
