import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { employeeResponse } from '../types/employee';
import {
    GetGiftcardListPayload,
    giftCardDetailPayload,
    GiftcardListResponse,
    GiftCardDetailResponse,
    walletPayload,
    SurchargeResponse,
    PaymentPayload,
    OrderHistoryTablePayload,
    OrderHistoryListResponse,
    UserDetailsPayload,
    userDetailsResponse,
} from '../types/types';

export const getAllGiftcards = async (payload: GetGiftcardListPayload) => {
    try {
        const userType = encodeURIComponent(payload.userType); // Encode user type to handle special characters
        const userId = encodeURIComponent(payload.userId.toString()); // Encode user ID to handle special characters and ensure it's a string
        const accessKeys = encodeURIComponent('["quickcilver","youGotAGift"]');
        const offset = (payload.page - 1) * payload.limit;

        const url = `${userType}/${userId}/purchase/giftcards/all?accessKeys=${accessKeys}&page=${payload.page} &offset=${offset}&limit=${payload.limit}&sortBy=${payload.category}&searchValue=${payload.searchText} `;

        const resp: SuccessGenericResponse<GiftcardListResponse> = await ApiClient.get(url);

        // Check if the response contains data
        if (resp.data && resp.data.rows) {
            // console.log('Number of items returned:', resp.data.rows.length); // Log the number of items returned
        }
        return resp.data;
    } catch (error) {
        // console.error('Error fetching gift cards ', error);
        return false;
    }
};

export const getGiftDetails = async (payload: giftCardDetailPayload) => {
    try {
        const resp: SuccessGenericResponse<GiftCardDetailResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/giftCards/${payload.cardID}`
        );
        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};

export const getSurcharge = async (payload: walletPayload) => {
    try {
        const resp: SuccessGenericResponse<SurchargeResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/paymentGateway/surcharge?accessKey='gift_cards_combined`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getOrderHistoryTable = async (payload: OrderHistoryTablePayload) => {
    try {
        const resp: SuccessGenericResponse<OrderHistoryListResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/giftCards/transactions?sort=DESC`,
            {
                params: {
                    searchText: payload.search,
                    page: payload.start,
                    itemsPerPage: payload.length,
                },
            }
        );
        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};

export const makePayment = async (payload: PaymentPayload): Promise<boolean> => {
    try {
        const resp: SuccessGenericResponse<boolean> = await ApiClient.post(
            `${payload.userType}/${payload.credentialId}/purchase/giftCards/payment`,
            payload
        );
        const { status } = resp;

        return status;
    } catch (err) {
        return false;
    }
};

export const getUserDetails = async (payload: UserDetailsPayload) => {
    try {
        const resp: SuccessGenericResponse<userDetailsResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/subscriptionPayments/corporateDetails`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getEmployees = async (payload: UserDetailsPayload) => {
    try {
        const resp: SuccessGenericResponse<employeeResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/employee/current-employees?searchText=`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
