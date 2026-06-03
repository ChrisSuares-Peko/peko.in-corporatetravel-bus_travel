import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { SurchargeResponse } from '@customtypes/general';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { getSurcharge } from '@src/services/surcharge';
import { accessKeys } from '@utils/accessKeys';

import { setPaymentData } from '../../payments/slices/payment';
import { PaymentData } from '../types/types';

export default function useForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmission = useCallback(
        async (payment: PaymentData) => {
            setIsLoading(true);
            const data: SurchargeResponse | false = await getSurcharge({
                userId: id,
                userType: role,
                amount: Number(payment.amount),
                accessKey: accessKeys.esr,
            });
            setIsLoading(false);
            const total =
                (payment.amount ? Number(payment.amount) : 0) +
                (data && data?.surcharge ? parseFloat(data && data.surcharge) : 0);

            const billSummary = [
                {
                    key: 'Service name',
                    value: 'ESR',
                },
                {
                    key: 'Stage title',
                    value: payment.stageTitle!,
                },
                {
                    key: 'Amount',
                    value: new Intl.NumberFormat('en-IN').format(Number(payment.amount) ?? 0) ?? 0,
                },
            ];

            const paymentSummary = [
                {
                    key: 'Platform fee',
                    value:
                        new Intl.NumberFormat('en-IN').format(
                            Number(data && data?.surcharge) ?? 0
                        ) ?? 0,
                },
            ];

            const requestBody = {
                ...payment,
                accessKey: accessKeys.esr,
                currentUrl: window.location.href,
            };
            navigate(paths.esr.payment);

            dispatch(
                setPaymentData({
                    billSummary,
                    paymentSummary,
                    totalAmount: total,
                    title: 'Bill Summary',
                    payload: requestBody,
                    url: 'officeAndBusiness/carbonFootprint/payment',
                    earningCashbackAmount: Number(data && data?.corporateCashback) || 0,
                })
            );

            setIsLoading(false);
        },
        [id, role, navigate, dispatch]
    );

    return { handleSubmission, loader: isLoading };
}
