import React from 'react';

import { Card, Flex, Image, Typography } from 'antd';

interface pekoclub {
    image: string;
    title: string;
}
const BenefiteCard = ({ image, title }: pekoclub) => (
    <Card
        size="small"
        className="xs:hidden md:block  rounded-2xl border-0 transition duration-300 transform cursor-pointer hover:scale-105"
    >
        <Flex
            gap={15}
            className="h-28 rounded-2xl sm:rounded-3xl"
            vertical
            align="center"
            justify="center"
        >
            <Image width={60} preview={false} src={image} />
            <Typography
                dangerouslySetInnerHTML={{ __html: title! }}
                className="text-sm text-wrap text-center px-3 mt-2"
                // style={{ lineHeight: '1.5' }}
            />
            {/* <Typography.Text className="text-sm text-wrap text-center ">{title}</Typography.Text> */}
        </Flex>
    </Card>
);

export default BenefiteCard;
