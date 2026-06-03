import { useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { prebookHotel } from '../Api';
import { HotelBookingResponse } from '../types/bookingTypes';
import { roomData } from '../types/types';

export default function usePrebookApi() {
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [prebookRes, setPrebookRes] = useState<HotelBookingResponse | false>(false);

    const PrebookDetails = useCallback(
        async (
            hotelKeys: string,
            conversationIds: string,
            searchKeys: string,
            roomInfo: roomData[]
        ) => {
            const data: HotelBookingResponse | false = await prebookHotel({
                userId: id,
                userType: role,
                hotelKey: hotelKeys,
                conversationId: conversationIds,
                searchKey: searchKeys,
                rooms: roomInfo,
            });

            return data as HotelBookingResponse;
        },
        [id, role]
    );

    return { isLoading, PrebookDetails };
}
