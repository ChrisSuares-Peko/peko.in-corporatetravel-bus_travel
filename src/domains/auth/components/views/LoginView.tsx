import React from 'react';

import { Row, Flex, Image } from 'antd';

import logo from '@assets/mainLogo/standard';
import { useAppDispatch } from '@src/hooks/store';
import { setChat } from '@src/slices/chatSlice';

import LoginForm from '../forms/LoginForm';
import LoginFooter from '../sections/LoginFooter';
import LoginTitle from '../sections/LoginTitle';
import SocialButtons from '../sections/SocialButtons';

const LoginView = () => {
    const dispatch = useAppDispatch();
    dispatch(setChat({ chatId: '', sessionId: '' }));
    return (
        <Row className="min-h-svh w-full items-center  ">
            <Row justify="center" align="middle" className="w-full pb-0 xl:self-end ">
                <Flex justify="center" align="center" vertical gap={20}>
                    <Image
                        src={logo}
                        alt="logo"
                        preview={false}
                        className=" hidden md:flex -mb-7"
                        width={190}
                    />
                    <LoginTitle />
                    <Flex justify="center" align="center" vertical gap={20}>
                        <LoginForm />
                        {/* <Typography.Text style={{ color: 'GrayText' }}>OR</Typography.Text> */}
                        <SocialButtons />
                    </Flex>
                </Flex>
            </Row>
            <LoginFooter />
        </Row>
    );
};

export default LoginView;
