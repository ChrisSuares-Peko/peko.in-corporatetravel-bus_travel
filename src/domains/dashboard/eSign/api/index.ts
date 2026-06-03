import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    eSignResponse,
    OrderDetailsApiPayload,
    OrderDetailsApiResponse,
    OrderHistoryApiPayload,
    OrderHistoryApiResponse,
    resendInvitationApiPayload,
    resendInvitationApiResponse,
    signRequestApiPayload,
    signRequestApiResponse,
} from '../types';

export const OrderHistoryApi = async (payload: UserPayload & OrderHistoryApiPayload) => {
    try {
        const resp: SuccessGenericResponse<OrderHistoryApiResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/officeAndBusiness/e-sign/find-all`,
            {
                params: {
                    searchText: payload.searchText,
                    page: payload.page,
                    pageSize: payload.pageSize,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const OrderDetailsApi = async (payload: UserPayload & OrderDetailsApiPayload) => {
    try {
        const resp: SuccessGenericResponse<OrderDetailsApiResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/officeAndBusiness/e-sign/find`,
            {
                params: {
                    id: payload.id,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const signRequestApi = async ({
    userType,
    userId,
    ...restPayload
}: UserPayload & signRequestApiPayload) => {
    try {
        const resp: SuccessGenericResponse<signRequestApiResponse> = await ApiClient.post(
            `${userType}/${userId}/officeAndBusiness/e-sign/sign-request`,
            restPayload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const resendInvitationApi = async ({
    userType,
    userId,
    id,
    signer_id,
    ...restPayload
}: UserPayload & resendInvitationApiPayload) => {
    try {
        const resp: SuccessGenericResponse<resendInvitationApiResponse> = await ApiClient.post(
            `${userType}/${userId}/officeAndBusiness/e-sign/resend-invitation?id=${id}&signer_id=${signer_id}`,
            restPayload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getESignCount = async ({ userType, userId }: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<eSignResponse> = await ApiClient.get(
            `${userType}/${userId}/officeAndBusiness/e-sign/count`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
