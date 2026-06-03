import { useCallback, useState } from 'react';

import { capitalize } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import useCheckProjectExist from './useCheckProjectExist';
import GetSurcharge from './useSurchargeApi';
import { setPaymentData } from '../../payments/slices/payment';
import { resetWhatsappBusinessState } from '../slices/paymentSlice';
import { PlanMode, PlanType } from '../types';

export default function useWhatsAppSubscriptionPayment() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { getSurchargeData } = GetSurcharge();
    const { checkProject } = useCheckProjectExist();

    // State to manage the overall loading state
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmission = useCallback(
        async (
            name: string,
            plan: PlanMode,
            duration: PlanType,
            planId: number,
            discountedAmount: number
        ) => {
            try {
                // Set loading to true when starting the process
                setIsLoading(true);

                // Use the checkProject function to determine if the project exists
                const projectPayload = {
                    userId: id,
                    userType: role,
                    name,
                };

                // Wait for the checkProject to complete
                const isExist = await checkProject(projectPayload);

                // Only proceed if the project exists
                if (isExist) {
                    console.error('Project does not exist');
                    return;
                }

                const amount = `${discountedAmount}`;
                const surchargeData = await getSurchargeData(amount);

                const total =
                    (amount ? parseFloat(amount) : 0) +
                    (surchargeData?.surcharge ? parseFloat(surchargeData.surcharge) : 0);

                const billSummary = [
                    { key: 'Service name', value: 'WhatsApp for Business' },
                    { key: 'Plan name', value: plan },
                    { key: 'Billing Cycle', value: capitalize(duration) },
                    {
                        key: 'Amount',
                        value: new Intl.NumberFormat('en-IN').format(Number(amount)) ?? 0,
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
                    amount,
                    pgAmount: amount,
                    name,
                    subscriptionPlan: plan,
                    isSubscription: true,
                    subscriptionDuration: duration,
                    packageId: planId,
                    accessKey: accessKeys.whatsappBasic,
                    currentUrl: window.location.href,
                    successUrl: '/whatsapp',
                    isWhatsAppSubscription: true,
                };

                // Dispatch the payment data to the store
                dispatch(
                    setPaymentData({
                        billSummary,
                        paymentSummary,
                        totalAmount: total,
                        title: 'Bill Summary',
                        payload: requestBody,
                        url: '',
                        earningCashbackAmount: Number(surchargeData?.corporateCashback) || 0,
                    })
                );

                // Navigate to the payments page
                navigate(paths.dashboard.payments);

                // Reset WhatsApp business state after navigation
                dispatch(resetWhatsappBusinessState());
            } catch (error) {
                console.error('Error in handleSubmission:', error);
            } finally {
                // Reset the loading state after the process is complete
                setIsLoading(false);
            }
        },
        [dispatch, navigate, getSurchargeData, checkProject, id, role]
    );

    return { handleSubmission, isLoading };
}
