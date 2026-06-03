/* eslint-disable @typescript-eslint/no-shadow */
import { useState, useEffect } from 'react';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { getCountry } from '../api/BeneficiaryRegistrationApis';

type CountryData = {
    countryCode: string;
    countryName: string;
    payingCurrency: string;
    receivingLimit: number;
    deliveryMode: number;
};

type FormattedOption = {
    value: string;
    label: string;
    name: string;
};

export default function useGetCountry() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [loading, setLoading] = useState(true);
    const [country, setCountry] = useState<SuccessGenericResponse<CountryData[]> | null>(null);
    const [countryOptions, setCountryOptions] = useState<FormattedOption[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchCountry = async () => {
            const response = await getCountry({ userId: id, userType: role });

            if (isMounted && response && response.data && Array.isArray(response.data.data)) {
                const data = response.data.data as CountryData[];

                setCountry(response);

                // Transform data to match the expected format
                const formattedOptions = data.map((country, index) => ({
                    value: country.countryCode,
                    label: country.countryName,
                    name: country.countryName,
                }));

                setCountryOptions(formattedOptions);
                setLoading(false);
            } else {
                console.error('Unexpected data format:', response?.data);
            }
        };

        fetchCountry();

        return () => {
            isMounted = false;
        };
    }, [role, id]);

    return { country, loading, countryOptions };
}
