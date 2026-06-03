interface FlightInfo {
    duration: string;
}

interface BaggageAllowance {
    checkedInBaggage: {
        paxType: string;
        value: string;
        unit: string;
    }[];
}

interface FlightSegment {
    segmentKey: string;
    departureAirportCode: string;
    departureDateTime: Date;
    arrivalAirportCode: string;
    arrivalDateTime: Date;
    arrivalTerminal: string;
    duration: string;
    flightNumber: string;
    resBookDesigCode: string;
    numberInParty: number;
    operatingAirline: string;
    marketingAirline: string;
    seatsAvailable: string;
    fareBasis: string;
    equipmentType: string;
    baggageAllowance: BaggageAllowance;
    priceClassName: string;
    cabinClass: string;
}

export interface Journey {
    flight: {
        flightKey: string;
        flightInfo: FlightInfo;
        segmentReference: {
            onPoint: string;
            offPoint: string;
        };
        stopQuantity: number;
    };
    flightSegments: FlightSegment[];
}

interface FareType {
    fareCode: string;
    farePreference: string;
    preferenceContext: string;
    refundable: boolean;
}

interface CustomerAdditionalFareInfo {
    transactionFeeEarned: number;
    discount: number;
    plbearned: number;
    incentiveEarned: number;
    tdsOnIncentive: number;
}

interface FareBreakdown {
    fareBreakdownKey: string;
    passengerKeys: string[];
    fareType: string;
    fareReference: {
        fareBasis: string;
        segmentKey: string;
    }[];
    paxType: string;
    paxRate: {
        baseFare: number;
        totalTax: number;
        totalFare: string;
        taxes: {
            amount: number;
            taxCode: string;
        }[];
        customerAdditionalFareInfo: CustomerAdditionalFareInfo;
    };
}

interface Fare {
    fareKey: string;
    currencyCode: string;
    fareType: FareType;
    baseFare: number;
    totalTax: number;
    totalFare: number;
    platingAirlineCode: string;
    customerAdditionalFareInfo: CustomerAdditionalFareInfo;
    fareBreakdown: FareBreakdown[];
}

interface Data {
    offerId: string;
    detail: {
        ancillaryDetailsAvailable: boolean;
        lcc: boolean;
        apis: boolean;
        ndc: boolean;
        onHoldSupported: boolean;
        moreFaresAvailable: boolean;
        reissueSupported: boolean;
        fareRuleMandatory: boolean;
    };
    journey: Journey[];
    fare: Fare;
}

interface Meta {
    success: boolean;
    statusCode: number;
    statusMessage: string;
    actionType: string;
    conversationId: string;
}

interface CommonData {
    searchKey: string;
    productCode: string;
}

export interface IFlightSearchResponse {
    conversationId: string;
    meta: Meta;
    commonData: CommonData;
    data: Data[];
}
