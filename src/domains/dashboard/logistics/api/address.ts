import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { SaveAddressPayload, SavedAddressPayload, SavedAddressResponse } from '../types/address';

export const getSavedAddressApi = async ({ isReceiver, userId, userType }: SavedAddressPayload) => {
    try {
        const resp: SuccessGenericResponse<SavedAddressResponse> = await ApiClient.get(
            `${userType}/${userId}/travel/logistics/fetchAddresses?isReceiver=${isReceiver}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const saveAddressApi = async ({ userType, userId, ...body }: SaveAddressPayload) => {
    try {
        const res: SuccessGenericResponse<SaveAddressPayload> = await ApiClient.post(
            `${userType}/${userId}/travel/logistics/addAddress`,
            body
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
