import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getCountries } from '../api/BeneficiaryRegistrationApis';
import { CountryListResponse, TransferData } from '../types/types';

export function useGetCountriesList(initialCountryCode?: string) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [countries, setCountries] = useState<TransferData[]>([]);
    const fetchCountries = useCallback(async () => {
        const data: CountryListResponse | false = await getCountries({
            userId: id,
            userType: role,
            countryCode: undefined,
        });
        if (data) {
            const details = data.data as TransferData[];
            setCountries(details);
        }
    }, [id, role]);

    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    const generateCountriesDropdown = (data: TransferData[]) => {
        const uniqueCountries = new Map<string, string>();

        data.forEach(item => {
            if (!uniqueCountries.has(item.countryCode)) {
                uniqueCountries.set(item.countryCode, item.countryName);
            }
        });

        return Array.from(uniqueCountries.entries()).map(([value, label]) => ({
            value,
            label,
        }));
    };

    return { data: countries, generateCountriesDropdown };
}
