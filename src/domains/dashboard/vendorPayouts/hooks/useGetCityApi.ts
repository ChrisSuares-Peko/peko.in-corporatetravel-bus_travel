import { useState, useEffect } from 'react';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { getCity } from '../api/BeneficiaryRegistrationApis';

export default function useGetCity(
    selectedCountry: string | undefined,
    selectedState: string | undefined
) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [loading, setLoading] = useState(true);
    const [cities, setCities] = useState<SuccessGenericResponse<any> | []>([]);
    const [cityOptions, setCityOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;
        const fetchCities = async () => {
            setLoading(true);
            const cityData = await getCity({
                userId: id,
                userType: role,
                countryCode: selectedCountry,
                stateCode: selectedState,
            });
            if (isMounted) {
                const formattedCities =
                    cityData?.data?.data?.map((city: { cityName: any }) => ({
                        value: city.cityName,
                        label: city.cityName,
                    })) || [];
                setCities(cityData?.data?.data ?? []);
                setCityOptions(formattedCities);
                setLoading(false);
            }
        };

        if (selectedCountry && selectedState) {
            fetchCities();
        } else {
            setLoading(false);
            setCityOptions([]);
        }

        return () => {
            isMounted = false;
        };
    }, [role, id, selectedCountry, selectedState]);

    return { cities, loading, cityOptions };
}
