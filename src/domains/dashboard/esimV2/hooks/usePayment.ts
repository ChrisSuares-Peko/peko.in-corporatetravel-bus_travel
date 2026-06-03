import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import useSurchargeDetails from './useSurchargeApi';
import { setPaymentData } from '../../payments/slices/payment';
import { getPlanDetails } from '../api';
import { PostData } from '../types';

export default function usePayment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { surchargeData } = useSurchargeDetails();
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const handleSubmission = useCallback(
        async (values: PostData) => {
            const data = await getPlanDetails({
                userId: id,
                userType: role,
                ...values,
            });
            if (data) {
                const total =
                    (data.amount
                        ? parseFloat((data.amount * (values.quantity || 1)).toString())
                        : 0) + (surchargeData?.surcharge ? parseFloat(surchargeData.surcharge) : 0);
                const amount = Number(data.amount * (values.quantity || 1));
                const vat = amount * (5 / 100);

                const billSummary = [
                    {
                        key: 'Service name',
                        value: 'eSIM',
                    },
                    {
                        key: 'Operator Name',
                        value: data.name,
                    },
                    {
                        key: 'Plan',
                        value: `${values.data} MB - ${values.validity} Days`,
                    },
                    {
                        key: 'Amount',
                        value:
                            new Intl.NumberFormat('en-IN').format(Number(amount - vat) ?? 0) ?? 0,
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
                    amount: data.amount * (values.quantity || 1),
                    // packageId: values.packageId,
                    quantity: values.quantity,
                    // operatorImage: values?.operatorImage ?? null,
                    // operatorName: values.operatorName,
                    // isRechargable: values?.isRechargable ?? null,
                    accessKey: accessKeys.eSim,
                    // type: values?.topupType ?? 'SIM',
                    // iccid: values?.iccid ?? null,
                    currentUrl: window.location.href,
                    // countries: values?.countries,
                    // packageType: values?.packageType,
                    // region: values?.region,
                    planId: data?.planId,
                };

                dispatch(
                    setPaymentData({
                        billSummary,
                        paymentSummary,
                        totalAmount: total,
                        title: 'Bill Summary',
                        payload: requestBody,
                        url: 'paymentGateway/wallet-payments/create',
                        earningCashbackAmount:
                            Number(surchargeData && surchargeData?.corporateCashback) ?? 0,
                    })
                );

                navigate(paths.dashboard.payments);
            }
        },
        [dispatch, id, navigate, role, surchargeData]
    );

    return { handleSubmission };
}
