import { CommonFileBuffer, SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { UserPayload } from '../../accounts/types/SelfTransferTypes';
import {
    CorporateListResponse,
    NotificationData,
    NotificationDataWithoutId,
    NotificationId,
    NotificationsResponse,
    filterState,
} from '../types';

export const notificationListing = async ({
    userId,
    userType,
    ...payload
}: UserPayload & filterState) => {
    try {
        const res: SuccessGenericResponse<NotificationsResponse> = await ApiClient.get(
            `${userType}/${userId}/others/notifications/all`,
            {
                params: {
                    from: payload.from,
                    to: payload.to,
                    page: payload.page,
                    searchText: payload.search,
                    itemsPerPage: payload.itemsPerPage,
                    sort: payload.sort,
                    sortField: payload.sortField,
                },
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const getFileBufferReport = async (payload: UserPayload & any) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/notifications/${payload.type}`,
            {
                params: {
                    from: payload.from,
                    to: payload.to,
                    searchText: payload.search,
                    sort: payload.sort,
                    sortField: payload.sortField,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const putUpdateNotification = async ({
    userId,
    userType,
    id,
    ...payload
}: UserPayload & NotificationData) => {
    try {
        const resp: SuccessGenericResponse<NotificationData> = await ApiClient.put(
            `${userType}/${userId}/others/notifications/${id}`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const createNotification = async ({
    userType,
    userId,
    ...payload
}: UserPayload & NotificationDataWithoutId) => {
    try {
        const resp: SuccessGenericResponse<NotificationData> = await ApiClient.post(
            `${userType}/${userId}/others/notifications`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const deleteNotification = async (payload: UserPayload & NotificationId) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/others/notifications/${payload.id}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getAllCorporates = async ({ userType, userId, searchText }: any) => {
    try {
        const res: SuccessGenericResponse<CorporateListResponse> = await ApiClient.get(
            `${userType}/${userId}/others/transferFunds/corporate-users?searchText=${searchText}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
