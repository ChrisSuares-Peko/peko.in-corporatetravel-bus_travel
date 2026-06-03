import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    GetCheckRatePayload,
    InvoicePayload,
    InvoiceResponse,
    validateBeneficiaryInformationPayload,
    ValidationResponse,
} from '../types/types';

export const postInvoice = async (payload: InvoicePayload) => {
    try {
        const resp: SuccessGenericResponse<InvoiceResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/officeAndBusiness/invoice-details`,
            payload.postData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return resp;
    } catch (err) {
        console.error('File upload error:', err);
        return false;
    }
};

export const getCountriesAPI = async () => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(`user/general/countries`);
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const validateBeneficiaryInformation = async ({
    userId,
    userType,
    ...payload
}: validateBeneficiaryInformationPayload) => {
    try {
        const resp: ValidationResponse = await ApiClient.post(
            `${userType}/${userId}/payroll/employee/validate`,
            payload
        );

        return { success: true, data: resp };
    } catch (err) {
        return { success: false, errorMessage: err.response.data.message };
    }
};

export const checkRate = async (
    payload: GetCheckRatePayload
): Promise<SuccessGenericResponse<any> | null> => {
    try {
        const { userId, userType, country, deliveryMode, totalAmount } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `/${userType}/${userId}/payment/vendorPayout/getExchangeRateandCharge?sourceAmount=${totalAmount}&sourceCurrency=AED&originatingCountry=AE&destinationCountry=${country}&deliveryMode=${deliveryMode}&countryCode=${country}`
        );
        return resp;
    } catch (err) {
        return null;
    }
};
