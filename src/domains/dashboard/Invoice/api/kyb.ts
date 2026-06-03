import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    BankListResponse,
    CreateSupplierPayload,
    ExistingDocumentsListResponse,
    KybDocumentPayload,
} from '../types/paymentlinkType';

export const createSupplierApi = async (payload: UserPayload & CreateSupplierPayload) => {
    try {
        const { userId, userType, ...rest } = payload;

        const resp: SuccessGenericResponse<{}> = await ApiClient.post(
            `${userType}/${userId}/officeAndBusiness/payment-links/create-supplier`,
            rest
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const uploadKybDocs = async (payload: UserPayload & KybDocumentPayload) => {
    try {
        const { userId, userType } = payload;

        const formData = new FormData();

        formData.append('Trade_License', payload.tradeLicense);
        formData.append('Article_Of_Association', payload.articleOfAssociation);
        formData.append('Emirates_ID', payload.emiratesID);
        formData.append('Passport', payload.passportCopy);
        formData.append('Bank_Letter', payload.bankLetter);
        formData.append('websiteLink', payload.websiteLink);

        const resp: SuccessGenericResponse<{}> = await ApiClient.post(
            `${userType}/${userId}/officeAndBusiness/payment-links/upload-supplier-documents`,
            formData
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getBankList = async (payload: UserPayload) => {
    try {
        const { userId, userType } = payload;

        const resp: SuccessGenericResponse<BankListResponse> = await ApiClient.get(
            `${userType}/${userId}/officeAndBusiness/payment-links/bank-list`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getExistingDocuments = async (payload: UserPayload) => {
    try {
        const { userId, userType } = payload;

        const resp: SuccessGenericResponse<ExistingDocumentsListResponse> = await ApiClient.get(
            `${userType}/${userId}/officeAndBusiness/payment-links/uploaded-documents`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
