import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { dubaiPoliceBalancePayload, ListingData } from '../types/dubaiPolice';

export const getBalanceApi = async (payload: dubaiPoliceBalancePayload) => {
    try {
        const postData = {
            optionals: payload.optional,
        };
        const resp: SuccessGenericResponse<any> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/payment/dubaipolice/balance?accountNo=${payload.accountNo}&flexiKey=${payload.flexiKey}&typeKey=1`,
            postData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getListingDataApi = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<ListingData> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/dubaipolice/mappings`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
