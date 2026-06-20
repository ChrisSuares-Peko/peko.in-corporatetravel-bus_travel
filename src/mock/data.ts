// Mock data for the Corporate Travel prototype.
// Populate these arrays with real API data when the backend is ready.

// ─────────────────────────────────────────────
// Bus Tickets
// ─────────────────────────────────────────────

export type BusAmenity =
    | 'Blankets'
    | 'Charging Point'
    | 'Emergency Contact Number'
    | 'Movie'
    | 'Wifi'
    | 'Water Bottle';

export type BusDepartureSlot =
    | '6AM-12PM'
    | '12PM-6PM'
    | '6PM-12AM'
    | '12AM-6AM';

export type BusType = 'AC' | 'NonAC' | 'Sleeper' | 'Seater';

export interface BusEntry {
    id: string;
    operator: string;
    busType: string;
    type: BusType;
    departure: string;
    arrival: string;
    duration: string;
    price: number;
    originalPrice: number;
    seatsLeft: number;
    rating: number;
    totalRatings: number;
    isLiveTrackable: boolean;
    amenities: BusAmenity[];
    departureSlot: BusDepartureSlot;
    boardingPoints: string[];
    dropPoints: string[];
}

export const mockBuses: BusEntry[] = [
    {
        id: 'BUS001',
        operator: 'Parveen Travels',
        busType: 'Bharat Benz A/C Sleeper (2+1)',
        type: 'Sleeper',
        departure: '10:30 PM',
        arrival: '05:20 AM',
        duration: '6h 50m',
        price: 950,
        originalPrice: 1200,
        seatsLeft: 12,
        rating: 4.2,
        totalRatings: 1240,
        isLiveTrackable: true,
        amenities: ['Blankets', 'Charging Point', 'Water Bottle', 'Wifi'],
        departureSlot: '6PM-12AM',
        boardingPoints: ['Bangalore Majestic', 'KR Puram', 'Electronic City', 'Silk Board'],
        dropPoints: ['Mumbai Dadar', 'Bandra', 'Andheri', 'Borivali'],
    },
    {
        id: 'BUS002',
        operator: 'VRL Travels',
        busType: 'Volvo 9600 A/C Multi Axle Semi Sleeper',
        type: 'AC',
        departure: '08:00 PM',
        arrival: '03:45 AM',
        duration: '7h 45m',
        price: 1100,
        originalPrice: 1400,
        seatsLeft: 5,
        rating: 4.5,
        totalRatings: 3200,
        isLiveTrackable: true,
        amenities: ['Blankets', 'Charging Point', 'Movie', 'Water Bottle', 'Wifi'],
        departureSlot: '6PM-12AM',
        boardingPoints: ['Bangalore Kempegowda Bus Stand', 'Goraguntepalya', 'Yeshwanthpur'],
        dropPoints: ['Mumbai Central', 'Dadar', 'Thane'],
    },
    {
        id: 'BUS003',
        operator: 'SRS Travels',
        busType: 'Non A/C Seater (2+3)',
        type: 'Seater',
        departure: '09:00 AM',
        arrival: '05:30 PM',
        duration: '8h 30m',
        price: 450,
        originalPrice: 600,
        seatsLeft: 28,
        rating: 3.8,
        totalRatings: 890,
        isLiveTrackable: false,
        amenities: ['Charging Point', 'Emergency Contact Number'],
        departureSlot: '6AM-12PM',
        boardingPoints: ['Bangalore Majestic', 'KR Puram', 'Whitefield'],
        dropPoints: ['Mumbai Dadar', 'Kurla', 'Thane', 'Borivali'],
    },
    {
        id: 'BUS004',
        operator: 'Orange Travels',
        busType: 'Volvo B11R A/C Sleeper Cum Seater',
        type: 'AC',
        departure: '03:00 PM',
        arrival: '10:30 PM',
        duration: '7h 30m',
        price: 1250,
        originalPrice: 1600,
        seatsLeft: 8,
        rating: 4.7,
        totalRatings: 4100,
        isLiveTrackable: true,
        amenities: ['Blankets', 'Charging Point', 'Movie', 'Wifi', 'Water Bottle'],
        departureSlot: '12PM-6PM',
        boardingPoints: ['Bangalore Silk Board', 'Electronic City', 'Hosur Road'],
        dropPoints: ['Mumbai Andheri', 'Bandra', 'Dadar'],
    },
    {
        id: 'BUS005',
        operator: 'KSRTC Karnataka',
        busType: 'Non A/C Sleeper (2+1)',
        type: 'NonAC',
        departure: '11:45 PM',
        arrival: '07:00 AM',
        duration: '7h 15m',
        price: 650,
        originalPrice: 780,
        seatsLeft: 18,
        rating: 3.5,
        totalRatings: 560,
        isLiveTrackable: false,
        amenities: ['Emergency Contact Number'],
        departureSlot: '6PM-12AM',
        boardingPoints: ['Bangalore Majestic', 'Tumkur Road', 'Nelamangala'],
        dropPoints: ['Mumbai Dadar', 'Sion', 'Kurla'],
    },
    {
        id: 'BUS006',
        operator: 'IntrCity SmartBus',
        busType: 'A/C Seater / Sleeper (2+1)',
        type: 'Seater',
        departure: '06:30 AM',
        arrival: '01:15 PM',
        duration: '6h 45m',
        price: 899,
        originalPrice: 1050,
        seatsLeft: 15,
        rating: 4.4,
        totalRatings: 2180,
        isLiveTrackable: true,
        amenities: ['Blankets', 'Charging Point', 'Wifi', 'Water Bottle'],
        departureSlot: '6AM-12PM',
        boardingPoints: ['Bangalore Indiranagar', 'Koramangala', 'Electronic City'],
        dropPoints: ['Mumbai BKC', 'Andheri', 'Goregaon'],
    },
    {
        id: 'BUS007',
        operator: 'Sugama Tourist',
        busType: 'Non A/C Seater (2+2)',
        type: 'NonAC',
        departure: '01:30 PM',
        arrival: '10:00 PM',
        duration: '8h 30m',
        price: 400,
        originalPrice: 520,
        seatsLeft: 32,
        rating: 3.2,
        totalRatings: 340,
        isLiveTrackable: false,
        amenities: ['Emergency Contact Number', 'Charging Point'],
        departureSlot: '12PM-6PM',
        boardingPoints: ['Bangalore Majestic', 'Peenya', 'Tumkur Road'],
        dropPoints: ['Mumbai Dadar', 'Thane', 'Navi Mumbai'],
    },
    {
        id: 'BUS008',
        operator: 'Chartered Speed',
        busType: 'Volvo B9R A/C Sleeper (2+1)',
        type: 'Sleeper',
        departure: '02:00 AM',
        arrival: '08:45 AM',
        duration: '6h 45m',
        price: 1050,
        originalPrice: 1300,
        seatsLeft: 6,
        rating: 4.0,
        totalRatings: 1870,
        isLiveTrackable: true,
        amenities: ['Blankets', 'Charging Point', 'Water Bottle'],
        departureSlot: '12AM-6AM',
        boardingPoints: ['Bangalore Madivala', 'Electronic City', 'Hosur Road'],
        dropPoints: ['Mumbai Vashi', 'Nerul', 'Panvel'],
    },
];

