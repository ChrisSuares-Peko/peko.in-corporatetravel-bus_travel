import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    AddAddressRequestPayload,
    AddAddressResponse,
    AddressListResponse,
    DeleteRequestPayload,
    updateAddressRequestPayload,
    updateResponse,
} from '../types';

export const getAddresses = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<AddressListResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/profile/addressDetails`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const addAddress = async (payload: AddAddressRequestPayload) => {
    try {
        const { credentialId } = payload;
        delete payload.credentialId;
        const resp: SuccessGenericResponse<AddAddressResponse> = await ApiClient.post(
            `${payload.userType}/${credentialId}/others/profile/address`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const deleteAddress = async (payload: DeleteRequestPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/others/profile/address/${payload.id}`,
            {
                params: {
                    scope: payload.scope,
                    otp: payload.otp,
                },
            }
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const updateAddress = async (payload: updateAddressRequestPayload) => {
    try {
        const { credentialId } = payload;
        delete payload.credentialId;
        const resp: SuccessGenericResponse<updateResponse> = await ApiClient.put(
            `${payload.userType}/${credentialId}/others/profile/address`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getAddressOtp = async (
    payload: UserPayload & { scope: string; method?: string; selectedId?: number | string }
) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/profile/address-otp`,
            {
                params: {
                    scope: payload.scope,
                    method: payload.method,
                    id: payload.selectedId,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
