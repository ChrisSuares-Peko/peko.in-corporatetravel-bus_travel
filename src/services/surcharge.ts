import { SuccessGenericResponse, SurchargeResponse, UserPayload } from '@customtypes/general';

import { ApiClient } from './config';

export const getSurcharge = async (
    payload: UserPayload & { amount: number; accessKey: string; quantity?: number }
) => {
    try {
        const resp: SuccessGenericResponse<SurchargeResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/paymentGateway/surcharge`,
            {
                params: {
                    accessKey: payload.accessKey,
                    amount: payload.amount,
                    quantity: payload?.quantity,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
