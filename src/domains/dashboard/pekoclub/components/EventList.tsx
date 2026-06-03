import React from 'react';

import { Button, Card, Flex, Image, Typography } from 'antd';
import { Link } from 'react-router-dom';
import '../assets/style.css';

interface pekoClub {
    image: string;
    name: string;
    desc: string;
}
const EventList = ({ image, name, desc }: pekoClub) => (
    <Card className="card-style xs:bg-white mt-6 md:bg-white  border-2 rounded-xl">
        <Link to="">
            <Flex vertical gap={10}>
                <Flex
                    className="w-full rounded-2xl sm:rounded-3xl object-contain hover:scale-105"
                    align="center"
                    justify="center"
                >
                    <Image preview={false} src={image} width="100%" height="100%" />
                </Flex>

                <Typography.Text className="mt-3 md:text-base font-medium">{name}</Typography.Text>
                <Typography.Text className="text-xs font-thin text-start  ">{desc}</Typography.Text>
                <Flex>
                    <Typography.Text className="text-textGreyColor font-thin text-xs">
                        World Trade Centre, Dubai
                    </Typography.Text>
                    <Typography.Text className="text-textGreyColor font-thin text-xs ml-5">
                        November 03 to November 04
                    </Typography.Text>
                </Flex>
                <Button size="middle" className="px-5 w-full  rounded-md mt-1" danger>
                    Book Now
                </Button>
            </Flex>
        </Link>
    </Card>
);

export default EventList;
