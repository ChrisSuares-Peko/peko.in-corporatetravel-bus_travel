export type DocumentDetailsFormValues = {
    documentType: string;
    issuedCountry: string;
    submissionCountry: string;
    promoCode: string;
};

export type DocumentDetailsFormVal = {
    documentType: string;
    countryCode: string;
    promoCode: string;
};

export interface AddressField {
    address: string;
    phoneNumber: string;
    email?: string;
}

export type IFileUpload = {
    passportDoc: {
        documentBase: string;
        documentFormat: string;
    };
};
