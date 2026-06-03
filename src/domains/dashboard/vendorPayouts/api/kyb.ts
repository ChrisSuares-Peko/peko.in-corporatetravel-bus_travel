import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    KybDetailsPayload,
    KybDetailsResponse,
    KybDetailsUpdatePayload,
    SubmittedKYBDetailsResponse,
    userPayload,
} from '../types/kyb';

export const submitKYBDetails = async ({ userType, userId, ...payload }: KybDetailsPayload) => {
    try {
        const res: SuccessGenericResponse<KybDetailsResponse> = await ApiClient.post(
            `${userType}/${userId}/payment/vendorPayout/kybDetails`,
            payload
        );

        return res;
    } catch (error) {
        return false;
    }
};
export const updateKybDetails = async ({
    userType,
    userId,
    kybId,
    ...payload
}: KybDetailsUpdatePayload) => {
    try {
        const res: any = await ApiClient.put(
            `${userType}/${userId}/payment/vendorPayout/kybDetails/${kybId}`,
            payload
        );

        return res;
    } catch (err) {
        return false;
    }
};
export const GetKybDetails = async (payload: userPayload) => {
    try {
        const res: SuccessGenericResponse<SubmittedKYBDetailsResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/vendorPayout/kybDetails`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
