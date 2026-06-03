import { useCallback, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { fetchCityData } from '../Api';
import { City, CityData } from '../types/types';

export default function useSearchCityApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [cityOptions, setCityOptions] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const cityList = useCallback(
        async (searchCountry: string) => {
            const data: CityData | false = await fetchCityData({
                userId: id,
                userType: role,
                searchText: searchCountry,
            });

            if (data) {
                const countriesInfo = data.cities as City[];
                setCityOptions(countriesInfo.slice(0, 50));
            }
        },
        [id, role]
    );

    return { isLoading, cityList, cityOptions };
}
