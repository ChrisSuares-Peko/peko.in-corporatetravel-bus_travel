import { useCallback, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { SurchargeResponse } from '@customtypes/general';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { getSurcharge } from '@src/services/surcharge';
import { accessKeys } from '@utils/accessKeys';

import { setPaymentData } from '../../payments/slices/payment';
import { checkBalance } from '../api';
import { balanceResponse, paymentData } from '../types/dashboard';

export default function useForm() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmission = useCallback(
        async (payment: paymentData) => {
            setIsLoading(true);
            const resp: balanceResponse | false = await checkBalance({
                userId: id,
                userType: role,
                amount: Number(payment.amountInAed),
                credits: Number(payment.co2Offset),
                projectId: Number(payment.selectedProject.id),
            });

            if (resp) {
                const data: SurchargeResponse | false = await getSurcharge({
                    userId: id,
                    userType: role,
                    amount: Number(payment.amountInAed),
                    accessKey: accessKeys.CarbonFootprint,
                });
                setIsLoading(false);
                const total =
                    (payment.amountInAed ? parseFloat(payment.amountInAed) : 0) +
                    (data && data?.surcharge ? parseFloat(data && data.surcharge) : 0);

                const billSummary = [
                    {
                        key: 'Service name',
                        value: 'Zero Carbon',
                    },
                    {
                        key: 'Project Name',
                        value: payment.projectName!,
                    },
                    {
                        key: 'CO₂ Offset',
                        value: `${
                            new Intl.NumberFormat('en-IN').format(Number(payment.co2Offset) ?? 0) ??
                            0
                        } ${Number(payment.co2Offset) < 2 ? 'ton' : 'tons'}`,
                    },
                    {
                        key: 'Amount',
                        value:
                            new Intl.NumberFormat('en-IN').format(
                                Number(payment.amountInAed) ?? 0
                            ) ?? 0,
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
                    accessKey: accessKeys.CarbonFootprint,
                    currentUrl: window.location.href,
                };
                navigate(paths.dashboard.payments);

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
            }
            setIsLoading(false);
        },
        [id, role, navigate, dispatch]
    );

    return { handleSubmission, loader: isLoading };
}
