import React from 'react';

import { Card, Flex, Image, Typography } from 'antd';

import { CardProps } from '@domains/dashboard/Payroll/types/types';

const NavigationCards = ({ icon, title, link, isActive }: CardProps) => (
    <>
        <Card size="small" className="xs:hidden md:block bg-bgIconCard rounded-2xl border-0">
            <Flex
                gap={15}
                className="h-28 rounded-2xl sm:rounded-3xl"
                vertical
                align="center"
                justify="center"
            >
                <Image width={40} preview={false} src={icon} />
                <Typography.Text
                    {...(!isActive && { disabled: true })}
                    className="text-xs text-wrap text-center"
                >
                    {title}
                </Typography.Text>
            </Flex>
        </Card>
        <Flex
            className="md:hidden xs:flex my-2"
            align="center"
            justify="center"
            gap="middle"
            vertical
        >
            <Flex className="bg-slate-100 rounded-full border-0 p-5">
                <Image width={40} preview={false} src={icon} />
            </Flex>
            <Typography.Text
                {...(!isActive && { disabled: true })}
                className="text-xs mt-2 w-full font-medium text-center flex items-center justify-center"
            >
                {title}
            </Typography.Text>
        </Flex>
    </>
);

export default NavigationCards;
