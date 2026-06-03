import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { cityListing } from '../api';
import { ICityListingResponse, commonSelectType } from '../types';

export const useLogisticsCityListingApi = (searchText: string, countryCode: string) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [cityDetails, setCityDetails] = useState<commonSelectType[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const getCityList = useCallback(async () => {
        const data: ICityListingResponse | false = await cityListing({
            userId: id,
            userType: role,
            searchText,
            countryCode,
        });
        if (data) {
            const listingData = data;

            const arr = listingData?.Cities?.map(item => ({
                oName: item ?? '',
                oValue: item ?? '',
            }));
            setCityDetails(arr);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [searchText, id, role, countryCode]);
    useEffect(() => {
        getCityList();
    }, [getCityList]);
    return { data: cityDetails, isLoading, setIsLoading, setCityDetails };
};
