import React from 'react';

import { Button, Card, Flex, Grid, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { useBreakpoint } = Grid;

type BillSummaryProps = {};

const BillSummary: React.FC<BillSummaryProps> = () => {
    const screens = useBreakpoint();
    const navigate = useNavigate();

    return (
        <Card size={screens.md ? 'default' : 'small'} style={{ width: '100%' }}>
            <Typography.Text className="text-lg font-semibold">Bill Summary</Typography.Text>
            <Flex vertical gap={24} className="pt-4">
                <Flex justify="space-between" align="center">
                    <Typography.Text>Service Name:</Typography.Text>
                    <Typography.Text className="font-semibold">
                        Document Attestation
                    </Typography.Text>
                </Flex>
                <Flex justify="space-between" align="center">
                    <Typography.Text>Document Name:</Typography.Text>
                    <Typography.Text className="font-semibold">Salary Certificate</Typography.Text>
                </Flex>
                <Flex justify="space-between" align="center">
                    <Typography.Text>Company:</Typography.Text>
                    <Typography.Text className="font-semibold">Savoll FZ LLC</Typography.Text>
                </Flex>
                <Flex justify="space-between" align="center">
                    <Typography.Text>Fine Amount</Typography.Text>
                    <Flex className="border rounded border-textGrey py-1 px-4">
                        <Typography.Text className="font-semibold">AED21,850</Typography.Text>
                    </Flex>
                </Flex>
                <Typography.Text className="text-lg font-semibold">
                    Total Payment Summary
                </Typography.Text>
                <Flex vertical gap={24} className="pt-4">
                    <Flex justify="space-between" align="center">
                        <Typography.Text>Company:</Typography.Text>
                        <Typography.Text className="font-semibold">AED21,850</Typography.Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Typography.Text>Company:</Typography.Text>
                        <Typography.Text className="font-semibold">AED21,850</Typography.Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Typography.Text className="font-semibold">Amount payable</Typography.Text>
                        <Typography.Text>Savoll FZ LLC</Typography.Text>
                    </Flex>
                </Flex>
                <Button
                    type="primary"
                    danger
                    className="flex justify-center md:hidden"
                    // onClick={() => handlePayment()}
                >
                    Continue
                </Button>
            </Flex>
        </Card>
    );
};

export default BillSummary;
