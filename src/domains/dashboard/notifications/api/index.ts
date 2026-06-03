import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { NotificationsResponse } from '../types';

export const notificationListing = async ({
    userId,
    userType,
    page,
    fromDate,
    toDate,
    search,
}: any) => {
    try {
        const res: SuccessGenericResponse<NotificationsResponse> = await ApiClient.get(
            `${userType}/${userId}/others/notification/all-notifications`,
            {
                params: {
                    fromDate,
                    toDate,
                    search,
                    page,
                    pageSize: 10,
                },
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
