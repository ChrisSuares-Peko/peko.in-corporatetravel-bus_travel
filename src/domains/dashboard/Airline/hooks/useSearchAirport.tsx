import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getSearchAirport } from '../api';
import { AirportSearchResult, ISearchData } from '../types/searchAirports';

export const useGetSearchAirport = (loc: string) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [searchData, setSearchData] = useState<ISearchData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAirportSearchHandler = useCallback(async () => {
        const data: AirportSearchResult | false = await getSearchAirport({
            userId: id,
            userType: role,
            loc,
        });

        if (data) {
            const { airports } = data;
            const arr = airports
                ?.map(item => ({
                    value: item.airportCode ?? '',
                    location: `${item.cityName}, ${item.countryName}`,
                    label: `${item.airportName}` ?? '',
                }))
                .slice(0, 200);
            setSearchData(arr);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [id, loc, role]);

    useEffect(() => {
        getAirportSearchHandler();
    }, [getAirportSearchHandler]);
    return { data: searchData, isLoading };
};

// import { useCallback, useEffect, useState } from 'react';

// import { useAppSelector } from '@src/hooks/store';

// import { getSearchAirport } from '../api';
// import { AirportSearchResult, ISearchData } from '../types/searchAirports';

// type Airport = {
//     cityName: string;
//     countryName: string;
//     airportName: string;
//     airportCode: string;
// };

// export const useGetSearchAirport = (searchText: string) => {
//     const { role, id } = useAppSelector(state => state.reducer.auth);
//     const [searchData, setSearchData] = useState<ISearchData[]>([]);
//     const [airportsList, setAirportsList] = useState<Airport[]>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const getAirportSearchHandler = useCallback(async () => {
//         console.log('----')
//         if (!airportsList || airportsList.length === 0) {
//             setIsLoading(true); // Set loading state while fetching
//             let data: AirportSearchResult | false = await getSearchAirport({
//                 userId: id,
//                 userType: role,
//                 loc: '',
//             });
//             if (data) {
//                 const { airports } = data;
//                 setAirportsList(airports);
//             }
//             setIsLoading(false); // Remove loading state once fetched
//         }
//         // Filter the airportsList based on searchText (like SQL WHERE clause)
//         const filteredAirports = airportsList.filter(item =>
//             (item?.airportName?.toLowerCase()?.includes(searchText.toLowerCase()) || '') ||
//             (item?.airportCode?.toLowerCase()?.includes(searchText.toLowerCase()) || '') ||
//             (item?.cityName?.toLowerCase()?.includes(searchText.toLowerCase()) || '')
//         );
//         // Map filtered results to the required format
//         const arr = filteredAirports.map(item => ({
//             value: item.airportCode ?? '',
//             location: `${item.cityName}, ${item.countryName}`,
//             label: `${item.airportName}` ?? '',
//         })).slice(0, 100);
//         setSearchData(arr);
//     }, [id, searchText, role]);

//     useEffect(() => {
//         getAirportSearchHandler();
//     }, [getAirportSearchHandler]);
//     return { data: searchData, isLoading };
// };
