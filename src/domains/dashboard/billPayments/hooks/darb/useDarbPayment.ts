import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import { setPaymentData } from '../../../payments/slices/payment';
import { darbPaymentPayload } from '../../types/darb';
import GetSurcharge from '../useSurcharge';

export default function useDarbPayment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { getSurchargeData } = GetSurcharge();

    const handleSubmission = useCallback(
        async (values: darbPaymentPayload) => {
            const surchargeData = await getSurchargeData(values.amount, accessKeys.darb);
            const total =
                (values.amount ? parseFloat(values.amount.toString()) : 0) +
                (surchargeData?.surcharge ? parseFloat(surchargeData.surcharge) : 0);

            const billSummary = [
                {
                    key: 'Service name',
                    value: 'DARB',
                },
                {
                    key: 'Amount',
                    value: values.amount,
                    isInput: true,
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
                flexiKey: values.flexiKey,
                amount: values.amount.toString(),
                account: values.account,
                transactionId: values.transactionId,
                payCashback: false,
                typeKey: values.typeKey,
                optional1: values.optional1,
                optional2: values.optional2,
                accessKey: accessKeys.darb,
                currentUrl: window.location.href,
            };

            dispatch(
                setPaymentData({
                    billSummary,
                    paymentSummary,
                    totalAmount: total,
                    title: 'Bill Summary',
                    payload: requestBody,
                    url: `payment/darb/payment`,
                    minimumAmount: Number(values.minAmt),
                    maximumAmount: Number(values.maxAmt),
                    // earningCashbackAmount: Number(values && values?.corporateCashback) || 0,
                })
            );

            navigate(paths.dashboard.payments);
        },
        [dispatch, getSurchargeData, navigate]
    );

    return { handleSubmission };
}
