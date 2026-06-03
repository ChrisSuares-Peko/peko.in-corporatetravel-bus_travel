import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    ICheckPrice,
    IDocumentDetails,
    IDocumentListPayload,
    IFileUploadPayload,
    invoicePayload,
} from '../types/payloadTypes';

export const getCountriesAPI = async (payload: UserPayload) => {
    try {
        const { userId, userType } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${userType}/${userId}/officeAndBusiness/attestation/countries`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getDocumentType = async (payload: UserPayload, country: string) => {
    try {
        const { userId, userType } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${userType}/${userId}/officeAndBusiness/attestation/categoryType?countryCode=${country}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const checkPrice = async (payload: ICheckPrice) => {
    try {
        const { postData, userId, userType } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.post(
            `${userType}/${userId}/officeAndBusiness/attestation/checkPrice`,
            postData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getSavedAddressApi = async (payload: UserPayload) => {
    try {
        const { userId, userType } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${userType}/${userId}/others/profile/addressDetails`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const uploadDocument = async (payload: IFileUploadPayload) => {
    try {
        const { userId, userType, passportDoc } = payload;
        const postData = passportDoc;
        const resp: SuccessGenericResponse<any> = await ApiClient.post(
            `${userType}/${userId}/officeAndBusiness/attestation/fileSave`,
            postData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getOrdersList = async (payload: IDocumentListPayload) => {
    try {
        const { userId, userType } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${userType}/${userId}/officeAndBusiness/attestation/reports?searchText=${payload.setSearchKey}&sort=DESC&page=${payload.page}&itemsPerPage=10`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getOrderDetails = async (payload: IDocumentDetails) => {
    try {
        const { userId, userType } = payload;
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${userType}/${userId}/officeAndBusiness/attestation/details/${payload.id}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const downloadInvoice = async (payload: invoicePayload) => {
    try {
        const resp: SuccessGenericResponse<any> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/transactions/download/${payload.transactionID}`
        );

        const { data } = resp;
        return data;
    } catch (error) {
        return false;
    }
};
