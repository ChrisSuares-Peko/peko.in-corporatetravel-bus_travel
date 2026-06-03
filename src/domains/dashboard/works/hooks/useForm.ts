import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { SurchargeResponse } from '@customtypes/general';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { getSurcharge } from '@src/services/surcharge';
import { accessKeys } from '@utils/accessKeys';

import { setPaymentData } from '../../payments/slices/payment';
import { WorksFormData } from '../type';

export default function useForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const handleSubmission = useCallback(
        async (values: WorksFormData) => {
            const { pocName, email, requirement, planId, workId, price } = values;
            const amount = price;
            const data: SurchargeResponse | false = await getSurcharge({
                userId: id,
                userType: role,
                amount: Number(amount),
                accessKey: accessKeys.pekoWorks,
            });
            let total = 0;
            if (data && 'surcharge' in data) {
                total =
                    (amount ? parseFloat(amount) : 0) +
                    (data?.surcharge ? parseFloat(data.surcharge) : 0);
                const billSummary = [
                    {
                        key: 'Service name',
                        value: 'Peko Works',
                    },
                    {
                        key: 'Plan Name',
                        value: values?.planName ?? '',
                    },
                    {
                        key: 'Amount',
                        value:
                            new Intl.NumberFormat('en-IN').format(Number(values.price) ?? 0) ?? 0,
                    },
                ];

                const paymentSummary = [
                    {
                        key: 'Platform fee',
                        value:
                            new Intl.NumberFormat('en-IN').format(Number(data?.surcharge) ?? 0) ??
                            0,
                    },
                ];

                const requestBody = {
                    planId,
                    amount,
                    pocName,
                    email,
                    requirement,
                    workId,
                    accessKey: accessKeys.pekoWorks,
                    currentUrl: window.location.href,
                };

                dispatch(
                    setPaymentData({
                        billSummary,
                        paymentSummary,
                        totalAmount: total,
                        title: 'Bill Summary',
                        payload: requestBody,
                        url: 'officeAndBusiness/works/payment',
                        earningCashbackAmount: Number(data && data?.corporateCashback) || 0,
                    })
                );

                navigate(paths.dashboard.payments);
            }
        },
        [dispatch, id, navigate, role]
    );

    return { handleSubmission };
}
