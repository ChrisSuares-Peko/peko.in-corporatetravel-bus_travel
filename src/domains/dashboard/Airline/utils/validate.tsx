import { airlineData } from '../types/airlineTypes';

type IRes = {
    status: boolean;
    error: string;
};

const validateOneway = (res: IRes, data: airlineData, index: number) => {
    if (data.flightSegments[index].departureAirportCode === '') {
        res.status = false;
        res.error = 'Please select a source';
    } else if (data.flightSegments[index].arrivalAirportCode === '') {
        res.status = false;
        res.error = 'Please select a destination';
    } else if (
        data.flightSegments[index].departureAirportCode ===
        data.flightSegments[index].arrivalAirportCode
    ) {
        res.status = false;
        res.error = 'Departure Airport and Arrival Airport Cannot be Same';
    } else if (
        data.flightSegments[index].departureDate === '' ||
        data.flightSegments[index].departureDate === 'Invalid Date'
    ) {
        res.status = false;
        if (index === 0) res.error = 'Please select a departure date';
        if (index === 1) res.error = 'Please select a return date';
    } else if (data.flightSegments[index].cabinPreferences[0] === null) {
        res.status = false;
        res.error = 'Please select a cabin class';
    } else if (data.passengerData.adultCount === 0) {
        res.status = false;
        res.error = 'Please select a passenget count';
    }
    return res;
};

const validateRoundTrip = (res: IRes, data: airlineData) => {
    const valid = validateOneway(res, data, 1);
    if (valid.status)
        if (data.flightSegments[0].departureDate > data.flightSegments[1].departureDate) {
            res.status = false;
            res.error = 'Please select a different dates';
        }
    return res;
};

export const validate = (data: airlineData, tripType: string) => {
    const res = {
        status: true,
        error: '',
    };

    if (tripType === 'oneWay') {
        return validateOneway(res, data, 0);
    }
    if (tripType === 'roundTrip') {
        const departureDate0 = data.flightSegments[0].departureDate;
        const departureDate1 = data.flightSegments[1].departureDate;

        const date0 = new Date(departureDate0);
        const date1 = new Date(departureDate1);

        if (date0 > date1) {
            res.status = false;
            res.error = 'Please select a future date for return';
        }
        const valid = validateOneway(res, data, 0);
        if (valid.status === true) return validateRoundTrip(res, data);
    }
    if (tripType === 'multiCity') {
        const departureDate0 = data.flightSegments[0].departureDate;
        const departureDate1 = data.flightSegments[1].departureDate;

        const date0 = new Date(departureDate0);
        const date1 = new Date(departureDate1);

        if (date0 > date1) {
            res.status = false;
            res.error = 'Please select a future date for return';
        }
        const valid = validateOneway(res, data, 0);
        if (valid.status === true) return validateOneway(res, data, 1);
    }

    return res;
};
