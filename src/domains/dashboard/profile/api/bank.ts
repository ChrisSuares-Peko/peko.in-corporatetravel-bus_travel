import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    AddBankRequestPayload,
    AddBankResponse,
    BankListResponse,
    DeleteRequestPayload,
    GetOtpPayload,
    UpdateBankRequestPayload,
    updateResponse,
} from '../types';

export const getBanks = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<BankListResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/profile/bank`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const deleteBank = async (payload: DeleteRequestPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/others/profile/bank/${payload.id}`
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const addBank = async (payload: AddBankRequestPayload) => {
    try {
        const { credentialId } = payload;
        delete payload.credentialId;
        const resp: SuccessGenericResponse<AddBankResponse> = await ApiClient.post(
            `${payload.userType}/${credentialId}/others/profile/bank`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const updateBank = async (payload: UpdateBankRequestPayload) => {
    try {
        const { credentialId } = payload;
        delete payload.credentialId;
        const resp: SuccessGenericResponse<updateResponse> = await ApiClient.put(
            `${payload.userType}/${credentialId}/others/profile/bank`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getBankOtp = async (payload: GetOtpPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/profile/otp-bank-details`,
            {
                params: {
                    scope: payload.scope,
                    iban: payload.iban,
                    accountNumber: payload.accountNumber,
                    // ...(payload.selectedId && { selectedId: payload.selectedId }),
                    selectedId: payload.selectedId,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
