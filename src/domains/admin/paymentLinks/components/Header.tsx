import React from 'react';

import { Flex, Row, theme, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

const PaymentLinksHeader = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    return (
        <Row justify="space-between" className="w-full gap-5">
            <Flex className="flex justify-start gap-3">
                <Typography.Text className="text-3xl font-medium">Track Payments</Typography.Text>
            </Flex>
            <Flex className="flex-col justify-end w-full gap-3 px-0 md:flex-row md:w-auto mr-4">
                <Link
                    className="w-full sm:w-fit border border-[#FF3A3A] flex justify-center items-center px-4 py-2"
                    to={`${paths.systemUser.paymentLinks}/create-payment-link`}
                >
                    <Typography.Text style={{ color: colorPrimary }}>
                        Create Payment Link
                    </Typography.Text>
                </Link>
            </Flex>
        </Row>
    );
};

export default PaymentLinksHeader;
