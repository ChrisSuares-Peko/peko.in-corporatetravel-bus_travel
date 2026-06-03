import { IFileUpload } from '.';

export type ICheckPrice = {
    userType: string;
    userId: number;
    postData: {
        documentType: string;
        countryCode: string;
        promoCode: string;
    };
};
export type IFileUploadPayload = {
    userType: string;
    userId: number;
    passportDoc: IFileUpload;
};

export type IDocumentDetails = {
    userType: string;
    userId: number;
    id: number;
};

export type IDocumentListPayload = {
    userType: string;
    userId: number;
    page: number;
    setSearchKey: string;
};

export type invoicePayload = {
    userId: number;
    userType: string;
    transactionID: number;
};
