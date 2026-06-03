import { SuccessGenericResponse } from '@customtypes/general';
import { HotelBookingResponse } from '@domains/dashboard/Hotels/types/bookingTypes';
import {
    HotelCancellationPolicy,
    cancellationPolicyResponse,
    otpPayload,
    paymentRequest,
} from '@domains/dashboard/Hotels/types/cancellationTypes';
import { HotelSearch, getSearchDetailsPayload } from '@domains/dashboard/Hotels/types/hotelTypes';
import { bookingData } from '@domains/dashboard/Hotels/types/managebookingTypes';
import { ApiClient } from '@src/services/config';

import {
    CityData,
    bookings,
    cancelBooking,
    cancellation,
    cancellationData,
    countrySearchPayload,
    getSearchListPayload,
    prebookHotelsResponse,
    searchList,
    ticket,
} from '../types/types';

export const getHotels = async (payload: getSearchListPayload) => {
    try {
        const resp: SuccessGenericResponse<searchList> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/hotels/searchHotels`,
            payload
        );

        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};

export const fetchCityData = async (payload: countrySearchPayload) => {
    try {
        const resp: SuccessGenericResponse<CityData> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/hotels/cityName?searchText=${payload.searchText}`
        );

        const { data } = resp;
        return data;
    } catch (error) {
        return false;
    }
};

export const fetchCountryData = async (payload: countrySearchPayload) => {
    try {
        const resp: SuccessGenericResponse<CityData> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/hotels/countries?searchText=${payload.searchText}`
        );

        const { data } = resp;
        return data;
    } catch (error) {
        return false;
    }
};

// export const fetchBookings = async(payload)
export const hotelAndRoomDetails = async (payload: getSearchDetailsPayload) => {
    try {
        const resp: SuccessGenericResponse<HotelSearch> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/hotels/hotelAndRoomDetails`,
            payload
        );

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const prebookHotel = async (payload: prebookHotelsResponse) => {
    try {
        const resp: SuccessGenericResponse<HotelBookingResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/hotels/preBook`,
            payload
        );

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const allBookings = async (payload: bookings) => {
    try {
        const resp: SuccessGenericResponse<bookingData> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/hotels/list-all-bookings`,
            {
                params: {
                    from: '',
                    to: '',
                    searchText: '',
                    sort: '',
                    page: payload.currentPage,
                    filter: '',
                    itemsPerPage: 4,
                },
            }
        );

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const cancellationCharge = async (payload: cancellation) => {
    try {
        const resp: SuccessGenericResponse<cancellationData> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/hotels/cancellation-charge`,
            payload
        );

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const cancelbookings = async (payload: cancelBooking) => {
    try {
        const resp = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/hotels/hotel-cancel`,
            payload
        );

        // const { data } = resp;
        return resp;
    } catch (err) {
        return false;
    }
};
export const getotp = async (payload: otpPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/hotels/hotel-cancel/get-otp`,
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

export const cancellationPolicy = async (payload: cancellationPolicyResponse) => {
    try {
        const resp: SuccessGenericResponse<HotelCancellationPolicy> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/travel/hotels/cancellationPolicy`,
            payload
        );

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const bookRoom = async (payload: paymentRequest) => {
    const resp: SuccessGenericResponse<any> = await ApiClient.post(
        `${payload.userType}/${payload.userId}/travel/hotels/book`,
        payload
    );

    const { data } = resp;
    return data;
};

export const downloadTicket = async (payload: ticket) => {
    try {
        const resp = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/hotels/download-bookingTicket?orderId=${payload.orderId}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
