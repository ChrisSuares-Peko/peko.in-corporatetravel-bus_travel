import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { getESR, activeResponse, EsrRecord, Stage, ESRModalData } from '../types/ESR';

// Fetches ESR data
export const getAllData = async (payload: UserPayload & getESR) => {
    try {
        const response: SuccessGenericResponse<EsrRecord> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/esr/`,
            {
                params: {
                    // Include any query params if necessary
                    sort: payload.sort,
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                    searchText: payload.searchText,
                    sortField: payload.sortField,
                },
            }
        );

        // return response.data;
        const { data } = response;

        return data;
    } catch (err) {
        console.error('Error fetching ESR data:', err);
        return false;
    }
};

// Updates the status of a specific ESR record
export const updateData = async ({ userId, userType, ...payload }: UserPayload & ESRModalData) => {
    try {
        const { stageId, ...rest } = payload;
        const response: SuccessGenericResponse<activeResponse> = await ApiClient.patch(
            `${userType}/${userId}/esr/update/${stageId}`,
            rest
        );

        return response.data;
    } catch (err) {
        console.error('Error updating ESR status:', err);
        return false;
    }
};
export const getStageDetails = async (payload: UserPayload & { id: string; stageId: string }) => {
    try {
        const resp: SuccessGenericResponse<Stage> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/esr/getStageById?id=${payload.id}&stageId=${payload.stageId}`
        );
        const { data } = resp;
        console.log('🚀 ~ getStageDetails ~ data:', data);
        return data;
    } catch (err) {
        return false;
    }
};
