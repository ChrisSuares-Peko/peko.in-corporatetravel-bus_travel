import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    CompanyInfoResponse,
    UpdateBasicInfoResponse,
    UpdateCompanyInfoRequestPayload,
} from '../types';

export const getCompanyInfo = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<CompanyInfoResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/profile/company`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const updateCompanyInfo = async (payload: UpdateCompanyInfoRequestPayload) => {
    try {
        if (!payload.trnExpiry) {
            delete payload.trnExpiry;
        }
        if (!payload.tradeLicenseExpiry) {
            delete payload.tradeLicenseExpiry;
        }
        const resp: SuccessGenericResponse<UpdateBasicInfoResponse> = await ApiClient.patch(
            `${payload.userType}/${payload.userId}/others/profile`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
