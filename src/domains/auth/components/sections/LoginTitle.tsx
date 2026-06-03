import React from 'react';

import { Flex, Typography, Image } from 'antd';

import logo from '@assets/mainLogo/standard';

const LoginTitle = () => (
    <>
        <Typography.Text className=" hidden md:text-lg md:inline-block ">
            Sign in to your Peko account
        </Typography.Text>
        <Flex vertical className="flex md:hidden" gap={24}>
            <Image src={logo} alt="logo" preview={false} width={180} className="-mb-8 ml-6" />
            <Typography.Text className="text-lg text-center font-medium">
                Sign in to your Peko account
            </Typography.Text>
        </Flex>
    </>
);

export default LoginTitle;
