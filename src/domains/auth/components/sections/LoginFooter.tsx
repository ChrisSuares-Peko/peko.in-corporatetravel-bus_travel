import React from 'react';

import { Flex, Typography } from 'antd';
import { Link } from 'react-router-dom';

const LoginFooter = () => (
    <Flex justify="space-between" className="self-end hidden w-full px-10 pb-4 md:flex">
        <Typography.Text className="text-xs text-textGrey">
            © 2024 Peko Payment Services LLC, All Rights Reserved
        </Typography.Text>
        <Flex gap={8}>
            <Link to="https://peko.one/ae/platform-agreement" target="_blank">
                <Typography.Text className="text-xs text-textGrey">
                    Peko Platform Agreement |
                </Typography.Text>
            </Link>
            <Link to="https://peko.one/ae/privacy-policy" target="_blank">
                <Typography.Text className="text-xs text-textGrey">
                    Privacy Policy |
                </Typography.Text>{' '}
            </Link>
            <Link to="https://peko.one/ae/refund-policy" target="_blank">
                <Typography.Text className="text-xs text-textGrey">Refund Policy |</Typography.Text>{' '}
            </Link>
            <Link to="https://peko.one/ae/cookie-policy" target="_blank">
                <Typography.Text className="text-xs text-textGrey">Cookie Policy</Typography.Text>
            </Link>
        </Flex>
    </Flex>
);

export default LoginFooter;
