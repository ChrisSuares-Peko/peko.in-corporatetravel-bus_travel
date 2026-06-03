/* eslint-disable no-nested-ternary */
import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { setPaymentData } from '../../payments/slices/payment';

export default function usePayment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleSubmission = useCallback(
        async (paymentPageData: any) => {
            const {
                serviceName,
                accountNumber,
                beneficiaryName,
                rechargeAmount,
                TransactionId,
                flexiKey,
                typeKey,
                surcharge,
                dueBalanceInAed,
                minimumAmountInAed,
                maximumAmountInAed,
                minDenomination,
                maxDenomination,
                accessKey,
                earningCashbackAmount,
                CurrentBalance,
                serviceType,
                accountPin,
                ProviderTransactionId,
                optional1,
                optional2,
            } = paymentPageData ?? '';

            const minimumAmount = parseInt(minimumAmountInAed || minDenomination, 10);
            const maximumAmount = parseInt(maximumAmountInAed || maxDenomination, 10);

            const billAmount = rechargeAmount
                ? Number(rechargeAmount)
                : dueBalanceInAed
                  ? parseInt(dueBalanceInAed, 10)
                  : 0;

            const total = billAmount + (surcharge ? parseFloat(surcharge) : 0);

            const billSummary = [
                {
                    key: 'Service name',
                    value: serviceName,
                },
                ...(beneficiaryName
                    ? [
                          {
                              key: 'Beneficiary name',
                              value: beneficiaryName,
                          },
                      ]
                    : []),
                {
                    key: 'Beneficiary number',
                    value: accountNumber,
                },

                {
                    key: 'Amount',
                    value: billAmount,
                    isInput: true,
                },
            ];

            const paymentSummary = [
                {
                    key: 'Platform fee',
                    value: surcharge ?? 0,
                },
            ];
            const bulkPaymentData = [
                {
                    account: accountNumber,
                    amount: billAmount,
                    transactionId: TransactionId,
                    flexiKey,
                    typeKey,
                    providerTransactionId: ProviderTransactionId,
                    lastBalance: CurrentBalance || dueBalanceInAed,
                    type: serviceType,
                    pin: accountPin,
                    optional1,
                    optional2,
                },
            ];

            const requestBody = {
                amount: billAmount,
                bulkPaymentData,
                accessKey,
                currentUrl: window.location.href,
            };
            dispatch(
                setPaymentData({
                    billSummary,
                    paymentSummary,
                    totalAmount: total,
                    title: 'Bill Summary',
                    payload: requestBody,
                    url: `payment/bulk-payment/payment`,
                    minimumAmount,
                    maximumAmount,
                    earningCashbackAmount,
                })
            );
            navigate(paths.dashboard.payments);
        },
        [dispatch, navigate]
    );

    return { handleSubmission };
}