// ─────────────────────────────────────────────
// Bus Results (v2 — structured for the results screen)
// ─────────────────────────────────────────────

export type BusSlot = 'before6' | '6to12' | '12to6' | 'after6';

export interface BusStop {
    city: string;
    state: string;
    time: string; // 24hr display time, e.g. "21:43"
    date: string; // display date, e.g. "20 Jun"
}

export interface BusResultEntry {
    id: string;
    operator: string;
    busType: string;
    type: BusType;
    departure: BusStop;
    arrival: BusStop;
    duration: string;
    stops: string;
    price: number;
    originalPrice: number;
    seatsLeft: number;
    singleSeats: number;
    rating: number;
    totalRatings: number;
    isLiveTrackable: boolean;
    freeCancellation: boolean;
    amenities: BusAmenity[];
    departureSlot: BusSlot;
    offerTag: string | null;
}

export const mockBusResults: BusResultEntry[] = [
    {
        id: 'R001',
        operator: 'Varahi Travels',
        busType: 'A/C Sleeper (2+1)',
        type: 'Sleeper',
        departure: { city: 'Bangalore', state: 'Karnataka', time: '21:43', date: '20 Jun' },
        arrival:   { city: 'Chennai',   state: 'Tamil Nadu', time: '05:25', date: '21 Jun' },
        duration: '7h 42m', stops: 'Non Stop',
        price: 899, originalPrice: 999,
        seatsLeft: 15, singleSeats: 4,
        rating: 4.9, totalRatings: 110,
        isLiveTrackable: true, freeCancellation: true,
        amenities: ['Blankets', 'Charging Point', 'Water Bottle'],
        departureSlot: 'after6',
        offerTag: 'Exclusive 10% OFF',
    },
    {
        id: 'R002',
        operator: 'Intercity Travels',
        busType: 'Bharat Benz A/C Sleeper (2+1)',
        type: 'Sleeper',
        departure: { city: 'Bangalore', state: 'Karnataka', time: '21:40', date: '20 Jun' },
        arrival:   { city: 'Chennai',   state: 'Tamil Nadu', time: '05:45', date: '21 Jun' },
        duration: '8h 5m', stops: 'Non Stop',
        price: 899, originalPrice: 899,
        seatsLeft: 17, singleSeats: 5,
        rating: 4.5, totalRatings: 144,
        isLiveTrackable: true, freeCancellation: false,
        amenities: ['Blankets', 'Charging Point', 'Wifi'],
        departureSlot: 'after6',
        offerTag: null,
    },
    {
        id: 'R003',
        operator: 'VRL Travels',
        busType: 'Volvo A/C Multi Axle Sleeper (2+1)',
        type: 'AC',
        departure: { city: 'Bangalore', state: 'Karnataka', time: '20:00', date: '20 Jun' },
        arrival:   { city: 'Chennai',   state: 'Tamil Nadu', time: '03:45', date: '21 Jun' },
        duration: '7h 45m', stops: 'Non Stop',
        price: 1100, originalPrice: 1400,
        seatsLeft: 5, singleSeats: 2,
        rating: 4.5, totalRatings: 3200,
        isLiveTrackable: true, freeCancellation: true,
        amenities: ['Blankets', 'Charging Point', 'Movie', 'Water Bottle', 'Wifi'],
        departureSlot: 'after6',
        offerTag: 'Free Cancellation',
    },
    {
        id: 'R004',
        operator: 'Orange Travels',
        busType: 'Volvo B11R A/C Sleeper Cum Seater',
        type: 'AC',
        departure: { city: 'Bangalore', state: 'Karnataka', time: '15:00', date: '20 Jun' },
        arrival:   { city: 'Chennai',   state: 'Tamil Nadu', time: '22:30', date: '20 Jun' },
        duration: '7h 30m', stops: 'Non Stop',
        price: 1250, originalPrice: 1600,
        seatsLeft: 8, singleSeats: 3,
        rating: 4.7, totalRatings: 4100,
        isLiveTrackable: true, freeCancellation: false,
        amenities: ['Blankets', 'Charging Point', 'Movie', 'Wifi', 'Water Bottle'],
        departureSlot: '12to6',
        offerTag: 'Exclusive 20% OFF',
    },
    {
        id: 'R005',
        operator: 'SRS Travels',
        busType: 'Non A/C Seater (2+3)',
        type: 'Seater',
        departure: { city: 'Bangalore', state: 'Karnataka', time: '09:00', date: '20 Jun' },
        arrival:   { city: 'Chennai',   state: 'Tamil Nadu', time: '17:30', date: '20 Jun' },
        duration: '8h 30m', stops: '1 Stop',
        price: 450, originalPrice: 600,
        seatsLeft: 28, singleSeats: 0,
        rating: 3.8, totalRatings: 890,
        isLiveTrackable: false, freeCancellation: false,
        amenities: ['Charging Point', 'Emergency Contact Number'],
        departureSlot: '6to12',
        offerTag: null,
    },
    {
        id: 'R006',
        operator: 'KSRTC Karnataka',
        busType: 'Non A/C Sleeper (2+1)',
        type: 'NonAC',
        departure: { city: 'Bangalore', state: 'Karnataka', time: '23:45', date: '20 Jun' },
        arrival:   { city: 'Chennai',   state: 'Tamil Nadu', time: '07:00', date: '21 Jun' },
        duration: '7h 15m', stops: 'Non Stop',
        price: 650, originalPrice: 780,
        seatsLeft: 18, singleSeats: 6,
        rating: 3.5, totalRatings: 560,
        isLiveTrackable: false, freeCancellation: false,
        amenities: ['Emergency Contact Number'],
        departureSlot: 'after6',
        offerTag: null,
    },
    {
        id: 'R007',
        operator: 'IntrCity SmartBus',
        busType: 'A/C Seater / Sleeper (2+1)',
        type: 'Seater',
        departure: { city: 'Bangalore', state: 'Karnataka', time: '06:30', date: '20 Jun' },
        arrival:   { city: 'Chennai',   state: 'Tamil Nadu', time: '13:15', date: '20 Jun' },
        duration: '6h 45m', stops: 'Non Stop',
        price: 899, originalPrice: 1050,
        seatsLeft: 15, singleSeats: 5,
        rating: 4.4, totalRatings: 2180,
        isLiveTrackable: true, freeCancellation: true,
        amenities: ['Blankets', 'Charging Point', 'Wifi', 'Water Bottle'],
        departureSlot: '6to12',
        offerTag: null,
    },
    {
        id: 'R008',
        operator: 'Chartered Speed',
        busType: 'Volvo B9R A/C Sleeper (2+1)',
        type: 'Sleeper',
        departure: { city: 'Bangalore', state: 'Karnataka', time: '02:00', date: '20 Jun' },
        arrival:   { city: 'Chennai',   state: 'Tamil Nadu', time: '08:45', date: '20 Jun' },
        duration: '6h 45m', stops: 'Non Stop',
        price: 1050, originalPrice: 1300,
        seatsLeft: 6, singleSeats: 2,
        rating: 4.0, totalRatings: 1870,
        isLiveTrackable: true, freeCancellation: false,
        amenities: ['Blankets', 'Charging Point', 'Water Bottle'],
        departureSlot: 'before6',
        offerTag: null,
    },
];

// ─────────────────────────────────────────────
// Other services — will be populated later
// ─────────────────────────────────────────────

// Flight search results returned by the airline search API
export const mockFlights: any[] = [];

// Hotel listings returned by the hotel search API
export const mockHotels: any[] = [];

// eSIM package listings
export const mockEsimPackages: any[] = [];

// Visa eligibility and requirements results
export const mockVisaResults: any[] = [];

// User's existing bookings (flights, hotels, eSIM, bus)
export const mockBookings: any[] = [];

// Countries list for origin/destination selectors
export const mockCountries: any[] = [];
