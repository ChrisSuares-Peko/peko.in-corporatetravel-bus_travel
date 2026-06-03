import { useCallback, useEffect, useState } from 'react';

import { getCountriesAPI, getCountriesPhoneCodeAPI } from '../api';

export default function useGetCountries() {
    const [isLoading, setIsLoading] = useState(true);
    const [countryData, setCountryData] = useState([]);
    const [phoneCodes, setPhoneCodes] = useState([]);

    const HandleGetCountries = useCallback(async () => {
        const data: any | false = await getCountriesAPI();

        if (data) {
            setCountryData(data?.countryCodes);
            setIsLoading(false);
        }
        setIsLoading(false);
    }, []);

    const HandleGetCountriesPhoneCode = useCallback(async () => {
        const data: any | false = await getCountriesPhoneCodeAPI();

        if (data) {
            setPhoneCodes(data.phoneCodes);
            setIsLoading(false);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        HandleGetCountries();
        HandleGetCountriesPhoneCode();
    }, [HandleGetCountries, HandleGetCountriesPhoneCode]);

    return { countryData, phoneCodes, isLoading };
}
