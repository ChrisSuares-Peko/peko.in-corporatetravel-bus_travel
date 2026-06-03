import React from 'react';

import { Button, Card, Checkbox, Flex, Grid, Image, Radio, Typography } from 'antd';
import { Link } from 'react-router-dom';

import network from '@assets/svg/network.svg';
import paymenticon from '@assets/svg/Payment-icon.png';
import paymentmethodicon from '@assets/svg/Payment-method-icon.svg';
import paymentwallet from '@assets/svg/payment-wallet.png';
import { paths } from '@src/routes/paths';

type PaymentMethodProps = {};

const PaymentMethod: React.FC<PaymentMethodProps> = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    return (
        <Flex vertical className="w-full" gap={15}>
            <Card
                size={screens.md ? 'default' : 'small'}
                className="bg-bgGray"
                style={{ width: '100%' }}
            >
                <Flex vertical gap={24}>
                    <Typography.Text className="text-lg font-semibold">
                        Choose your payment method
                    </Typography.Text>
                    <Card size="small" className="py-2">
                        <Flex justify="space-between" align="center" className="w-full">
                            <Radio className="items-center">
                                <Flex align="center" gap={12}>
                                    <Typography.Text style={{ marginBottom: '0px' }}>
                                        Peko Cashback:{' '}
                                    </Typography.Text>
                                    <Typography.Text className="text-textGreenTitle">
                                        AED955.00{' '}
                                    </Typography.Text>
                                </Flex>
                            </Radio>
                            <Image src={paymenticon} alt="paymenticon" />
                        </Flex>
                    </Card>

                    <Checkbox>
                        <Typography.Text>Use your Cashback AED 955.00</Typography.Text>
                    </Checkbox>

                    <Card size="small" className="py-2">
                        <Flex justify="space-between" align="center" className="w-full">
                            <Typography.Text>Bank account </Typography.Text>
                            <Image src={paymentmethodicon} alt="paymenticon" />
                        </Flex>
                    </Card>

                    <Card size="small" className="py-2">
                        <Flex justify="space-between" align="center" className="w-full">
                            <Typography.Text>Debit/Credit/ATM Cards </Typography.Text>
                            <Image src={network} alt="paymenticon" />
                        </Flex>
                    </Card>

                    <Link to={paths.payments.paymentsuccess}>
                        <Button
                            htmlType="submit"
                            type="primary"
                            danger
                            className="w-full flex justify-center md:w-auto md:flex md:justify-start"
                        >
                            Pay AED 1,749
                        </Button>
                    </Link>
                </Flex>
            </Card>
            <Flex justify="center" className="flex md:hidden">
                <Image src={paymentwallet} alt="wallet" preview={false} />
            </Flex>
        </Flex>
    );
};

export default PaymentMethod;
