import React from 'react';

import { Button, Col, Flex, Row, Typography } from 'antd';

interface TransferBreakdownProps {
    amount: string | undefined;
    currency: string;
    exchangeRate: number | undefined;
    charge: number | undefined;
    // vat: number | undefined;
    total: string;
    beneficiaryReceives: string;
}
const TransferBreakdown: React.FC<TransferBreakdownProps> = ({
    amount,
    currency,
    exchangeRate,
    charge,
    //   vat,
    total,
    beneficiaryReceives,
}) => (
    <Flex className="px-4">
        <Flex
            vertical
            className="border border-[#F9F9F9] rounded-3xl p-4 mt-6 w-full bg-[#F9F9F9] "
        >
            <Typography.Text>Transfer Breakdown</Typography.Text>
            <Row className="mt-4">
                <Flex vertical className="bg-white rounded-lg w-full px-4 py-2">
                    <Typography.Text className="text-[#31313180] " style={{ fontSize: '.75rem' }}>
                        Send Amount
                    </Typography.Text>

                    <Typography.Text className="font-semibold">
                        AED {amount || '0.00'}
                    </Typography.Text>
                </Flex>
            </Row>
            <Row className="mt-2 px-4 py-2">
                <Col span={12}>
                    <Typography.Text className="text-[#31313180] " style={{ fontSize: '.75rem' }}>
                        Exchange Rate
                    </Typography.Text>
                </Col>
                <Col span={12} className="text-right">
                    <Typography.Text className="font-semibold">
                        {currency} {exchangeRate ? exchangeRate?.toFixed(2) : '0.00'}
                    </Typography.Text>
                </Col>
            </Row>
            <Row className="mt-2 px-4 py-2">
                <Col span={12}>
                    <Typography.Text className="text-[#31313180] " style={{ fontSize: '.75rem' }}>
                        Fees
                    </Typography.Text>
                </Col>
                <Col span={12} className="text-right">
                    <Typography.Text className="font-semibold">
                        AED {charge ? charge.toFixed(2) : '0.00'}
                    </Typography.Text>
                </Col>
            </Row>
            {/* <Row className="mt-2">
                <Col span={12}>
                    <Typography.Text className="text-[#31313180] " style={{ fontSize: '.75rem' }}>
                        5% VAT
                    </Typography.Text>
                </Col>
                <Col span={12} className="text-right">
                    <Typography.Text className="font-semibold">AED 5.5</Typography.Text>
                </Col>
            </Row> */}
            <Row className="mt-2 px-4 py-2">
                <Col span={12}>
                    <Typography.Text className="text-[#31313180] " style={{ fontSize: '.75rem' }}>
                        Total
                    </Typography.Text>
                </Col>
                <Col span={12} className="text-right">
                    <Typography.Text className="font-semibold">AED {total}</Typography.Text>
                </Col>
            </Row>
            <Row className="mt-4 bg-white rounded-lg w-full px-4 py-2">
                <Col span={12}>
                    <Flex vertical>
                        <Typography.Text
                            className="text-[#31313180] "
                            style={{ fontSize: '.75rem' }}
                        >
                            Beneficiary Receives
                        </Typography.Text>
                        <Typography.Text className="font-semibold" style={{ fontSize: '1.25rem' }}>
                            {currency} {beneficiaryReceives}
                        </Typography.Text>
                    </Flex>
                </Col>{' '}
                <Col span={12} className="text-right mt-2">
                    <Button type="primary" className="bg-red-500 border-none">
                        Send Money Now
                    </Button>
                </Col>
            </Row>
        </Flex>
    </Flex>
);

export default TransferBreakdown;
