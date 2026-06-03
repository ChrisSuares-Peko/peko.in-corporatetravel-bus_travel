import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { InitialState } from '../types/slices';
import { bookingData } from '../utils/bookingsData';

const initialState: InitialState = {
    formData: {
        tripType: '',
        flightSegments: [
            {
                departureAirportCode: '',
                departureDate: '',
                departureTimeFrom: '00:05',
                departureTimeTo: '23:59',
                arrivalTimeFrom: '00:45',
                arrivalTimeTo: '23:00',
                arrivalAirportCode: '',
                cabinPreferences: '',
            },
        ],
        passengerData: {
            adultCount: 0,
            childCount: 0,
            infantCount: 0,
        },
    },
    searchData: {
        tripType: '',
        fromLocation: '',
        toLocation: '',
        depart: '',
        departDay: '',
        arrive: '',
        arriveDay: '',
        fromLocation1: '',
        toLocation1: '',
        depart1: '',
        departDay1: '',
        arrive1: '',
        arriveDay1: '',
        adults: 1,
        children: 0,
        infants: 0,
        class: '5',
    },
    selectedAirline: {
        onPoint: '',
        offPoint: '',
        flightDuration: '',
        price: '',
        flightClass: '',
        flightCode: '',
        totalTax: '',
        flightKey: '',
        stopCount: '',
        offerId: '',
        lcc: false,
        logo: '',
        journey: [],
        baggageAllowance: {
            checkedInBaggage: [
                {
                    value: '',
                    unit: '',
                },
            ],
        },
        arrive: {
            datetime: '',
        },
        depart: {
            datetime: '',
        },
    },
    airlineData: {},
    bookingData,
    provBookingSuccess: {},
    paymentSuccesResponse: {},
    ancillariesSearch: {
        data: [],
    },
    selectedAncillaries: {
        selectedAncillaries: [
            // {
            //     ancType: '',
            //     ancillaryOfferId: '',
            //     passengerKey: '',
            //     segmentKey: '',
            //     itemPrice: 0,
            // },
        ],
        conversationId: '',
        isLcc: true,
        offerId: '',
    },
    quickUpdateData: {
        date: '',
        tripType: '',
    },
    orderDetails: null,
    flightResponse: {},
};

const airlineFormSlice = createSlice({
    name: 'airline',
    initialState,
    reducers: {
        setFormData: (state, action: PayloadAction<any>) => {
            state.formData = { ...state.formData, ...action.payload };
        },
        setSearchData: (state, action: PayloadAction<any>) => {
            state.searchData = { ...state.searchData, ...action.payload };
        },
        setSelectedAirline: (state, action: PayloadAction<any>) => {
            state.selectedAirline = { ...state.selectedAirline, ...action.payload };
        },
        setProvBooking: (state, action: PayloadAction<any>) => {
            state.bookingData = { ...state.bookingData, ...action.payload };
        },
        setAirlineData: (state, action: PayloadAction<any>) => {
            state.airlineData = { ...state.airlineData, ...action.payload };
        },
        setOfferId: (state, action: PayloadAction<any>) => {
            state.bookingData.offerId = action.payload;
        },
        setconversationId: (state, action: PayloadAction<any>) => {
            state.bookingData.conversationId = action.payload;
        },
        setProvBookingDetails: (state, action: PayloadAction<any>) => {
            state.bookingData.details = action.payload;
        },
        setProvBookingJourney: (state, action: PayloadAction<any>) => {
            state.bookingData.journey = action.payload;
        },
        addPassengersData: (state, action: PayloadAction<any>) => {
            const data = action.payload;
            const { passengerId } = data;

            const existingPassengerIndex = state.bookingData.passengers.findIndex(
                (passenger: { passengerId: any }) => passenger.passengerId === passengerId
            );
            if (existingPassengerIndex !== -1) {
                state.bookingData.passengers[existingPassengerIndex] = {
                    ...state.bookingData.passengers[existingPassengerIndex],
                    ...data,
                };
            } else {
                state.bookingData.passengers.push(data);
            }
        },
        addCustomerInfo: (state, action: PayloadAction<any>) => {
            const data = action.payload;
            state.bookingData.customerInfo.emailAddress = data.email;
        },
        setProvBookingSuccess: (state, action: PayloadAction<any>) => {
            state.provBookingSuccess = action.payload;
        },
        setPaymentSuccessResponse: (state, action: PayloadAction<any>) => {
            state.paymentSuccesResponse = action.payload;
        },
        setAncillariesSearch: (state, action: PayloadAction<any>) => {
            state.ancillariesSearch = action.payload;
        },
        setAncillariesConversationId: (state, action: PayloadAction<any>) => {
            state.selectedAncillaries.conversationId = action.payload;
        },
        setAncillariesOfferId: (state, action: PayloadAction<any>) => {
            state.selectedAncillaries.offerId = action.payload;
        },
        setSelectedAncillaries: (state, action: PayloadAction<any>) => {
            const { ancType, segmentKey, passengerKey } = action.payload;
            const existingAnc = state.selectedAncillaries.selectedAncillaries.findIndex(
                anc =>
                    anc.ancType === ancType &&
                    anc.segmentKey === segmentKey &&
                    anc.passengerKey === passengerKey
            );
            if (existingAnc !== -1) {
                state.selectedAncillaries.selectedAncillaries[existingAnc] = action.payload;
            } else {
                state.selectedAncillaries.selectedAncillaries.push(action.payload);
            }
        },
        removeSelectedAncillary: (state, action: PayloadAction<any>) => {
            const { ancType, segmentKey, passengerKey } = action.payload;
            state.selectedAncillaries.selectedAncillaries =
                state.selectedAncillaries.selectedAncillaries.filter(
                    anc =>
                        !(
                            anc.ancType === ancType &&
                            anc.segmentKey === segmentKey &&
                            anc.passengerKey === passengerKey
                        )
                );
        },
        setQuickUpdateDate: (state, action: PayloadAction<any>) => {
            state.quickUpdateData.date = action.payload;
        },
        setQuickUpdateTripType: (state, action: PayloadAction<any>) => {
            state.quickUpdateData.tripType = action.payload;
        },
        setfilghtResponse: (state, action: PayloadAction<any>) => {
            state.flightResponse = action.payload;
        },
        resetFilghtResponse: state => {
            state.flightResponse = initialState.flightResponse;
            return state;
        },
        resetSelectedAncillaries: state => {
            state.selectedAncillaries.selectedAncillaries = [];
        },
        setSelectedOrderDetails: (state, action: PayloadAction<any>) => {
            state.orderDetails = { ...state.orderDetails, ...action.payload };
        },
        resetSelectedOrderDetails: state => {
            state.orderDetails = null;
        },
        resetFormState: () => initialState,
    },
});

export const {
    setFormData,
    resetFormState,
    setSelectedAirline,
    setProvBooking,
    addPassengersData,
    addCustomerInfo,
    setOfferId,
    setconversationId,
    setProvBookingDetails,
    setProvBookingJourney,
    setAirlineData,
    setProvBookingSuccess,
    setPaymentSuccessResponse,
    setAncillariesSearch,
    setAncillariesConversationId,
    setSelectedAncillaries,
    setAncillariesOfferId,
    setSearchData,
    setQuickUpdateDate,
    setQuickUpdateTripType,
    resetSelectedAncillaries,
    removeSelectedAncillary,
    setSelectedOrderDetails,
    resetSelectedOrderDetails,
    setfilghtResponse,
    resetFilghtResponse,
} = airlineFormSlice.actions;
export default airlineFormSlice.reducer;
