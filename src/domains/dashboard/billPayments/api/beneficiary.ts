import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    CommonPayload,
    GetAllBeneficiariesPayload,
    AllBeneficiariesResponse,
    addEditBeneficiaryPayload,
    deleteBeneficicaryPayload,
    SendOtpPayload,
    updateBeneficiaryStatusPayload,
} from '../types';

export const getLastFiveBeneficiaries = async (payload: CommonPayload) => {
    try {
        const resp: SuccessGenericResponse<AllBeneficiariesResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/beneficiary/latestBeneficiaries`
        );
        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};

export const getAllBeneficiaries = async (payload: GetAllBeneficiariesPayload) => {
    try {
        const resp: SuccessGenericResponse<AllBeneficiariesResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/beneficiary/fetchBeneficiary`,
            {
                params: {
                    accessKey: payload.accesskey,
                },
            }
        );
        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};

export const getBeneficiaryOtp = async (payload: SendOtpPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/others/beneficiary/otp`,
            {
                scope: 'email',
                type: payload.beneficiaryActionType,
                accountNo: payload.accountNo,
                accessKey: payload.accessKey,
                beneficiaryId: payload.beneficiaryId,
            }
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const AddBeneficiaryApi = async (payload: addEditBeneficiaryPayload) => {
    try {
        const resp: SuccessGenericResponse<AllBeneficiariesResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/others/beneficiary`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const updateBeneficiaryApi = async (payload: addEditBeneficiaryPayload) => {
    try {
        const resp: SuccessGenericResponse<AllBeneficiariesResponse> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/others/beneficiary/${payload.id}`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};

export const deleteBeneficiaryApi = async (payload: deleteBeneficicaryPayload) => {
    try {
        const resp: SuccessGenericResponse<AllBeneficiariesResponse> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/others/beneficiary/${payload.id}?scope=${payload.scope}&otp=${payload.otp}`
        );
        return resp;
    } catch (err) {
        return false;
    }
};
export const updateBeneficiaryStatusApi = async ({
    userId,
    userType,
    id,
    ...payload
}: updateBeneficiaryStatusPayload) => {
    try {
        const resp: SuccessGenericResponse<AllBeneficiariesResponse> = await ApiClient.put(
            `${userType}/${userId}/others/beneficiary/updateStatus/${id}`,
            payload
        );
        return resp;
    } catch (err) {
        return false;
    }
};
