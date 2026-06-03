import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { bulkBalancePayload, bulkBalanceResponse } from '../types/bulkPayment';

export const getBulkBalance = async (payload: bulkBalancePayload) => {
    try {
        const resp: SuccessGenericResponse<bulkBalanceResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/bulk-payment/balance/bulk`,
            {
                params: {
                    beneficiariesId: payload.beneficiariesId,
                    flexiKey: payload.flexiKey,
                    typeKey: payload.typeKey,
                    accessKey: payload.accessKey,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
