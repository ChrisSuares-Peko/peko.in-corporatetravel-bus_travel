import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { UserPayload, historyResponse, taxAmount, taxPayload, updatePayload } from '../types/types';

export const getCorporateTaxAmount = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<taxAmount> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/officeAndBusiness/corporate-tax-registration/payment-amount`
        );

        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};
export const getCorporateTaxHistory = async (payload: UserPayload & taxPayload) => {
    try {
        const resp: SuccessGenericResponse<historyResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/officeAndBusiness/corporate-tax-registration/find-all`,
            {
                params: {
                    searchText: payload.searchText,
                    page: payload.page,
                    pageSize: payload.pageSize,
                },
            }
        );

        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};

export const updateCorporateTax = async (payload: UserPayload & updatePayload) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/officeAndBusiness/corporate-tax-registration/update-details/${payload.id}`,
            payload
        );

        // const { data } = resp;

        return resp;
    } catch (err) {
        return false;
    }
};
