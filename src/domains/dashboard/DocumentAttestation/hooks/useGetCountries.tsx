import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getCountriesAPI } from '../api';

export function useGetCountries() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [countryData, setCountryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetCountries = useCallback(async () => {
        const data: any | false = await getCountriesAPI({
            userId: id,
            userType: role,
        });

        if (data) {
            setCountryData(data?.data);
            setIsLoading(false);
        }
        setIsLoading(false);
    }, [id, role]);

    useEffect(() => {
        handleGetCountries();
    }, [handleGetCountries]);
    return { isLoading, countryData };
}
