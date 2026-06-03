import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { countryListing } from '../api';
import { ICountryListingResponse, commonSelectType } from '../types';

export const useLogisticsCountryListingApi = (searchText: string) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [countryDetails, setCountryDetails] = useState<commonSelectType[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const getCountryList = useCallback(async () => {
        const data: ICountryListingResponse | false = await countryListing({
            userId: id,
            userType: role,
            searchText,
        });
        if (data) {
            const listingData = data;

            const arr = listingData?.countries?.map(item => ({
                oName: item.name ?? '',
                oValue: item.alpha2Code ?? '',
            }));
            setCountryDetails(arr);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [searchText, id, role]);
    useEffect(() => {
        getCountryList();
    }, [getCountryList]);
    return { data: countryDetails, isLoading };
};
