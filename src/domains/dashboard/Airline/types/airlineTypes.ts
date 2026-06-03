export type airlineData = {
    tripType: string;
    flightSegments: flightSegments[];
    passengerData: {
        adultCount: number;
        childCount: number;
        infantCount: number;
    };
};

type flightSegments = {
    departureAirportCode: string;
    departureDate: string;
    departureTimeFrom: string;
    departureTimeTo: string;
    arrivalTimeFrom: string;
    arrivalTimeTo: string;
    arrivalAirportCode: string;
    cabinPreferences: string[];
};

export type ITripData = {
    tripType: string;
    fromLocation: string;
    toLocation: string;
    depart: string;
    departDay: string;
    arrive: string;
    arriveDay: string;
    fromLocation1: string;
    toLocation1: string;
    depart1: string;
    departDay1: string;
    arrive1: string;
    arriveDay1: string;
    adults: number;
    children: number;
    infants: number;
    class: string;
};

export type IGetOneWaySearch = {
    userId: string;
    userType: string;
    tripDetails: airlineData;
};
