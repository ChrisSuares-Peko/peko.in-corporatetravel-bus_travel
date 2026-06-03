type FlightSegment = {
    departureAirportCode: string;
    departureDate: string;
    departureTimeFrom: string;
    departureTimeTo: string;
    arrivalTimeFrom: string;
    arrivalTimeTo: string;
    arrivalAirportCode: string;
    cabinPreferences: string;
};

type PassengerData = {
    adultCount: number;
    childCount: number;
    infantCount: number;
};

type FormData = {
    tripType: string;
    flightSegments: FlightSegment[];
    passengerData: PassengerData;
};

type SearchData = {
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

type BaggageAllowance = {
    checkedInBaggage: {
        value: string;
        unit: string;
    }[];
};

type SelectedAirline = {
    onPoint: string;
    offPoint: string;
    flightDuration: string;
    price: string;
    flightClass: string;
    flightCode: string;
    totalTax: string;
    flightKey: string;
    stopCount: string;
    offerId: string;
    lcc: boolean;
    logo: string;
    journey: any[];
    baggageAllowance: BaggageAllowance;
    arrive: {
        datetime: string;
    };
    depart: {
        datetime: string;
    };
};

type SelectedAncillary = {
    ancType: string;
    ancillaryOfferId: string;
    passengerKey: string;
    segmentKey: string;
    itemPrice: number;
};

type SelectedAncillaries = {
    selectedAncillaries: SelectedAncillary[];
    conversationId: string;
    isLcc: boolean;
    offerId: string;
};

type QuickUpdateData = {
    date: string;
    tripType: string;
};

export type InitialState = {
    formData: FormData;
    searchData: SearchData;
    selectedAirline: SelectedAirline;
    airlineData: any;
    bookingData: any;
    provBookingSuccess: any;
    paymentSuccesResponse: any;
    ancillariesSearch: any;
    selectedAncillaries: SelectedAncillaries;
    quickUpdateData: QuickUpdateData;
    orderDetails: any;
    flightResponse: any;
};
