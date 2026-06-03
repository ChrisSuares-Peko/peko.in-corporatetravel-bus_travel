import React from 'react';

import { Badge, Card, Flex, Image, Typography } from 'antd';

interface HeroCardProps {
    image: string;
    text: string;
    count: number;
}

const HeroCard: React.FC<HeroCardProps> = ({ image, text, count }) => (
    <Flex vertical align="center" justify="center" className="bg-red-">
        <Badge
            className="mb-[2.5rem] hidden sm:block"
            count={count}
            style={{
                fontSize: '.9rem',
                height: '1.5rem',
                width: '1.5rem',
                borderRadius: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        />
        <Card style={{ border: 'none', textAlign: 'center', width: 350 }} type="inner">
            <Image preview={false} src={image} alt="hero" height={100} />
        </Card>
        <Typography.Text className="text-sm text-center sm:px-10">{text}</Typography.Text>
    </Flex>
);

export default HeroCard;
