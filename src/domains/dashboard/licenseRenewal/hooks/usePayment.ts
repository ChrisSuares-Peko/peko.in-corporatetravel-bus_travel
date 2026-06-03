import { useCallback, useEffect } from 'react';

import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import useSurchargeDetails from './useSurchargeApi';
import { setPaymentData } from '../../payments/slices/payment';
import { FormValuesType } from '../types';

export default function usePayment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { state } = useLocation();

    const paymentPageData = state;
    useEffect(() => {
        if (!paymentPageData) {
            navigate(`/${paths.licenseRenewal.index}`);
        }
    }, [paymentPageData, navigate]);

    const { surchargeData } = useSurchargeDetails(paymentPageData.Amount);

    const handleSubmission = useCallback(
        async (values: FormValuesType) => {
            const {
                AccountNumber,
                TransactionId,
                Amount,
                // surcharge,
                flexiKey,
                typeKey,
                VoucherExpiryDate,
                VoucherNumber,
                surchargeInAED,
            } = paymentPageData ?? '';

            const total =
                (Amount ? parseFloat(Amount) : 0) +
                (surchargeInAED ? parseFloat(surchargeInAED) : 0);
            const billSummary = [
                {
                    key: 'Service name',
                    value: 'License Renewal',
                },
                {
                    key: 'Voucher ID',
                    value: AccountNumber,
                },
                {
                    key: 'Renewal Date',
                    value: dayjs(VoucherExpiryDate).format('DD/MMM/YYYY'),
                },
                {
                    key: 'Amount',
                    value: Amount ?? 0,
                },
            ];

            const paymentSummary = [
                {
                    key: 'Platform fee',
                    value: Number(surchargeInAED) ?? 0,
                },
            ];

            const requestBody = {
                account: AccountNumber,
                transactionId: TransactionId,
                amount: Amount,
                customerName: values.customerName,
                emiratesId: values.emiratesId,
                voucherNumber: VoucherNumber,
                surchargeInAED: parseFloat(surchargeInAED) || 0,
                flexiKey,
                typeKey,
                payCashback: false,
                accessKey: accessKeys.dubaiDED,
                currentUrl: window.location.href,
            };
            dispatch(
                setPaymentData({
                    billSummary,
                    paymentSummary,
                    totalAmount: total,
                    title: 'Bill Summary',
                    payload: requestBody,
                    url: 'payment/licenseRenewal/payment',
                    earningCashbackAmount:
                        Number(surchargeData && surchargeData?.corporateCashback) || 0,
                })
            );
            navigate(paths.dashboard.payments);
        },
        [dispatch, navigate, paymentPageData, surchargeData]
    );

    return { handleSubmission };
}
