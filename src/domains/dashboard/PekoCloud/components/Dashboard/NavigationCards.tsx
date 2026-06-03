import React from 'react';

import { Flex, Image, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { CardProps } from '@domains/dashboard/PekoCloud/types/types';

const NavigationCards = ({ icon, title, link, isActive }: CardProps) => (
    <>
        <Link to={link}>
            <Flex
                vertical
                gap={12}
                align="center"
                justify="center"
                className="xs:hidden h-30 w-24 md:flex transition duration-300 transform cursor-pointer hover:scale-110 "
            >
                <Flex
                    className=" h-24 w-24 bg-bgIconCard rounded-3xl"
                    align="center"
                    justify="center"
                >
                    <Image width={35} preview={false} src={icon} />
                </Flex>
                <Typography.Text
                    {...(!isActive && { disabled: true })}
                    className="text-xs text-center text-wrap"
                >
                    {title}
                </Typography.Text>
            </Flex>
        </Link>
        <Link to={link}>
            <Flex
                className="md:hidden xs:flex my-2 h-30 w-24"
                align="center"
                justify="center"
                gap="middle"
                vertical
            >
                <Flex
                    className="min-w-[5rem] h-24 w-24 xxl:h-28 bg-bgIconCard rounded-3xl"
                    align="center"
                    justify="center"
                >
                    <Image width={40} preview={false} src={icon} />
                </Flex>

                <Typography.Text
                    {...(!isActive && { disabled: true })}
                    className="text-xs mt-2 w-full font-medium text-center flex items-center text-wrap justify-center"
                >
                    {title}
                </Typography.Text>
            </Flex>
        </Link>
    </>
);

export default NavigationCards;
