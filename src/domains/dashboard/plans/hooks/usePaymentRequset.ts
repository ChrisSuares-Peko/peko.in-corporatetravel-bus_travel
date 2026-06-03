import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import { postPaymentRequest, postPaymentRequestForFree } from '../api';
import { AddOnPaymentRequestPayload, PaymentRequestPayload, PaymentResponse } from '../types';

export default function usePaymentRequest() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePaymentRequest = async (payload: PaymentRequestPayload) => {
        setIsLoading(true);
        payload.accessKey = accessKeys.purchaseSubscription;
        payload.pgAmount = payload.amount;
        if (payload.amount > 0) {
            const response: false | PaymentResponse = await postPaymentRequest({
                ...payload,
                userId: id,
                userType: role,
            });
            setIsLoading(false);
            if (response) {
                window.location.href = response.redirectLink;
            }
        } else {
            const response: false | {} = await postPaymentRequestForFree({
                ...payload,
                userId: id,
                userType: role,
            });
            setIsLoading(false);
            if (response) {
                navigate(`/${paths.plans.index}/${paths.plans.paymentsuccess}`);
            } else {
                navigate(`/${paths.plans.index}/${paths.plans.paymentFailure}`);
            }
        }
    };
    const handleAddOnPaymentRequest = async (payload: AddOnPaymentRequestPayload) => {
        setIsLoading(true);
        if (payload.pgAmount > 0) {
            const response: false | PaymentResponse = await postPaymentRequest({
                ...payload,
                userId: id,
                userType: role,
            });
            setIsLoading(false);
            if (response) {
                window.location.href = response.redirectLink;
            }
        }
    };
    return { handlePaymentRequest, handleAddOnPaymentRequest, isLoading };
}
