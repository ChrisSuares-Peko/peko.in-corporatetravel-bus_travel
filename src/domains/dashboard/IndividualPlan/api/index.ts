import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { ISubscriptionDetailsPayload, SubscriptionDetailsResponse } from '../types';

export const getPurchaseDetailsApi = async ({
    accessKey,
    packageName,
}: ISubscriptionDetailsPayload) => {
    try {
        const params = {
            accessKey,
            packageName,
        };
        const res: SuccessGenericResponse<SubscriptionDetailsResponse> = await ApiClient.get(
            `/user/subscription/individual-details`,
            { params }
        );
        const { data } = res;
        return data;
    } catch (err) {
        return false;
    }
};
