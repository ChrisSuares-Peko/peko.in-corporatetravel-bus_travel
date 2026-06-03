/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { Button, Card, Checkbox, Col, Flex, Image, Row, Typography, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import CancelAndBack from './CancelAndBack';
import PaymentFooter from './PaymentFooter';
import PaymentHeader from './PaymentHeader';
import PaymentOptions from './PaymentOptions';
import Summary from './Summary';
import cardLogo from '../assets/svg/card-logo.svg';
// import bankLogo from '../assets/svg/bank-logo.svg';
import pekoLogo from '../assets/svg/peko-logo.svg';
import walletIcon from '../assets/svg/wallet.svg';
import usePaymentApi from '../hooks/usePaymentApi';
import useWalletApi from '../hooks/useWalletApi';
import { PaymentMode } from '../types';

const PaymentSummary = () => {
    const { user } = useAppSelector(state => state.reducer.user);
    const [selectedPayment, setselectedPayment] = useState<PaymentMode>(PaymentMode.empty);
    const [isCashbackChecked, setIsCashbackChecked] = useState<boolean>(false);
    const { payload: paymentdata } = useAppSelector(state => state.reducer.payment);
    const {
        handleCardPaymentRequest,
        handleBankPaymentRequest,
        handleWalletPaymentRequest,
        isLoading,
    } = usePaymentApi();
    const { walletData } = useWalletApi();
    const {
        billSummary,
        paymentSummary,
        totalAmount,
        title,
        minimumAmount,
        maximumAmount,
        earningCashbackAmount,
        payload,
    } = useAppSelector(state => state.reducer.payment);

    // check weather it is a bulk payment or not , need to disable multi payment option based in this
    const bulkPayment =
        Array.isArray(payload?.bulkPaymentData) && payload?.bulkPaymentData.length > 1;

    const [isInvalidAmount, setIsInvalidAmount] = useState(false);

    const handlePayment = async () => {
        if (isInvalidAmount) return;
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
        } else if (selectedPayment === PaymentMode.wallet) {
            handleWalletPaymentRequest();
        }
    };
    const navigate = useNavigate();
    useEffect(() => {
        if (billSummary.length <= 0) {
            window.history.back();
        }
    }, [navigate, billSummary]);

    return (
        <Row>
            <CancelAndBack className="mb-6" />
            <PaymentHeader />
            <Col xs={24} xl={12}>
                {billSummary.length <= 0 ? (
                    <Skeleton active paragraph={{ rows: 13 }} />
                ) : (
                    <Card
                        className="h-full p-3 border-0 sm:p-7 sm:rounded-2xl sm:border border-borderGray md:p-10"
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
                                    setIsInvalidAmount={setIsInvalidAmount}
                                    isInvalidAmount={isInvalidAmount}
                                />
                            ))}
                            {minimumAmount && maximumAmount && (
                                <Row>
                                    <Col offset={16} span={8}>
                                        <Typography.Text className="text-xs text-right sm:text-xs">
                                            Min: AED {formatNumberWithLocalString(minimumAmount)}{' '}
                                            and Max: AED{' '}
                                            {formatNumberWithLocalString(maximumAmount)}
                                        </Typography.Text>
                                    </Col>
                                </Row>
                            )}
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
            <Col
                xs={24}
                xl={{ span: 11, offset: 1 }}
                className={`my-5 xl:my-0 ${!!earningCashbackAmount && earningCashbackAmount > 0 && 'h-full'}`}
            >
                {!!earningCashbackAmount && earningCashbackAmount > 0 && (
                    <Row className="flex items-center justify-center px-3 py-3 mb-3 rounded-md sm:rounded-xl sm:px-10 sm:py-6 bg-bgGreenPayment">
                        <Flex align="center" justify="center">
                            <Image
                                src={walletIcon}
                                alt="wallet"
                                preview={false}
                                height={20}
                                className=""
                            />
                            <Typography.Text className="ml-2 text-xs text-center text-white sm:ml-5 sm:text-base xxl:text-xl">
                                Congratulations! You will get a cashback of AED{' '}
                                {formatNumberWithLocalString(earningCashbackAmount)}
                            </Typography.Text>
                        </Flex>
                    </Row>
                )}
                <Card
                    className={`sm:rounded-2xl border-0 sm:border sm:border-borderGray p-3 sm:p-7 md:p-8  h-full `}
                    styles={{ body: { padding: 0 } }}
                >
                    <Flex vertical gap={25}>
                        <Typography.Title level={5}>Choose your payment method</Typography.Title>

                        {/* wallet  not need for sub corporate user and whatsapp project subscription */}
                        {user?.roleName !== 'corporate sub user' &&
                            paymentdata &&
                            !paymentdata?.isWhatsAppSubscription && (
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
                                            Number(walletData?.balance!) <= 0 ||
                                            (Number(walletData?.balance!) < totalAmount &&
                                                bulkPayment)
                                        }
                                        checked={isCashbackChecked}
                                        className="w-fit"
                                    >
                                        Use your Cashback AED{' '}
                                        {formatNumberWithLocalString(walletData?.balance || 0)}
                                    </Checkbox>
                                </>
                            )}

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
                                    selectedPayment === PaymentMode.wallet) ||
                                isInvalidAmount
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

export default PaymentSummary;
