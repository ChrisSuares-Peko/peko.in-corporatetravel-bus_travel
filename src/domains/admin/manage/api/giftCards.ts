import { CommonFileBuffer, SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { getOperators } from '../../settings/types/serviceOperator';
import {
    ApiResponseGiftCards,
    GiftCardsBody,
    GiftCardsWithoutID,
    IAutoUpdateResponse,
    IAutoUpdateStatusResponse,
    IVendorsListingResponse,
    autoUpdatePayload,
    updateGiftCardsStatusPayload,
} from '../types/giftCards';

export const getGiftCardsData = async (payload: UserPayload & getOperators) => {
    try {
        const resp: SuccessGenericResponse<ApiResponseGiftCards> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/giftCards/giftCards`,
            {
                params: {
                    page: payload.page,
                    searchText: payload.searchText,
                    itemsPerPage: payload.itemsPerPage,
                    sort: payload.sort,
                    sortField: payload.sortField,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getFileBufferReport = async (payload: UserPayload & getOperators) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/giftCards/giftCards/${payload.type}`,
            {
                params: {
                    searchText: payload.searchText,
                    sort: payload.sort,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const updateGiftCardsStatus = async ({
    giftCardId,
    userId,
    userType,
    ...payload
}: UserPayload & updateGiftCardsStatusPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.patch(
            `${userType}/${userId}/purchase/giftCards/${giftCardId}`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const putUpdateGiftCards = async ({
    userId,
    userType,
    id,
    ...payload
}: UserPayload & GiftCardsBody) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.put(
            `${userType}/${userId}/purchase/giftCards/${id}`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const createGiftCards = async ({
    userId,
    userType,
    ...payload
}: UserPayload & GiftCardsWithoutID) => {
    try {
        delete payload.id;
        const resp: SuccessGenericResponse<GiftCardsBody> = await ApiClient.post(
            `${userType}/${userId}/purchase/giftCards`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const vendorsListing = async (payload: UserPayload) => {
    try {
        const res: SuccessGenericResponse<IVendorsListingResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/giftCards/serviceOperator`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const autoUpdate = async (payload: UserPayload & autoUpdatePayload) => {
    try {
        const res: SuccessGenericResponse<IAutoUpdateResponse> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/purchase/giftCards/auto?serviceOperatorId=${payload.serviceOperatorId}`,
            { status: true }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const autoUpdateStatus = async (payload: UserPayload & autoUpdatePayload) => {
    try {
        const res: SuccessGenericResponse<IAutoUpdateStatusResponse> = await ApiClient.patch(
            `${payload.userType}/${payload.userId}/purchase/giftCards/update-gift-cards?serviceOperatorId=${payload.serviceOperatorId}`,
            payload
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
export const getOtp = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/giftCards/get-otp-update?scope=email`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
