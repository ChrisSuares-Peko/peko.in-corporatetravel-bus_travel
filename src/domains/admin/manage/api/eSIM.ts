import { CommonFileBuffer, SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { getOperators } from '../../settings/types/serviceOperator';
import { ApiResponseEsimPlans, EsimPlan, country, updateStatus } from '../types/eSIM';

export const getEsimPlansData = async (payload: UserPayload & getOperators) => {
    try {
        const resp: SuccessGenericResponse<ApiResponseEsimPlans> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/esim`,
            {
                params: {
                    page: payload.page,
                    searchText: payload.searchText,
                    itemsPerPage: payload.itemsPerPage,
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

export const putUpdateEsimPlan = async (payload: UserPayload & EsimPlan) => {
    try {
        const { id } = payload;
        delete payload.id;
        const resp: SuccessGenericResponse<{}> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/purchase/esim/${id}`,
            payload
        );
        return resp?.status;
    } catch (err) {
        return false;
    }
};

export const createEsimPlan = async ({ userId, userType, ...payload }: UserPayload & EsimPlan) => {
    try {
        delete payload.id;
        const resp: SuccessGenericResponse<{}> = await ApiClient.post(
            `${userType}/${userId}/purchase/esim`,
            payload
        );
        const { data } = resp;
        // return data;
        return resp?.status;
    } catch (err) {
        return false;
    }
};

export const updateEsimPlanStatus = async (payload: UserPayload & updateStatus) => {
    try {
        const { id } = payload;
        delete payload.id;
        const resp: SuccessGenericResponse<ApiResponseEsimPlans> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/purchase/esim/status/${id}`,
            payload
        );
        return resp?.status;
    } catch (err) {
        return false;
    }
};

export const getCountriesApi = async (payload: UserPayload & { searchText: string }) => {
    try {
        const resp: SuccessGenericResponse<country[]> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/esim/coveragepprofiles?search=${payload.searchText}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

//
export const deleteConnect = async (payload: UserPayload & getOperators) => {
    try {
        const resp: SuccessGenericResponse<ApiResponseEsimPlans> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/esim`,
            {
                params: {
                    page: payload.page,
                    searchText: payload.searchText,
                    itemsPerPage: payload.itemsPerPage,
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

export const getFileBufferReport = async (payload: UserPayload & getOperators) => {
    try {
        console.log(payload.type);
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/esim/download/${payload.type}`,
            {
                params: {
                    page: payload.page,
                    searchText: payload.searchText,
                    itemsPerPage: payload.itemsPerPage,
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
