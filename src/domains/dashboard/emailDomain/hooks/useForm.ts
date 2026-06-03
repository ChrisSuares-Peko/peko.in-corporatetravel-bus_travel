import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import useSurchargeDetails from './useSurchargeApi';
import { setPaymentData } from '../../payments/slices/payment';
import { EmailDomainFormData } from '../types/types';

export default function useForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surchargeData, getSurchargeData } = useSurchargeDetails();

    const handleSubmission = useCallback(
        async ({
            amount,
            formData,
            planId,
            selectedType,
        }: {
            formData: EmailDomainFormData;
            amount: string;
            planId: number;
            selectedType: string;
        }) => {
            const surcharge = await getSurchargeData(amount);
            if (!surcharge) {
                return;
            }
            const total =
                (parseFloat(amount) || 0) +
                (surcharge?.surcharge ? parseFloat(surcharge.surcharge) : 0);
            const billSummary = [
                {
                    key: 'Service name',
                    value: 'Email/Domain',
                },
                {
                    key: 'Amount',
                    value: new Intl.NumberFormat('en-IN').format(Number(amount) ?? 0) ?? 0,
                },
            ];

            const paymentSummary = [
                {
                    key: 'Platform fee',
                    value: formatNumberWithLocalString(surcharge?.surcharge ?? 0),
                },
            ];

            const requestBody = {
                planId,
                amount,
                billingType: selectedType === 'Monthly' ? 'MONTHLY' : 'YEARLY',
                formDetails: formData,
                accessKey: accessKeys.emailDomain,
                currentUrl: window.location.href,
            };

            dispatch(
                setPaymentData({
                    billSummary,
                    paymentSummary,
                    totalAmount: total,
                    title: 'Bill Summary',
                    payload: requestBody,
                    url: 'purchase/software-subscriptions/payment',
                    earningCashbackAmount:
                        Number(surchargeData && surchargeData?.corporateCashback) || 0,
                })
            );

            navigate(paths.dashboard.payments);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch, navigate, surchargeData]
    );

    return { handleSubmission };
}
