import React from 'react';

import { Typography, Flex } from 'antd';
import { Link } from 'react-router-dom';

import SignupLogo from '@assets/svg/SignupImage.png';
import { paths } from '@src/routes/paths';

import ResetPasswordForm from '../forms/ResetPasswordForm';

const { Title } = Typography;

interface ResetPasswordProps {
    handleSubmit: (token: string) => void | Promise<any>;
    isLoading: boolean;
    validatePassword: (password: string) => string[];
    isForgot: boolean;
}

const ResetPassword = ({
    handleSubmit,
    isLoading,
    validatePassword,
    isForgot,
}: ResetPasswordProps) => (
    <Flex justify="space-between" align="center" className="w-full h-screen">
        <Flex justify="center" align="center" vertical gap={4} className="w-full xl:w-1/2">
            <Flex vertical gap={15} justify="center" className="w-[25rem]">
                <Title level={4}>{isForgot ? 'Reset ' : 'Set '}Password</Title>

                <ResetPasswordForm
                    handleFormSubmit={handleSubmit}
                    isLoading={isLoading}
                    validatePassword={validatePassword}
                />
                <Flex justify="center" className="pt-3">
                    <Link to={paths.auth.jwt.login}>
                        <Typography.Text className="text-red-400 text-sm text-center">
                            Go back
                        </Typography.Text>
                    </Link>
                </Flex>
            </Flex>
        </Flex>

        <Flex
            className="h-svh max-w-[48rem] xxl:max-w-[52rem]  relative overflow-hidden hidden xl:flex"
            style={{ backgroundImage: `url(${SignupLogo})` }}
        >
            <Typography.Text className="text-3xl text-white font-thin self-end p-4 pb-8 z-10">
                All-in-one platform for SMBs to manage all their payments, expenses, travel,
                insurance, and automate operations
            </Typography.Text>
        </Flex>
    </Flex>
);

export default ResetPassword;
