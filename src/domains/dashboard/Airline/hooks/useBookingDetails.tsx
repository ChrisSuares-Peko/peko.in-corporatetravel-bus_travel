import { useState } from 'react';

import { useAppSelector, useAppDispatch } from '@src/hooks/store';

import { getBookingDetailsApi } from '../api';
import { setSelectedOrderDetails } from '../slices/airlineSlice';
import { BookingDetailsRes } from '../types/manageBookings';

export default function useBookingDetails() {
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const orderDetails = useAppSelector(state => state.reducer.airline.orderDetails);

    const [isLoading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState<any>();

    const getBookingDetails = async (corporateTxnId: number | undefined, refresh: boolean) => {
        if (!corporateTxnId && !orderDetails?.corporateTxnId) return false;
        // if (orderDetails && !refresh) return true
        setLoading(true);
        const data: BookingDetailsRes | false = await getBookingDetailsApi({
            userId: id,
            userType: role,
            corporateTxnId: corporateTxnId || orderDetails?.corporateTxnId,
        });
        if (data) {
            dispatch(setSelectedOrderDetails(data));
            setBookingData(data);
            setLoading(false);
            return true;
        }
        setLoading(false);
        return false;
    };

    return { getBookingDetails, data: bookingData, isLoading };
}
