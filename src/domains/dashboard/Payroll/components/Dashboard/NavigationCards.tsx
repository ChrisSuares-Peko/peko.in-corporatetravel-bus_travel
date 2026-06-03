import React from 'react';

import { Flex, Image, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { CardProps } from '@domains/dashboard/Payroll/types/types';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

const NavigationCards = ({ icon, title, link, isActive, reference }: CardProps) => {
    const dispatch = useAppDispatch();

    const displayMessage = () => {
        dispatch(showToast({ variant: 'info', description: 'Coming soon' }));
    };

    const handleClick = () => {
        if (!link) {
            displayMessage();
        }
    };

    return (
        <>
            <Link to={link}>
                <Flex
                    ref={reference}
                    vertical
                    gap={18}
                    align="center"
                    justify="center"
                    className="xs:hidden md:flex transition duration-300 transform cursor-pointer hover:scale-110 "
                    onClick={handleClick}
                >
                    <Flex
                        className=" h-24 w-24 bg-bgIconCard rounded-3xl "
                        align="center"
                        justify="center"
                    >
                        <Image width={40} preview={false} src={icon} />
                    </Flex>
                    <Typography.Text
                        {...(!isActive && { disabled: true })}
                        className="text-xs md:text-center  w-24"
                    >
                        {title}
                    </Typography.Text>
                </Flex>
            </Link>
            <Link to={link}>
                <Flex
                    className="md:hidden xs:flex my-2"
                    align="center"
                    justify="center"
                    gap="middle"
                    vertical
                    onClick={handleClick}
                >
                    <Flex className="min-w-[3rem]  xxl:h-36 h-10 bg-bgIconCard rounded-3xl">
                        <Image width={30} preview={false} src={icon} />
                    </Flex>

                    <Typography.Text
                        {...(!isActive && { disabled: true })}
                        className="text-xs mt-2 w-full font-medium "
                    >
                        {title}
                    </Typography.Text>
                </Flex>
            </Link>
        </>
    );
};

export default NavigationCards;
