import { Journey } from './airlineList';

export interface Flight {
    id: string;
    logo: string;
    flightName: string;
    flightClass: string;
    flightDuration: string;
    lcc: boolean;
    stopCount: number;
    depart: {
        datetime: Date;
    };
    arrive: {
        datetime: Date;
    };
    journey: Journey[];
    onPoint: string;
    offPoint: string;
    offerId: string;
    flightKey: string;
    flightCode: string;
    totalTax: number;
    price: number;
    flightNumber: string;
    operatingAirline: string;
}

export type filterTypes = {
    startPrice: number;
    endPrice: number;
    layover: number | null;
    airlineTimeCode: 1 | 2 | 3 | 4 | null;
    flightCode: string | null;
};
