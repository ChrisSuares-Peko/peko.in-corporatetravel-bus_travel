import { useCallback, useEffect, useState } from 'react';

import { getCountriesAPI } from '../api';

export default function useGetCountries() {
    const [isLoading, setIsLoading] = useState(true);
    const [countryData, setCountryData] = useState([]);

    const HandleGetCountries = useCallback(async () => {
        const data: any | false = await getCountriesAPI();

        if (data) {
            setCountryData(data?.countries);
            setIsLoading(false);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        HandleGetCountries();
    }, [HandleGetCountries]);

    return { countryData, isLoading };
}
