import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { cancellationChargesApi, getCancelBooking } from '../api';
import { IAncCancellationPostData } from '../types/apiPayloadTypes';

export default function useCancelTicket() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const orderDetails = useAppSelector(state => state.reducer.airline.orderDetails);
    const [cancellationCharges, setCancellationCharges] = useState();

    const HandleCancelTicket = async (postData: IAncCancellationPostData) => {
        setCancelLoading(true);
        const data: any | false = await getCancelBooking({
            userId: id,
            userType: role,
            postData,
        });

        setCancelLoading(false);
        return data;
    };

    const getCancellationCharges = useCallback(async () => {
        if (!orderDetails.corporateTxnId) return false;
        setIsLoading(true);
        const resp: any | false = await cancellationChargesApi({
            userId: id,
            userType: role,
            corporateTxnId: orderDetails.corporateTxnId,
        });
        if (resp) {
            setCancellationCharges(resp);
            setIsLoading(false);
            return true;
        }
        setIsLoading(false);
        return false;
    }, [id, role, orderDetails]);

    useEffect(() => {
        getCancellationCharges();
    }, [getCancellationCharges]);

    return { HandleCancelTicket, isLoading, cancellationCharges, cancelLoading };
}
