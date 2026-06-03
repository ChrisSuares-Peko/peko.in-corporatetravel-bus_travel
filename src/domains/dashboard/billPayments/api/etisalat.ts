import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { UserPayload } from '../../accounting/types/types';
import { GetLimitResponse } from '../types';
import {
    SendBulkOtpPayload,
    BulkExcelTemplateResponse,
    BulkUploadResponse,
} from '../types/etisalat';

export const BulkExcelTemplateApi = async (payload: any) => {
    try {
        const resp: SuccessGenericResponse<BulkExcelTemplateResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/beneficiary/bulk-template?accessKey=${payload?.accessKey}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const BulkExcelUploadApi = async (
    payload: UserPayload & { file: File; accessKey: string; flexiKey: any; typeKey: any }
) => {
    try {
        const formData = new FormData();
        formData.append('file', payload.file, payload.file.name);
        formData.append('accessKey', payload.accessKey);
        formData.append('flexiKey', payload.flexiKey);
        formData.append('typeKey', payload.typeKey);
        const resp: SuccessGenericResponse<BulkUploadResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/others/beneficiary/bulk-excel-upload`,
            formData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const BulkCreateApi = async (payload: any) => {
    try {
        const resp: SuccessGenericResponse<BulkUploadResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/others/beneficiary/bulk-create`,
            {
                jsonData: payload.jsonData,
                otp: payload.otp,
            }
        );

        return resp;
    } catch (err) {
        return false;
    }
};

export const BulkValidateApi = async (payload: any, userType: any, limitData: GetLimitResponse) => {
    try {
        const resp: SuccessGenericResponse<BulkUploadResponse> = await ApiClient.post(
            `${userType}/${payload.credentialId}/others/beneficiary/bulk-json-upload`,
            {
                jsonData: [payload],
                accessKey: limitData?.accessKey,
                typeKey: limitData?.typeKey,
                flexiKey: limitData?.flexiKey,
            } // Wrap payload in an array and assign it to jsonData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getBulkBeneficiaryOtp = async (payload: SendBulkOtpPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/beneficiary/get-otp?scope=email`
        );
        return resp;
    } catch (err) {
        return false;
    }
};
