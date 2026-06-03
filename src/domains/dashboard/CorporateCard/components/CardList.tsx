import React from 'react';

import { Flex, Grid, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

interface cardProps {
    icon: string;
    title: string;
    desc: string;
}
const CardList = ({ icon, title, desc }: cardProps) => {
    const screens = Grid.useBreakpoint();
    return (
        <Flex vertical>
            <Flex
                vertical
                className="transition duration-300 transform cursor-pointer hover:scale-105"
            >
                <Flex
                    vertical
                    className=" md:h-48 sm:h-28 bg-bgIconCard rounded-lg sm:rounded-2xl p-5"
                >
                    <ReactSVG className="more-services" src={icon} />
                    <Typography.Text className="text-[.65rem] font-medium sm:text-[0.875rem] pt-1 sm:pt-3">
                        {title}
                    </Typography.Text>
                    <Typography.Text className="md:text-[.61rem] xxl:text-[.65rem] xs:line-clamp-2 xl:line-clamp-none  pt-1 ">
                        {desc}
                    </Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default CardList;
