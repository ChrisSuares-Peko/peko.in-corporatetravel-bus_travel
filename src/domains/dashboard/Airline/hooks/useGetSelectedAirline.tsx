import { useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { setProvBookingDetails, setProvBookingJourney, setOfferId } from '../slices/airlineSlice';
import { IFlightSearchResponse } from '../types/airlineList';

export default function useGetSelectedAirline() {
    const [returnData, setReturnData] = useState(false);
    const selectedAirline = useAppSelector(state => state.reducer.airline.selectedAirline);
    const airlineData = useAppSelector(state => state.reducer.airline.airlineData);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useAppDispatch();

    const getSelectedAirline = useCallback(async () => {
        const data: IFlightSearchResponse = airlineData as IFlightSearchResponse;
        if (data) {
            const selectedData = data.data.find(item => item.offerId === selectedAirline.offerId);
            if (selectedData) {
                dispatch(setOfferId(selectedData.offerId));
                dispatch(setProvBookingDetails(selectedData.detail));
                dispatch(setProvBookingJourney(selectedData.journey));
                setReturnData(true);
            }

            setIsLoading(false);
            setReturnData(true);
        } else {
            setIsLoading(false);
        }
    }, [airlineData, dispatch, selectedAirline.offerId]);

    useEffect(() => {
        getSelectedAirline();
    }, [getSelectedAirline]);

    return { data: returnData, isLoading };
}
