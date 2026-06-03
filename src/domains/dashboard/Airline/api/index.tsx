import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { IFlightSearchResponse } from '../types/airlineList';
import { AncillarySearch } from '../types/ancilaryType';
import { AncProvBookSuccessResponse } from '../types/ancProvBookSuccess';
import {
    DownloadTicketPayload,
    GetBookingDetailsPayload,
    GetBookingsListPayload,
    IAncCancellationPayload,
    IAncProvBookPayload,
    IAncSearchPayload,
    otpPayload,
    SearchAirportPayload,
} from '../types/apiPayloadTypes';
import { IBookingRes, BookingDetailsRes } from '../types/manageBookings';
import { ProvBookingSuccess } from '../types/provBooking';
import { AirportSearchResult } from '../types/searchAirports';

export const getOneWaySearch = async (payload: any) => {
    try {
        const reqData = payload.tripDetails;
        const res: SuccessGenericResponse<IFlightSearchResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/flight/searchTicket`,
            reqData
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const getSearchAirport = async (payload: SearchAirportPayload) => {
    try {
        const res: SuccessGenericResponse<AirportSearchResult> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/flight/airports?q=${payload.loc}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const getBookingsList = async (payload: GetBookingsListPayload) => {
    try {
        const res: SuccessGenericResponse<IBookingRes> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/flight/list-all-bookings?page=${payload.page}&limit=10&availability=${payload.availability}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const getBookingDetailsApi = async (payload: GetBookingDetailsPayload) => {
    try {
        const res: SuccessGenericResponse<BookingDetailsRes> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/flight/booking-details?corporateTxnId=${payload?.corporateTxnId}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const getDownloadTicket = async (payload: DownloadTicketPayload) => {
    try {
        const res: SuccessGenericResponse<any> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/flight/download-bookingTicket?orderId=${payload.orderId}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
export const cancellationChargesApi = async (payload: any) => {
    try {
        const res: SuccessGenericResponse<any> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/flight/cancellation-charge`,
            { corporateTxnId: payload.corporateTxnId }
        );
        return res;
    } catch (error) {
        return false;
    }
};
export const getCancelBooking = async (payload: IAncCancellationPayload) => {
    try {
        const { postData } = payload;
        const res: SuccessGenericResponse<any> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/flight/cancel`,
            postData
        );
        return res;
    } catch (error) {
        return false;
    }
};

export const updateBooking = async (payload: DownloadTicketPayload) => {
    try {
        const res: SuccessGenericResponse<any> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/flight/update-status?bookingId=${payload.orderId}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const getProvBooking = async (payload: any) => {
    try {
        const postData = payload.bookingData;
        const res: SuccessGenericResponse<ProvBookingSuccess> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/flight/provBook`,
            postData
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const airlinePaymentsApi = async (payload: any) => {
    try {
        const postData = payload.paymentRequestData;
        const resp: SuccessGenericResponse<any> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/flight/payment`,
            postData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return err.response.data.data;
    }
};

export const ancillariesSearchAPI = async (payload: IAncSearchPayload) => {
    try {
        const { postData } = payload;

        const resp: SuccessGenericResponse<AncillarySearch> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/flight/ancSearch`,
            postData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return err.response.data.data;
    }
};

export const ancillariesProvBookingAPI = async (payload: IAncProvBookPayload) => {
    try {
        const { postData } = payload;

        const resp: SuccessGenericResponse<AncProvBookSuccessResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/flight/ancProBook`,
            postData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return err.response.data.data;
    }
};

export const getCountriesAPI = async () => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(`user/general/country-codes`);
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getCountriesPhoneCodeAPI = async () => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(`user/general/phone-codes`);
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getFareRulesAPI = async (payload: any) => {
    try {
        const { postData } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/flight/farerules`,
            postData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getotp = async (payload: otpPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/flight/cancel/get-otp`,
            {
                params: {
                    scope: payload.scope,
                },
            }
        );

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
