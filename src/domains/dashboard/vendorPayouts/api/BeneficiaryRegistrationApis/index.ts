import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    AgentAndExchangeratePayload,
    AgentAndExchangeRateResponse,
    ChargeAndExchangeratePayload,
    ChargeAndExchangeRateResponse,
    CountryListResponse,
    getCountryPayload,
    GetStatePayload,
    GetCityPayload,
    GetPayload,
    beneficiaryResponse,
    BeneficiaryDeletePayload,
    CreateBeneficiaryPayload,
    getStaticDataPayload,
    BeneficiaryTablePayload,
} from '../../types/types';

export const getState = async (
    payload: GetStatePayload
): Promise<SuccessGenericResponse<any> | null> => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `/${payload.userType}/${payload.userId}/payment/vendorPayout/getState?countryCode=${payload.countryCode}`
        );
        return resp;
    } catch (err) {
        return null;
    }
};
export const getStaticDataWithFilter = async (
    payload: getStaticDataPayload
): Promise<SuccessGenericResponse<any> | null> => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `/${payload.userType}/${payload.userId}/payment/vendorPayout/fetchStaticData?filter=${payload.filterType}`
        );
        return resp;
    } catch (err) {
        return null;
    }
};
export const getStaticData = async (
    payload: GetPayload
): Promise<SuccessGenericResponse<any> | null> => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `/${payload.userType}/${payload.userId}/payment/vendorPayout/fetchStaticData`
        );
        return resp;
    } catch (err) {
        return null;
    }
};
export const getCountry = async (
    payload: GetPayload
): Promise<SuccessGenericResponse<any> | null> => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `/${payload.userType}/${payload.userId}/payment/vendorPayout/getCountry?`
        );
        return resp;
    } catch (err) {
        return null;
    }
};
export const getCountries = async (payload: getCountryPayload) => {
    try {
        const resp: SuccessGenericResponse<CountryListResponse> = await ApiClient.get(
            `/${payload.userType}/${payload.userId}/payment/vendorPayout/getCountry?countryCode=${payload.countryCode ?? ''}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const getAgentChargeAndExchangerate = async (payload: ChargeAndExchangeratePayload) => {
    try {
        const resp: SuccessGenericResponse<ChargeAndExchangeRateResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/vendorPayout/getAgentAndChargeSlabAndExchangeRate`,
            {
                params: {
                    deliveryMode: payload.deliveryMode,
                    destinationCountry: payload.destinationCountry,
                    originatingCountry: 'AE',
                    targetCurrency: payload.targetCurrency,
                    sourceCurrency: 'AED',
                    sourceAmount: payload.sourceAmount,
                    settlementCurrency: payload.settlementCurrency,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
export const getAgentAndExchangerate = async (payload: AgentAndExchangeratePayload) => {
    try {
        const resp: SuccessGenericResponse<AgentAndExchangeRateResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/vendorPayout/getAgentAndExchangeRate`,
            {
                params: {
                    deliveryMode: payload.deliveryMode,
                    destinationCountry: payload.destinationCountry,
                    settlementCurrency: payload.settlementCurrency,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getCity = async (
    payload: GetCityPayload
): Promise<SuccessGenericResponse<any> | null> => {
    try {
        const { userId, userType, countryCode, stateCode } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `/${userType}/${userId}/payment/vendorPayout/getCity?countryCode=${countryCode}&stateCode=${stateCode}`
        );
        return resp;
    } catch (err) {
        return null;
    }
};
export const getBankDetails = async (
    payload: GetStatePayload
): Promise<SuccessGenericResponse<any> | null> => {
    try {
        const { userId, userType, countryCode } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `/${userType}/${userId}/payment/vendorPayout/getAgentListAndBankBranches?destinationCountry=${countryCode}&deliveryMode=4&receivingCountry=${countryCode}`
        );
        return resp;
    } catch (err) {
        return null;
    }
};

export const createBeneficiaryApi = async (payload: CreateBeneficiaryPayload) => {
    try {
        const resp: SuccessGenericResponse<beneficiaryResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/payment/vendorPayout/beneficiaries`,
            payload.beneficiaryInformation
        );

        return { success: true, data: resp };
    } catch (err) {
        return { success: false, errorMessage: err.response.data.message };
    }
};

export const getBeneficiariesList = async (payload: BeneficiaryTablePayload) => {
    try {
        const { search, length, start, userId, userType } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${userType}/${userId}/payment/vendorPayout/beneficiaries?itemsPerPage=${length}&page=${start}&searchText=${search}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getBeneficiariesListAll = async (payload: GetPayload) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/vendorPayout/beneficiaries/list-all`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const deleteBeneficiary = async (payload: BeneficiaryDeletePayload) => {
    try {
        const res: SuccessGenericResponse<{}> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/payment/vendorPayout/beneficiaries/${payload.bId}`
        );
        return res;
    } catch (error) {
        return false;
    }
};

export const beneficiaryUpdate = async (payload: any) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/payment/vendorPayout/beneficiaries/${payload.bId}`,
            payload.beneficiaryData
        );
        return resp.data;
    } catch (err) {
        return false;
    }
};
