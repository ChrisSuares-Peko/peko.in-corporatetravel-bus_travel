import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { darbPayload } from '../types/darb';

export const getBalanceApi = async (payload: darbPayload) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/darb/balance?accountNo=${payload.trafficNo}&flexiKey=${payload.flexiKey}&typeKey=3&optional=${payload.eid}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
