import React from 'react';

import { Card, Flex, Image, Typography } from 'antd';
import { Link } from 'react-router-dom';
import '../assets/style.css';

interface pekoClub {
    image: string;
    name: string;
    desc: string;
}
const NewsLists = ({ image, name, desc }: pekoClub) => (
    <Card className="card-style xs:bg-white mt-6 md:bg-white  border-2 rounded-md">
        <Link to="">
            <Flex vertical gap={10}>
                <Flex
                    className="w-full rounded-2xl sm:rounded-3xl object-contain "
                    align="center"
                    justify="center"
                >
                    <Image preview={false} src={image} width="100%" height="100%" />
                </Flex>

                <Typography.Text className="mt-3 md:text-base font-medium line-clamp-1">
                    {name}
                </Typography.Text>
                <Typography.Text className="text-xs font-thin text-start  line-clamp-2">
                    {desc}
                </Typography.Text>
            </Flex>
        </Link>
    </Card>
);

export default NewsLists;
