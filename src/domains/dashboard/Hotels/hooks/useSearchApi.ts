import { useCallback, useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';

import { getHotels } from '../Api';
import { sethotelArr } from '../slices/getHotelSlice';
import { Hotels, searchList } from '../types/types';

export default function useSearchApi() {
    const location = useLocation();
    const { key } = location.state || {};
    const dispatch = useDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { hotelsRequest } = useAppSelector(state => state.reducer.hotels);

    const [isLoading, setIsLoading] = useState(true);
    const [hotelData, setHotelData] = useState<Hotels[]>([]);
    const [searchKey, setSearchKey] = useState<string>('');
    const [conversationId, setConversationId] = useState<string>('');

    const hotelsList = useCallback(async () => {
        setIsLoading(true);
        const data: searchList | false = await getHotels({
            userId: id,
            userType: role,
            ...hotelsRequest,
        });

        if (data) {
            const hotelDetails = data as searchList;
            const hotelArr = hotelDetails.data as Hotels[];
            const search = hotelDetails?.commonData?.searchKey;
            const convid = hotelDetails.conversationId;
            dispatch(sethotelArr(hotelDetails));
            setHotelData(hotelArr);
            setSearchKey(search);
            setConversationId(convid);
            setIsLoading(false);
        } else {
            setHotelData([]);
            setSearchKey('');
            setConversationId('');
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, id, role]);

    useEffect(() => {
        if (key) {
            hotelsList();
        }
    }, [hotelsList, key]);
    return { data: hotelData, isLoading, searchKey, conversationId, hotelsList };
}
