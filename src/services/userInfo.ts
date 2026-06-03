import {
    PurchasedListResponse,
    ServicesListResponse,
    SuccessGenericResponse,
    UserInfoResponse,
    UserPayload,
} from '@customtypes/general';

import { ApiClient } from './config';

export const getUserInfo = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<UserInfoResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/profile/walletDetails`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getUserServices = async () => {
    try {
        const resp: SuccessGenericResponse<ServicesListResponse & PurchasedListResponse> =
            await ApiClient.get(`user/services/serviceAccess`);
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
