import { useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { hotelAndRoomDetails } from '../Api';
import { getDetails } from '../slices/getHotelSlice';
import { HotelSearch } from '../types/hotelTypes';

export default function useHotelDetailsApi() {
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(true);

    const hotelDetails = useCallback(
        async (hotelKeys: string, searchKeys: string, conversationid: string) => {
            const data: HotelSearch | false = await hotelAndRoomDetails({
                userId: id,
                userType: role,
                hotelKey: hotelKeys,
                searchKey: searchKeys,
                conversationId: conversationid,
            });

            if (data) {
                setIsLoading(false);
                dispatch(getDetails(data as HotelSearch));
            } else {
                setIsLoading(false);
            }
        },
        [dispatch, id, role]
    );

    return { isLoading, hotelDetails };
}
