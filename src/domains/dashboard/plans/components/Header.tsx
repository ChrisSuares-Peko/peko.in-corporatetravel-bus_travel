import React from 'react';

import { Flex, Typography, Col, Image } from 'antd';

import PekoOne from '@src/domains/dashboard/plans/assets/logo/PekoOne.png';

type Props = {};

const Header = (props: Props) => (
    <>
        <Flex align="center" justify="center" gap={10} className="w-full">
            <Typography.Text className="text-3xl font-medium">Upgrade to</Typography.Text>
            <Image src={PekoOne} preview={false} width={110} />
        </Flex>
        <Col span={20} lg={14} className="text-center">
            <Typography.Text>
                Explore our range of subscription plans to unlock exclusive features and simplify
                your payments with Peko. Choose the perfect plan that fits your needs and enjoy a
                seamless payment experience hassle-free!
            </Typography.Text>
        </Col>
    </>
);

export default Header;
