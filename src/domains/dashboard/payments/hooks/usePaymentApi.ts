import { useCallback, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { LEAN_APP_TOKEN, ENV, FRONTEND_BASE_URL } from '@src/config-global';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';
import { setUserInfo } from '@src/slices/userSlice';

import {
    getOrder,
    createPaymentLink,
    createPaymentIntentId,
    getQueuedPayments,
    completeLeanPayment,
    doWalletPayment,
    getVendorBalance,
} from '../api';
import {
    LeanPaymentStatus,
    OrderResponse,
    PaymentGeneric,
    PaymentIntentResponse,
    CardPaymentResponse,
    QueuedPaymentResponse,
    PaymentResponse,
    vendorBalanceResponse,
} from '../types';
import { checkIsBillPayment } from '../utils/utils';

declare const Lean: any;

export default function usePaymentApi() {
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { user } = useAppSelector(state => state.reducer.user);
    const { payload, totalAmount, url, maximumAmount, minimumAmount } = useAppSelector(
        state => state.reducer.payment
    );
    const [isLoading, setIsLoading] = useState(false);
    const customerId = useRef('');
    const endUserId = useRef('');
    const paymentIntentId = useRef('');
    const leanIsChecked = useRef(false);
    const leanWalletBalance = useRef(0);
    const navigate = useNavigate();

    const handleCardPaymentRequest = async ({
        isChecked,
        balance,
    }: {
        isChecked: boolean;
        balance: number;
    }) => {
        if (!checkPayableAmount()) {
            return;
        }
        setIsLoading(true);
        const isBillPayments = checkIsBillPayment(payload?.accessKey!);
        if (isBillPayments) {
            const noBalance = await getVendorAccBalance();
            if (!noBalance) {
                setIsLoading(false);
                return;
            }
        }

        const pgAfterWallet = totalAmount && totalAmount - balance;
        const pgAmount = isChecked ? pgAfterWallet : totalAmount;

        // Check if the access key is for WhatsApp Basic
        let successUrl = `${FRONTEND_BASE_URL}/${paths.payments.index}/${paths.payments.paymentsuccess}`;
        if (payload?.isWhatsAppSubscription) {
            successUrl = `${FRONTEND_BASE_URL}${paths.dashboard.moreServices}/${paths.whatsappForBusiness.index}/${paths.whatsappForBusiness.paymentsuccess}`;
        }

        const requestBody = {
            ...payload,
            pgAmount,
            userId: id,
            userType: role,
            successUrl,
            failureUrl: `${FRONTEND_BASE_URL}/${paths.payments.index}/${paths.payments.paymentFailure}`,
        };
        console.log(payload);
        const resp: CardPaymentResponse | false = await createPaymentLink(requestBody);
        if (resp) {
            window.location.href = resp.redirectLink;
        }
        setIsLoading(false);
    };

    const handleWalletPaymentRequest = async () => {
        if (!checkPayableAmount()) {
            return;
        }
        setIsLoading(true);
        const isBillPayments = checkIsBillPayment(payload?.accessKey!);
        if (isBillPayments) {
            const noBalance = await getVendorAccBalance();
            if (!noBalance) {
                setIsLoading(false);
                return;
            }
        }
        if (url) {
            const requestBody = {
                ...payload,
                userId: id,
                userType: role,
                url,
                currentUrl: undefined,
            };
            const resp: PaymentResponse | false = await doWalletPayment(requestBody);
            setIsLoading(false);
            if (resp && resp.bulkPaymentData) {
                const bulkPaymentDataString = encodeURIComponent(
                    JSON.stringify(resp.bulkPaymentData)
                );
                const query = `?status=success&bulkPaymentData=${bulkPaymentDataString || ''}`;
                navigate(paths.payments.paymentsuccess + query);
            } else if (resp) {
                dispatch(setUserInfo({ user: { ...user!, balance: resp.corporateFinalBalance } }));
                const query = `?status=success&transactionId=${resp.corporateTxnId || ''}`;
                navigate(paths.payments.paymentsuccess + query);
            } else {
                navigate(paths.payments.paymentFailure);
            }
        }
    };

    // step 1
    const handleBankPaymentRequest = async ({
        isChecked,
        balance,
    }: {
        isChecked: boolean;
        balance: number;
    }) => {
        if (!checkPayableAmount()) {
            return;
        }
        setIsLoading(true);
        const isBillPayments = checkIsBillPayment(payload?.accessKey!);
        if (isBillPayments) {
            const noBalance = await getVendorAccBalance();
            if (!noBalance) {
                setIsLoading(false);
                return;
            }
        }
        const resp = await getOrderDetails();
        leanIsChecked.current = isChecked;
        leanWalletBalance.current = balance;

        if (resp) {
            endUserId.current = resp.end_user_id;
            customerId.current = resp.customer_id;

            Lean.connect({
                app_token: LEAN_APP_TOKEN,
                customer_id: resp.customer_id,
                end_user_id: resp.end_user_id,
                sandbox: ENV !== 'production',
                permissions: ['identity', 'balance', 'accounts', 'transactions', 'payments'],
                callback: connectCallback,
            });
        } else {
            dispatch(
                showToast({
                    description: 'Something went wrong. Please try after some time',
                    variant: 'error',
                })
            );
            setIsLoading(false);
        }
    };

    // step 2
    async function connectCallback(value: any) {
        if (value.status === LeanPaymentStatus.success) {
            if (value.bank.is_supported) {
                const resp = await createPaymentIntent();
                if (resp) {
                    paymentIntentId.current = resp.payment_intent_id;

                    Lean.pay({
                        app_token: LEAN_APP_TOKEN,
                        payment_intent_id: resp.payment_intent_id,
                        end_user_id: endUserId.current,
                        sandbox: ENV !== 'production',
                        show_balances: false,
                        customization: { theme_color: '#171717' },
                        callback: payCallback,
                    });
                } else {
                    dispatch(
                        showToast({
                            description: 'Something went wrong',
                            variant: 'error',
                        })
                    );
                    setIsLoading(false);
                }
            } else {
                dispatch(
                    showToast({
                        description: 'Payments to your bank are not supported',
                        variant: 'error',
                    })
                );
                setIsLoading(false);
            }
        } else if (value.status === LeanPaymentStatus.cancelled) {
            dispatch(showToast({ description: 'Payment Cancelled', variant: 'error' }));
            setIsLoading(false);
        }
    }

    // step 3
    async function payCallback(value: any) {
        if (value.status === LeanPaymentStatus.success) {
            if (value.bank.is_supported) {
                const resp = await queuedPayments();
                if (resp && resp.queued_Payments.length > 0) {
                    Lean.authorize({
                        app_token: LEAN_APP_TOKEN,
                        payment_intent_ids: [paymentIntentId.current],
                        customer_id: customerId.current,
                        end_user_id: endUserId.current,
                        sandbox: ENV !== 'production',
                        customization: { theme_color: '#171717' },
                        callback: completePayment,
                    });
                    setIsLoading(false);
                } else {
                    dispatch(
                        showToast({
                            description: 'Something went wrong while processing your payment',
                            variant: 'error',
                        })
                    );
                    setIsLoading(false);
                }
            } else {
                dispatch(
                    showToast({
                        description: 'Payments to your bank are not supported',
                        variant: 'error',
                    })
                );
                setIsLoading(false);
            }
        } else {
            dispatch(showToast({ description: 'Payment Cancelled', variant: 'error' }));
            setIsLoading(false);
        }
    }

    // step 4
    async function completePayment(value: any) {
        setIsLoading(true);
        if (value.status === LeanPaymentStatus.success) {
            const paymentData = {
                paymentIntentId: paymentIntentId.current,
                ...payload,
                leanAmount: totalAmount,
                currentUrl: undefined,
            };

            const resp = await completeUserBankPayment(paymentData);
            setIsLoading(false);
            if (resp) {
                dispatch(setUserInfo({ user: { ...user!, balance: resp.corporateFinalBalance } }));
                const query = `?status=success&transactionId=${resp.corporateTxnId || ''}`;
                navigate(paths.payments.paymentsuccess + query);
            } else {
                navigate(paths.payments.paymentFailure);
            }
        } else {
            dispatch(
                showToast({
                    description: 'Something went wrong while processing your payment',
                    variant: 'error',
                })
            );
            setIsLoading(false);
        }
    }

    function checkPayableAmount() {
        if (Number(payload?.amount!) <= 0) {
            dispatch(
                showToast({
                    description: 'Please enter a valid amount',
                    variant: 'warning',
                })
            );
            return false;
        }
        if (
            (minimumAmount && Number(payload?.amount!) < minimumAmount) ||
            (maximumAmount && Number(payload?.amount!) > maximumAmount)
        ) {
            dispatch(
                showToast({
                    description:
                        'Please enter the amount between minimum and maximum denominations.',
                    variant: 'warning',
                })
            );
            return false;
        }
        return true;
    }
    // Helper functions for API calls in the bank method.

    const getOrderDetails = useCallback(async () => {
        const data: OrderResponse | false = await getOrder({
            userId: id,
            userType: role,
        });
        if (data) {
            return data;
        }
        setIsLoading(false);
        return false;
    }, [id, role]);

    const createPaymentIntent = useCallback(async () => {
        const leanAfterWallet = totalAmount && totalAmount - leanWalletBalance.current;
        const amount = leanIsChecked.current ? leanAfterWallet : totalAmount;

        const requestBody = {
            amount,
            currency: 'AED',
            customer_id: customerId.current,
        };
        const data: PaymentIntentResponse | false = await createPaymentIntentId({
            ...requestBody,
            userId: id,
            userType: role,
        });
        if (data) {
            return data;
        }

        setIsLoading(false);
        return false;
    }, [id, role, totalAmount, customerId]);

    const queuedPayments = useCallback(async () => {
        const data: QueuedPaymentResponse | false = await getQueuedPayments({
            customerId: customerId.current,
            userId: id,
            userType: role,
        });
        if (data) {
            return data;
        }
        setIsLoading(false);
        return false;
    }, [id, role, customerId]);

    const completeUserBankPayment = useCallback(
        async (requestPayload: PaymentGeneric) => {
            const data: PaymentResponse | false = await completeLeanPayment({
                ...requestPayload,
                userId: id,
                userType: role,
            });
            if (data) {
                return data;
            }
            setIsLoading(false);
            return false;
        },
        [id, role]
    );

    const getVendorAccBalance = async () => {
        const vendorData: vendorBalanceResponse | false = await getVendorBalance({
            userId: id,
            userType: role,
        });

        if (vendorData) {
            const balance = parseFloat(vendorData.merchantBalance);
            const rechargeAmount = Number(payload?.amount!);
            const allowPayment = rechargeAmount <= balance;
            if (!allowPayment) {
                dispatch(
                    showToast({
                        description: 'Bill Payment is not available at the moment',
                        variant: 'error',
                    })
                );
            }
            return allowPayment;
        }
        return false;
    };

    return {
        handleCardPaymentRequest,
        handleBankPaymentRequest,
        handleWalletPaymentRequest,
        isLoading,
    };
}
