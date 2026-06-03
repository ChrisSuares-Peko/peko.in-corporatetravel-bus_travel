import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { BulkDataRespone, getData, payloadData } from '../types/bulkRefund';

export const getAllData = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<BulkDataRespone> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/bulk-refund/transactions`,
            {
                params: {
                    searchText: payload.searchText,
                    endDate: payload.to,
                    fromStart: payload.from,
                    corporateId: payload.corporateId,
                    serviceAccessKey: payload.category,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const getOtpData = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<BulkDataRespone> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/bulk-refund/get-otp?scope=email`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const sentBulkData = async (payload: UserPayload & payloadData) => {
    try {
        const resp: SuccessGenericResponse<BulkDataRespone> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/payment/bulk-refund`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
