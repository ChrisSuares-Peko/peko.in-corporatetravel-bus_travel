import { CommonFileBuffer, SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    ReferalResponse,
    getData,
    updateStatus,
    activeResponse,
    newReferal,
    Referral,
} from '../types/refferalCode';

export const getAllData = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<ReferalResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/referralCodes/all`,
            {
                params: {
                    sort: payload.sort,
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                    searchText: payload.searchText,
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

export const getFileBufferReport = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/referralCodes/${payload.type}`,
            {
                params: {
                    sort: payload.sort,
                    searchText: payload.searchText,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const updateCurrentStatus = async ({
    userId,
    userType,
    ...payload
}: UserPayload & updateStatus) => {
    try {
        const { referalId } = payload;
        delete payload.referalId;
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.put(
            `${userType}/${userId}/others/referralCodes/updateStatus/${referalId}`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const deleteCode = async (payload: UserPayload & { id: number }) => {
    try {
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/others/referralCodes/${payload.id}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const createReferal = async (payload: UserPayload & newReferal) => {
    try {
        delete payload.id;
        const resp: SuccessGenericResponse<Referral> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/others/referralCodes`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const updatereferal = async ({ userId, userType, ...payload }: UserPayload & newReferal) => {
    try {
        const { id } = payload;
        delete payload.id;
        const resp: SuccessGenericResponse<Referral> = await ApiClient.put(
            `${userType}/${userId}/others/referralCodes/${id}`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
