import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { getHike, HikeData, HikePayload } from '../types/hike';

export const getAllHikeData = async (payload: UserPayload & getHike) => {
    try {
        const resp: SuccessGenericResponse<HikeData> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/hike`,
            {
                params: {
                    sort: payload.sort,
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                    searchText: payload.searchText,
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

export const createHike = async ({ userId, userType, ...payload }: UserPayload & HikePayload) => {
    try {
        delete payload.id;
        delete payload.imageFormat;
        const resp: SuccessGenericResponse<any> = await ApiClient.post(
            `${userType}/${userId}/purchase/hike`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const updateHike = async ({ userId, userType, ...payload }: UserPayload & HikePayload) => {
    try {
        const { id } = payload;
        delete payload.id;
        const resp: any = await ApiClient.put(`${userType}/${userId}/purchase/hike/${id}`, payload);
        return resp;
    } catch (err) {
        return false;
    }
};
