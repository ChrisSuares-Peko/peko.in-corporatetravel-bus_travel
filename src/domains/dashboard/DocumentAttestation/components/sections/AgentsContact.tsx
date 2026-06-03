import React from 'react';

import { Flex, Typography } from 'antd';

type AgentsContactProps = {};

const AgentsContact: React.FC<AgentsContactProps> = () => {
    const { Title } = Typography;
    return (
        <Flex vertical className="pt-0 md:pt-9" gap={8}>
            <Title level={5}>Your Executive Agent Contact </Title>
            <Typography.Text>Akshay</Typography.Text>
            <Typography.Text>+055197622920</Typography.Text>
            <Typography.Text>akshay@gmail.com</Typography.Text>
        </Flex>
    );
};

export default AgentsContact;
