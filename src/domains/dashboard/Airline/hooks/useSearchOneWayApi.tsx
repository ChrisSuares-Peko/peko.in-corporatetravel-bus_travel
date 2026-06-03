import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { getOneWaySearch } from '../api';
import { setAirlineData, setconversationId, setfilghtResponse } from '../slices/airlineSlice';
import { IFlightSearchResponse } from '../types/airlineList';
import { Flight } from '../types/Flight';

export const useGetOneWaySearch = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [searchData, setSearchData] = useState<Flight[]>([]);
    const [noResult, setNoResult] = useState<boolean>(false);
    const [filterCount, setFilterCount] = useState<{ lowestPrice: number; highestPrice: number }>({
        lowestPrice: Infinity,
        highestPrice: -Infinity,
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const dispatch = useAppDispatch();

    const getOneWaySearchHandler = async (tripDetails: {}) => {
        setIsLoading(true);
        const data: IFlightSearchResponse | false = await getOneWaySearch({
            userId: id,
            userType: role,
            tripDetails,
        });

        if (data) {
            dispatch(setconversationId(data.conversationId));

            dispatch(setAirlineData(data));

            const resData: Flight[] = await Promise.all(
                data.data.map(async (item, index) => ({
                    id: index.toString(),
                    logo: `https://res.cloudinary.com/dqhshqcqd/image/upload/v1710764763/Airline/${item.fare.platingAirlineCode}.png`,
                    flightName: '',
                    flightClass: item.journey[0].flightSegments[0].cabinClass,
                    flightDuration: item.journey[0].flight.flightInfo.duration,
                    stopCount: item.journey[0].flight.stopQuantity,
                    depart: {
                        datetime: item.journey[0].flightSegments[0].departureDateTime,
                    },
                    arrive: {
                        datetime:
                            item.journey[item.journey.length - 1].flightSegments[0].arrivalDateTime,
                    },
                    onPoint: item.journey[0].flight.segmentReference.onPoint,
                    offPoint: item.journey[0].flight.segmentReference.offPoint,
                    journey: item.journey,
                    flightKey: item.journey[0].flight.flightKey,
                    flightCode: item.fare.platingAirlineCode,
                    baggageAllowance: item.journey[0].flightSegments[0].baggageAllowance,
                    totalTax: item.fare.totalTax,
                    offerId: item.offerId,
                    lcc: item.detail.lcc,
                    price: item.fare.totalFare,
                    flightNumber: item.journey[0].flightSegments[0].flightNumber,
                    operatingAirline: item.journey[0].flightSegments[0].operatingAirline,
                }))
            );
            dispatch(setfilghtResponse(resData));

            if (resData.length === 0) setNoResult(true);
            setSearchData(resData);
            const prices = resData.map(flight => flight.price);
            const lowestPrice = Math.min(...prices);
            const highestPrice = Math.max(...prices);

            setFilterCount({
                lowestPrice: lowestPrice === Infinity ? 0 : lowestPrice,
                highestPrice: highestPrice === -Infinity ? 0 : highestPrice,
            });
            setIsLoading(false);

            return resData;
        }
        setNoResult(true);
        setIsLoading(false);
        return null;
    };

    return {
        searchHandler: getOneWaySearchHandler,
        data: searchData,
        filterCount,
        isLoading,
        noResult,
    };
};
