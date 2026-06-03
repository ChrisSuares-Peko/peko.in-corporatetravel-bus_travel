import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    FetchBillApiResponse,
    GetLimitResponse,
    FetchBillApiPayload,
    FetchLimitPayload,
} from '../types';

export const getLimit = async (payload: FetchLimitPayload) => {
    try {
        const resp: SuccessGenericResponse<GetLimitResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/${payload.path}/limits`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getBillDetails = async (payload: FetchBillApiPayload) => {
    try {
        const resp: SuccessGenericResponse<FetchBillApiResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/${payload.path}/balance`,
            {
                params: {
                    accountNo: payload.accountNo,
                    flexiKey: payload.flexiKey,
                    typeKey: payload.typeKey,
                    amount: payload.amount,
                    pin: payload.accountPin,
                    type: payload.type,
                    optional: payload?.optional,
                },
            }
        );
        return resp;
    } catch (err) {
        return false;
    }
};
