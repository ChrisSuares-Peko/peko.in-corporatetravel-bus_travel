import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import useSurchargeDetails from './useSurchargeApi';
import { setPaymentData } from '../../payments/slices/payment';
import { PostData } from '../types';

export default function usePayment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surchargeData } = useSurchargeDetails();

    const handleSubmission = useCallback(
        async (values: PostData) => {
            const total =
                (values.amount ? parseFloat(values.amount.toString()) : 0) +
                (surchargeData?.surcharge ? parseFloat(surchargeData.surcharge) : 0);
            const amount = Number(values.amount);
            const vat = amount * (5 / 100);

            const billSummary = [
                {
                    key: 'Service name',
                    value: 'eSIM',
                },
                {
                    key: 'Operator Name',
                    value: values.operatorName,
                },
                {
                    key: 'Plan',
                    value: values.plan,
                },
                {
                    key: 'Amount',
                    value: new Intl.NumberFormat('en-IN').format(Number(amount - vat) ?? 0) ?? 0,
                },
                {
                    key: 'VAT (5 %)',
                    value: `AED ${formatNumberWithLocalString(vat)}`,
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
                amount: values.amount,
                packageId: values.packageId,
                quantity: values.quantity,
                operatorImage: values?.operatorImage ?? null,
                operatorName: values.operatorName,
                isRechargable: values?.isRechargable ?? null,
                accessKey: accessKeys.eSim,
                type: values?.topupType ?? 'SIM',
                iccid: values?.iccid ?? null,
                currentUrl: window.location.href,
                countries: values?.countries,
                packageType: values?.packageType,
                region: values?.region,
            };

            dispatch(
                setPaymentData({
                    billSummary,
                    paymentSummary,
                    totalAmount: total,
                    title: 'eSIM Payment',
                    payload: requestBody,
                    url: 'travel/eSIM/payment',
                    earningCashbackAmount:
                        Number(surchargeData && surchargeData?.corporateCashback) ?? 0,
                })
            );

            navigate(paths.dashboard.payments);
        },
        [dispatch, navigate, surchargeData]
    );

    return { handleSubmission };
}
