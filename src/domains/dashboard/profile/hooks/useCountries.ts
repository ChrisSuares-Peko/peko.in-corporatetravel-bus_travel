import { useCallback, useEffect, useState } from 'react';

import { DropDown } from '@customtypes/general';

import { getCountries } from '../api/general';
import { CountriesResponse } from '../types';

export default function useCountries() {
    const [countriesList, setCountriesList] = useState<DropDown>();

    const fetchCountries = useCallback(async () => {
        const data: CountriesResponse | false = await getCountries();
        if (data) {
            setCountriesList(data.countries);
        }
    }, []);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    return { countriesList };
}
