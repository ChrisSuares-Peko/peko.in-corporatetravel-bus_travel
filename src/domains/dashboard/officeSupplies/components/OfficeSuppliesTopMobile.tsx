import React from 'react';

import { Button, Col, Flex, Grid, Image, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import CartIcon from '../assets/icons/cart-icon.png';

const { useBreakpoint } = Grid;

const OfficeSuppliesTopMobile = ({
    titleHidden,
    cartCount,
}: {
    titleHidden?: boolean;
    cartCount: number;
}) => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    return (
        <Row
            className={`md:hidden ${titleHidden ? 'hidden' : ''} mt-5 mb-6`}
            // gutter={[10, 10]}
            justify="space-between"
            align="top"
        >
            <Col xs={16} sm={16}>
                <Typography.Paragraph className="text-lg font-medium">
                    Office Supplies
                </Typography.Paragraph>
            </Col>
            <Col xs={8} sm={8} className="flex items-end w-full">
                <Button
                    type="default"
                    danger
                    size={screens.xs ? 'small' : 'middle'}
                    className="text-xs ms-1"
                    style={{ borderRadius: '4px' }}
                    onClick={() => {
                        navigate(
                            `${paths.dashboard.officeSupplies}/${paths.officeSupplies.orderHistory}`
                        );
                    }}
                >
                    Order History
                </Button>
                <Button
                    onClick={() =>
                        navigate(
                            `${paths.dashboard.officeSupplies}/${paths.officeSupplies.cartPage}`
                        )
                    }
                    size={screens.xs ? 'small' : 'middle'}
                    className="border-none relative shadow-none flex justify-start"
                >
                    <Image
                        className="hover:fill-red-500 "
                        src={CartIcon}
                        preview={false}
                        width={26}
                    />
                    <Flex
                        className="w-5 h-5 rounded-full bg-red-500"
                        justify="center"
                        align="center"
                        style={{ position: 'absolute', top: -6, right: -2 }}
                    >
                        <Typography.Text className="text-white text-xs font-medium">
                            {cartCount}
                        </Typography.Text>
                    </Flex>
                </Button>
            </Col>
        </Row>
    );
};

export default OfficeSuppliesTopMobile;
