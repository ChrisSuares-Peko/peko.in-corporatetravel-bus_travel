import React from 'react';

import { Badge, Flex, Typography, Image } from 'antd';

interface IconCardProps {
    icon: string;
    title: string;
    count: string;
}

const IconCard: React.FC<IconCardProps> = ({ icon, title, count }) => (
    <Flex vertical className="w-1/2">
        <Flex justify="center" className="mb-3">
            <Badge count={count} />
        </Flex>
        <Flex vertical align="center" justify="center" style={{ height: '100%' }}>
            {/* <ReactSVG src={icon} /> */}
            <Image preview={false} src={icon} />
        </Flex>

        <Flex vertical className="text-center mt-4">
            <Typography.Text className="text-base font-normal">{title}</Typography.Text>
        </Flex>
    </Flex>
);

export default IconCard;
