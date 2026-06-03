import { DropDown } from '@customtypes/general';

export type getpaymentlinkPayload = {
    payment_link_image: any;
    full_name: string;
    email: string;
    phone_number: string;
    amount: string;
    notification: string;
    expires_at: any;
};
export type IData = {
    key: string;
    date: string;
    paymentName: string;
    paymentId: string;
    amount: string;
    status: string;
    paymentLink: string;
    action: string;
};

export type BankListResponse = {
    bankList: DropDown;
    bankDetails: BankDetails;
};

export type BankDetails = {
    id: number;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    bankAddress: string;
    iban: string;
    swiftCode: string;
    accountType: string;
    destinationIdLean: string;
    bankIdentifier: string | null;
    status: number;
    default: number;
    createdAt: string; // Date ISO string
    updatedAt: string; // Date ISO string
    credentialId: number;
};

export type CreateSupplierPayload = {
    bankId: string;
    accountHolderName: string;
    accountNumber: string;
    ibanNumber: string;
};

export type KybDocumentPayload = {
    tradeLicense: string | File;
    articleOfAssociation: string | File;
    emiratesID: string | File;
    passportCopy: string | File;
    bankLetter: string | File;
    websiteLink: string | File;
};

export type ExistingDocumentsListResponse = {
    corporateDocuments: CorporateDocument;
};

export interface CorporateDocument {
    Trade_License?: string;
    Article_Of_Association?: string;
    Emirates_ID?: string;
    Passport?: string;
    Bank_Letter?: string;
}
