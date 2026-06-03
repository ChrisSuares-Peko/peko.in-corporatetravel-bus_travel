import dayjs from 'dayjs';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { setFormData, setSearchData } from '../slices/airlineSlice';
import { ITripData, airlineData } from '../types/airlineTypes';
import { validate } from '../utils/validate';

export default function useHandleAirlineSearch() {
    const dispatch = useAppDispatch();
    const handleAirlineSearch = (tripData: ITripData) => {
        const data: airlineData = {
            tripType: tripData.tripType,
            flightSegments: [
                {
                    departureAirportCode: tripData.fromLocation1,
                    departureDate: dayjs(tripData.depart1, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    departureTimeFrom: '00:05',
                    departureTimeTo: '23:59',
                    arrivalTimeFrom: '00:45',
                    arrivalTimeTo: '23:00',
                    arrivalAirportCode: tripData.toLocation1,
                    cabinPreferences: [tripData.class],
                },
            ],
            passengerData: {
                adultCount: tripData.adults,
                childCount: tripData.children,
                infantCount: tripData.infants,
            },
        };

        if (tripData.tripType === 'roundTrip') {
            data.flightSegments.push({
                departureAirportCode: tripData.toLocation1,
                departureDate: dayjs(tripData.arrive, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                departureTimeFrom: '00:05',
                departureTimeTo: '23:59',
                arrivalTimeFrom: '00:45',
                arrivalTimeTo: '23:00',
                arrivalAirportCode: tripData.fromLocation1,
                cabinPreferences: [tripData.class],
            });
        } else if (tripData.tripType === 'multiCity') {
            data.flightSegments.push({
                departureAirportCode: tripData.fromLocation,
                departureDate: dayjs(tripData.depart, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                departureTimeFrom: '00:05',
                departureTimeTo: '23:59',
                arrivalTimeFrom: '00:45',
                arrivalTimeTo: '23:00',
                arrivalAirportCode: tripData.toLocation,
                cabinPreferences: [tripData.class],
            });
        }

        const valid = validate(data, tripData.tripType);

        if (valid.status) {
            dispatch(setSearchData(tripData));
            dispatch(setFormData(data));
            return { status: true, data };
        }
        dispatch(showToast({ description: valid.error, variant: 'error' }));
        return { status: false, data };
    };
    return { handleAirlineSearch };
}
