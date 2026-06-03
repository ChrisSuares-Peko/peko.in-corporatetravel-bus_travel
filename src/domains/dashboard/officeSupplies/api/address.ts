import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { SavedAddressPayload, SavedAddressResponse } from '../types/address';

export const getSavedAddressApi = async (payload: SavedAddressPayload) => {
    try {
        const { userId, userType } = payload;
        const resp: SuccessGenericResponse<SavedAddressResponse> = await ApiClient.get(
            `${userType}/${userId}/others/profile/addressDetails`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
