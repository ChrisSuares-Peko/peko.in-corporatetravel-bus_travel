import React from 'react';

import { Flex, Image, Typography } from 'antd';

interface cardProps {
    name: string;
    image: string;
    description: string;
}
const WorkspaceList = ({ image, name, description }: cardProps) => (
    <Flex
        className="relative flex-col transform cursor-pointer xs:bg-white md:bg-white"
        style={{
            transition: 'transform .3s ease-in-out',
        }}
    >
        {/* <Link to={`${paths.subscriptions.details}/${id}`}> */}
        <Flex vertical gap={10} align="center">
            <Flex
                className={` w-28 sm:w-24 md:h-28 xs:h-24 rounded-2xl sm:rounded-3xl`}
                align="center"
                justify="center"
            >
                <Image preview={false} src={image} width="100%" />
            </Flex>
        </Flex>
        {/* </Link> */}
        <Flex vertical justify="center" align="center">
            <Typography.Text
                className="md:text-[.75rem] xxl:text-sm text-black mt-2 w-40"
                style={{
                    fontWeight: 'bold', // Bold styling for the name
                }}
            >
                {name} -
                <span style={{ fontWeight: 'normal', color: '#000000' }}>{description}</span>
            </Typography.Text>
        </Flex>
    </Flex>
);

export default WorkspaceList;
