import { CommonFileBuffer, SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    AccessCodeBulkExcelTemplatePayload,
    AccessCodeBulkExcelTemplateResponse,
    AccessData,
    AccessDataPartial,
    AccessDataResponse,
    BulkAccessCodeUploadPayload,
    BulkAccessCodeUploadResponse,
    activeResponse,
    getData,
} from '../types/accessCode';

export const getAllData = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<AccessDataResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/accessCodes/allAccessCodes`,
            {
                params: {
                    sort: payload.sort,
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                    searchText: payload.searchText,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getFileBufferReport = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/accessCodes/allAccessCodes/${payload.type}`,
            {
                params: {
                    sort: payload.sort,
                    searchText: payload.searchText,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const deleteCode = async (payload: UserPayload & { id: number }) => {
    try {
        const resp: SuccessGenericResponse<activeResponse> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/others/accessCodes/${payload.id}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const createAccessCode = async ({
    userId,
    userType,
    ...payload
}: UserPayload & AccessDataPartial) => {
    try {
        delete payload.id;
        const resp: SuccessGenericResponse<AccessData> = await ApiClient.post(
            `${userType}/${userId}/others/accessCodes`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const updateAccessCode = async ({
    userId,
    userType,
    ...payload
}: UserPayload & AccessDataPartial) => {
    try {
        const updateId = payload.id;
        delete payload.id;
        const resp: SuccessGenericResponse<AccessData> = await ApiClient.put(
            `${userType}/${userId}/others/accessCodes/${updateId}`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const AccessCodeBulkExcelTemplateApi = async (
    payload: AccessCodeBulkExcelTemplatePayload
) => {
    try {
        const resp: SuccessGenericResponse<AccessCodeBulkExcelTemplateResponse> =
            await ApiClient.get(
                `${payload.userType}/${payload.userId}/others/accessCodes/bulkUpload/template`
            );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const BulkAccessCodeExcelUploadApi = async (payload: BulkAccessCodeUploadPayload) => {
    try {
        // Create FormData object
        const formData = new FormData();
        formData.append('file', payload.file, payload.file.name);
        const resp: SuccessGenericResponse<BulkAccessCodeUploadResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/others/accessCodes/bulkUpload`,
            formData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
