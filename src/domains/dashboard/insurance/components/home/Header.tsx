import React from 'react';

import { Button, Col, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import useScreenSize from '@src/hooks/useScreenSize';
import { paths } from '@src/routes/paths';

type Props = {};

const Header = (props: Props) => {
    const navigate = useNavigate();
    const screens = useScreenSize();

    return (
        <Col span={24}>
            <Flex justify="space-between" align="baseline">
                <Typography.Text className="xs:text-lg sm:text-2xl font-normal">
                    Insurance
                </Typography.Text>
                <Button
                    onClick={() => navigate(paths.insurance.orders)}
                    danger
                    type="default"
                    size={screens.xs ? 'small' : 'middle'}
                >
                    Order History
                </Button>
            </Flex>
        </Col>
    );
};

export default Header;
