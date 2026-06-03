import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    reimbursementListingPayload,
    reimbursementListingResponse,
    createReimbursementPayload,
    updateReimbursementPayload,
    reimbursementDeletePayload,
    reimbursementDeletedResponse,
    reimbursementAllListingPayload,
    reimbursementAllListingResponse,
} from '../../../types/salaryProfileTypes/ReimbursementTypes';

export const employeeReimbursementDetails = async (payload: reimbursementListingPayload) => {
    try {
        const res: SuccessGenericResponse<reimbursementListingResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/reimbursement/${payload.eId}`,
            {
                params: {
                    page: payload.page,
                    limit: payload.limit,
                    year: payload.year,
                    month: payload.month,
                },
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
export const employeeReimbursementList = async (payload: reimbursementAllListingPayload) => {
    try {
        const res: SuccessGenericResponse<reimbursementAllListingResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payroll/reimbursement`,
            {
                params: {
                    page: payload.page,
                    limit: payload.limit,
                    year: payload.year,
                    month: payload.month,
                    searchText: payload.search,
                },
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
export const createReimbursement = async (payload: createReimbursementPayload) => {
    try {
        const res: SuccessGenericResponse<any> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/payroll/reimbursement/${payload.employeeId}`,
            payload
        );

        return res;
    } catch (error) {
        return false;
    }
};

export const reimbursementUpdate = async (payload: updateReimbursementPayload) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/payroll/reimbursement/${payload.reimbursementId}`,
            payload
        );

        return resp;
    } catch (err) {
        return false;
    }
};

export const deleteReimbursement = async (payload: reimbursementDeletePayload) => {
    try {
        const res: SuccessGenericResponse<reimbursementDeletedResponse> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/payroll/reimbursement/${payload.rId}`
        );

        return res;
    } catch (error) {
        return false;
    }
};
