import React from 'react';

import { Typography, Flex, Image } from 'antd';
import { Link, useLocation } from 'react-router-dom';

import logo from '@assets/Logo.png';
import updated from '@assets/svg/updated.svg';

const ResetPasswordSuccess = () => {
    const { Title } = Typography;
    const { state } = useLocation();
    const isForgot = state?.isForgot === 'true';

    return (
        <Flex className="w-full relative h-screen" align="center" justify="center">
            <Image
                src={logo}
                alt="icon"
                className="hidden sm:inline-block sm:absolute sm:left-14 sm:-top-14 "
            />
            <Flex className="items-center justify-center w-full flex-col gap-3">
                <Flex vertical justify="center" align="center" gap={8}>
                    <Image src={updated} preview={false} alt="" />
                    <Title level={3}>Password {isForgot ? 'Updated' : 'Created'}</Title>
                    <Link to="/auth/login">
                        <Flex className="border border-red-500 px-14">
                            <Typography.Text className="text-red-500">Login</Typography.Text>
                        </Flex>
                    </Link>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ResetPasswordSuccess;
