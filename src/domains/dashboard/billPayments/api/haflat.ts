import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { hafilatPayload } from '../types/haflat';

export const getBalanceApi = async (payload: hafilatPayload) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/hafilat/balance?accountNo=${payload.trafficNo}&flexiKey=${payload.flexiKey}&typeKey=3`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
