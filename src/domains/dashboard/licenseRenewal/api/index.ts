import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    GetLimitResponse,
    FetchBillApiPayload,
    FetchBillApiResponse,
    PaymentRequestPayload,
    PaymentResponse,
    CommonPayload,
} from '../types';

export const getLimit = async (payload: CommonPayload) => {
    try {
        const resp: SuccessGenericResponse<GetLimitResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/licenseRenewal/limits`
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const getBillDetails = async (payload: FetchBillApiPayload) => {
    try {
        const resp: SuccessGenericResponse<FetchBillApiResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/licenseRenewal/balance`,
            {
                params: {
                    accountNo: payload.voucherId,
                    flexiKey: payload.flexiKey,
                    typeKey: payload.typeKey,
                },
            }
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const paymentRequest = async (payload: PaymentRequestPayload) => {
    try {
        const resp: SuccessGenericResponse<PaymentResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/payment/licenseRenewal/payment`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};
