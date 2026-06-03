/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';

import { Button, Card, Col, Flex, Row, Typography, Skeleton } from 'antd';

import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import CancelAndBack from './CancelAndBack';
import PaymentFooter from './PaymentFooter';
import PaymentHeader from './PaymentHeader';
import PaymentOptions from './PaymentOptions';
import Summary from './Summary';
import cardLogo from '../assets/svg/card-logo.svg';
// import bankLogo from '../assets/svg/bank-logo.svg';
import usePaymentApi from '../hooks/usePaymentApiForEsr';
import useWalletApi from '../hooks/useWalletApi';
import { PaymentMode } from '../types';

const PaymentSummaryForEsr = () => {
    const { user } = useAppSelector(state => state.reducer.user);
    const [selectedPayment, setselectedPayment] = useState<PaymentMode>(PaymentMode.empty);
    const [isCashbackChecked, setIsCashbackChecked] = useState<boolean>(false);
    const { handleCardPaymentRequest, handleBankPaymentRequest, isLoading } = usePaymentApi();
    const { walletData } = useWalletApi();
    const { billSummary, paymentSummary, totalAmount, title, payload } = useAppSelector(
        state => state.reducer.payment
    );

    const handlePayment = async () => {
        if (selectedPayment === PaymentMode.card) {
            handleCardPaymentRequest({
                isChecked: isCashbackChecked,
                balance: Number(walletData?.balance),
            });
        } else if (selectedPayment === PaymentMode.bank) {
            handleBankPaymentRequest({
                isChecked: isCashbackChecked,
                balance: Number(walletData?.balance),
            });
        }
        return false;
    };

    return (
        <Row>
            <CancelAndBack className="mb-6" />
            <PaymentHeader />
            <Col xs={24} xl={12}>
                {billSummary.length <= 0 ? (
                    <Skeleton active paragraph={{ rows: 13 }} />
                ) : (
                    <Card
                        className="h-full p-3 sm:p-7 border-0 sm:rounded-2xl sm:border border-borderGray md:p-10"
                        styles={{ body: { padding: 0 } }}
                    >
                        <Flex vertical gap={25}>
                            <Typography.Title level={5}>{title ?? 'Bill Summary'}</Typography.Title>
                            {billSummary.map(item => (
                                <Summary
                                    key={item.key}
                                    headName={item.key}
                                    value={item.value}
                                    isInput={item.isInput}
                                    setIsCashbackChecked={setIsCashbackChecked}
                                />
                            ))}

                            <Typography.Title level={5}>Total Payment Summary</Typography.Title>
                            {paymentSummary.map(item => (
                                <Summary headName={item.key} value={item.value} key={item.key} />
                            ))}
                            <Row justify="space-between">
                                <Col span={16}>
                                    <Typography.Title level={5}>Amount Payable</Typography.Title>
                                </Col>
                                <Col span={8}>
                                    <Typography.Text className="text-base font-medium">
                                        AED {formatNumberWithLocalString(totalAmount || 0)}
                                    </Typography.Text>
                                </Col>
                            </Row>
                        </Flex>
                    </Card>
                )}
            </Col>
            <Col xs={24} xl={{ span: 11, offset: 1 }} className={`my-5 xl:my-0 '}`}>
                <Card
                    className={`sm:rounded-2xl border-0 sm:border sm:border-borderGray p-3 sm:p-7 md:p-8  h-full `}
                    styles={{ body: { padding: 0 } }}
                >
                    <Flex vertical gap={25}>
                        <Typography.Title level={5}>Choose Your Payment Method</Typography.Title>

                        {/* wallet  not need for sub corporate user */}
                        {/* {user?.roleName !== 'corporate sub user' && (
                                <>
                                    <PaymentOptions
                                        optionName="Cashback :"
                                        walletAmount={formatNumberWithLocalString(
                                            walletData?.balance || 0
                                        )}
                                        image={pekoLogo}
                                        checked={selectedPayment === PaymentMode.wallet}
                                        handleSelection={() => {
                                            setselectedPayment(PaymentMode.wallet);
                                            setIsCashbackChecked(true);
                                        }}
                                        disabled={
                                            Number(walletData?.balance!) <= 0 ||
                                            Number(walletData?.balance!) <= totalAmount
                                        }
                                    />
                                    <Checkbox
                                        onChange={e => {
                                            setIsCashbackChecked(e.target.checked);
                                            if (
                                                e.target.checked &&
                                                Number(walletData?.balance!) >= totalAmount
                                            ) {
                                                setselectedPayment(PaymentMode.wallet);
                                            } else if (
                                                !e.target.checked &&
                                                Number(walletData?.balance!) >= totalAmount
                                            ) {
                                                setselectedPayment(PaymentMode.empty);
                                            }
                                        }}
                                        disabled={
                                            Number(walletData?.balance!) <= 0 
                                        }
                                        checked={isCashbackChecked}
                                        className="w-fit"
                                    >
                                        Use your Cashback AED{' '}
                                        {formatNumberWithLocalString(walletData?.balance || 0)}
                                    </Checkbox>
                                </>
                            )} */}

                        {/* <PaymentOptions
                            optionName="Bank Account"
                            image={bankLogo}
                            checked={selectedPayment === PaymentMode.bank}
                            handleSelection={() => setselectedPayment(PaymentMode.bank)}
                            disabled={
                                isCashbackChecked &&
                                (selectedPayment === PaymentMode.wallet ||
                                    Number(walletData?.balance!) >= totalAmount)
                            }
                        /> */}

                        <PaymentOptions
                            optionName="Debit/Credit/ATM Cards"
                            image={cardLogo}
                            checked={selectedPayment === PaymentMode.card}
                            handleSelection={() => setselectedPayment(PaymentMode.card)}
                            disabled={
                                isCashbackChecked &&
                                (selectedPayment === PaymentMode.wallet ||
                                    Number(walletData?.balance!) >= totalAmount)
                            }
                        />

                        <Button
                            danger
                            type="primary"
                            size="large"
                            disabled={
                                totalAmount <= 0 ||
                                selectedPayment === PaymentMode.empty ||
                                (Number(walletData?.balance!) < totalAmount &&
                                    selectedPayment === PaymentMode.wallet)
                            }
                            onClick={handlePayment}
                            loading={isLoading}
                            className="h-14"
                        >
                            {`Pay AED ${formatNumberWithLocalString(isCashbackChecked && selectedPayment === PaymentMode.wallet ? totalAmount : isCashbackChecked ? totalAmount - Number(walletData?.balance!) : totalAmount ?? 0)}`}
                        </Button>
                    </Flex>
                </Card>
            </Col>
            <PaymentFooter />
        </Row>
    );
};

export default PaymentSummaryForEsr;
