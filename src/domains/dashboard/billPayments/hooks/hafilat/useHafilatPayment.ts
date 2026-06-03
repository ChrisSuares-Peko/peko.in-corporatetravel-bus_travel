import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import { setPaymentData } from '../../../payments/slices/payment';
import { hafilatPaymentPayload } from '../../types/haflat';
import GetSurcharge from '../useSurcharge';

export default function useHafilatPayment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { getSurchargeData } = GetSurcharge();

    const handleSubmission = useCallback(
        async (values: hafilatPaymentPayload) => {
            const surchargeData = await getSurchargeData(values.amount, accessKeys.hafilat);
            const total =
                (values.amount ? parseFloat(values.amount.toString()) : 0) +
                (surchargeData?.surcharge ? parseFloat(surchargeData.surcharge) : 0);

            const billSummary = [
                {
                    key: 'Service name',
                    value: 'Hafilat',
                },
                {
                    key: 'Beneficiary number',
                    value: values.account,
                },
                {
                    key: 'Amount',
                    value: values.amount,
                    isInput: false,
                },
            ];

            const paymentSummary = [
                {
                    key: 'Platform fee',
                    value:
                        new Intl.NumberFormat('en-IN').format(
                            Number(surchargeData?.surcharge) ?? 0
                        ) ?? 0,
                },
            ];

            const requestBody = {
                account: values.account,
                amount: values.amount,
                transactionId: values.transactionId,
                payCashback: false,
                flexiKey: values.flexiKey,
                typeKey: values.typeKey,
                accessKey: accessKeys.hafilat,
                currentUrl: window.location.href,
                optionals: values.optionals,
            };

            dispatch(
                setPaymentData({
                    billSummary,
                    paymentSummary,
                    totalAmount: total,
                    title: 'Bill Summary',
                    payload: requestBody,
                    url: `payment/hafilat/payment`,
                    // minimumAmount: Number(values.minAmt),
                    // maximumAmount: Number(values.maxAmt),
                    // earningCashbackAmount: Number(values && values?.corporateCashback) || 0,
                })
            );

            navigate(paths.dashboard.payments);
        },
        [dispatch, getSurchargeData, navigate]
    );

    return { handleSubmission };
}
