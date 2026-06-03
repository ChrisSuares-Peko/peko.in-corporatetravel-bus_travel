import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { SurchargeResponse } from '@customtypes/general';
import { setPaymentData } from '@src/domains/dashboard/payments/slices/payment';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { getSurcharge } from '@src/services/surcharge';
import { showToast } from '@src/slices/apiSlice';

import { getBulkBalance } from '../../api/bulkPayment';
import { setData } from '../../slices/beneficiary';
import { GetLimitResponse } from '../../types';
import { bulkBalanceResponse } from '../../types/bulkPayment';

interface bulkPaymentProps {
    limitDetails?: GetLimitResponse;
}
export default function useBulkPayment({ limitDetails }: bulkPaymentProps) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { bulkBalanceData } = useAppSelector(state => state.reducer.beneficiary);
    const navigate = useNavigate();
    const [isbulkLoading, setBulkLoading] = useState(false);
    const dispatch = useAppDispatch();
    const item = useAppSelector(state => state.reducer.billPayment);
    const serviceData = item ? item.vendor : null;

    const bulkBalanceApi = async (beneficiaryIds: React.Key[], limitData: GetLimitResponse) => {
        if (beneficiaryIds.length <= 0) {
            dispatch(
                showToast({
                    variant: 'warning',
                    description: 'Please select at least one beneficiary to continue',
                })
            );
            return;
        }
        setBulkLoading(true);
        const data: false | bulkBalanceResponse = await getBulkBalance({
            userId: id,
            userType: role,
            beneficiariesId: beneficiaryIds,
            flexiKey: limitData.flexiKey,
            typeKey: limitData.typeKey,
            accessKey: limitData?.accessKey,
        });
        if (data) {
            dispatch(setData({ bulkBalanceData: data.beneficiariesBalances }));
            navigate(paths.billPayments.bulkPayment);
        }
        setBulkLoading(false);
    };

    const bulkPaymentApi = async (
        totalBillAmount: number,
        amounts: { [key: number]: number },
        selectedRows: number[],
        inputValidity: { [key: number]: boolean }
    ) => {
        if (selectedRows.length <= 0) {
            dispatch(
                showToast({
                    variant: 'warning',
                    description: 'Please select at least one beneficiary to continue',
                })
            );
            return;
        }
        if (selectedRows.length > 1000) {
            dispatch(
                showToast({
                    variant: 'warning',
                    description:
                        'You can only process up to 1000 payments at a time. Please reduce the number of payments and try again.',
                })
            );
            return;
        }
        const hasInvalidInput = selectedRows.some(rowId => !inputValidity[rowId]);

        if (hasInvalidInput) {
            dispatch(
                showToast({
                    variant: 'error',
                    description:
                        'Please verify the amounts for all rows before proceeding with the payment.',
                })
            );
            return;
        }
        setBulkLoading(true);
        const bulkPaymentData = bulkBalanceData
            .filter(data => selectedRows.includes(data.data.id))
            .map(data => ({
                account: data.data.accountNo,
                transactionId: data.data.TransactionId,
                providerTransactionId: data.data.ProviderTransactionId,
                amount: amounts[data.data.id],
                lastBalance: data.data.CurrentBalance,
                type: data.data.ServiceType,
                flexiKey: limitDetails?.flexiKey,
                typeKey: limitDetails?.typeKey,
            }));

        const surchargeData: SurchargeResponse | false = await getSurcharge({
            userId: id,
            userType: role,
            amount: Number(totalBillAmount),
            accessKey: serviceData?.accessKey ?? '',
            quantity: Number(selectedRows.length) || 1,
        });

        const surcharge = surchargeData ? parseFloat(surchargeData.surcharge) : 0;

        const total = totalBillAmount + surcharge;

        const billSummary = [
            {
                key: 'Service name',
                value: 'Etisalat Postpaid',
            },
            {
                key: 'Total beneficiaries',
                value: selectedRows.length,
            },
            {
                key: 'Amount',
                value: totalBillAmount,
            },
        ];

        const paymentSummary = [
            {
                key: 'Platform fee',
                value: surcharge,
            },
        ];

        const requestBody = {
            amount: totalBillAmount,
            bulkPaymentData,
            accessKey: serviceData?.accessKey,
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
                earningCashbackAmount:
                    Number(surchargeData && surchargeData?.corporateCashback) || 0,
            })
        );
        setBulkLoading(false);
        navigate(paths.dashboard.payments);
    };

    return { bulkBalanceApi, isbulkLoading, bulkPaymentApi };
}
