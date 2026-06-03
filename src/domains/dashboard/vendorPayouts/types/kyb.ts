export type userPayload = {
    userId: number;
    userType: string;
};

interface TradeLicense {
    base64: string;
    format: string;
}

interface CorporateAddress {
    poBox: string;
    buildingName: string;
    streetName: string;
    city: string;
    country: string;
}

interface ShareholderDocument {
    base64: string;
    format: string;
}

interface ShareholderDetails {
    shareholderName: string;
    nationality: string;
    id: string;
    designation: string;
    percentageShares: number;
    document: ShareholderDocument | string;
}

interface Shareholders {
    shareholder_1?: ShareholderDetails;
    shareholder_2?: ShareholderDetails;
    shareholder_3?: ShareholderDetails;
    [key: string]: ShareholderDetails | undefined;
}

export type KybDetailsPayload = userPayload & {
    icRegNumber: string;
    companyName: string;
    tradeName: string;
    offWebsite: string;
    offEmail: string;
    contactPersonName: string;
    phoneNumber: string;
    legalStatus: string;
    natureOfBusiness: string;
    countryOfIncorporation: string;
    dateOfIncorporation: string;
    TLNumber: string;
    TLIssuingAuthority: string;
    expiryDateofTL: string;
    VATTRN: string;
    tradeLicense: TradeLicense | string;
    corporateAddress: CorporateAddress;
    shareHolders: any;
    authorizedPersonName: string;
    authorizedPersonNationality: string;
    authorizedPersonID: string;
    hasPresenceInIranOrNorthKorea: boolean;
};
interface CorporateAddress {
    poBox: string;
    buildingName: string;
    streetName: string;
    city: string;
    country: string;
}

interface Shareholder {
    ownername_1?: string;
    nationalityofOwner_1?: string;
    idofOwner_1?: string;
    designationofOwner_1?: string;
    percentageSharesofOwner_1?: number;
    documentofOwner_1?: string;

    ownername_2?: string;
    nationalityofOwner_2?: string;
    idofOwner_2?: string;
    designationofOwner_2?: string;
    percentageSharesofOwner_2?: number;
    documentofOwner_2?: string;

    ownername_3?: string;
    nationalityofOwner_3?: string;
    idofOwner_3?: string;
    designationofOwner_3?: string;
    percentageSharesofOwner_3?: number;
    documentofOwner_3?: string;

    [key: string]: string | number | undefined;
}

export interface KybDetailsResponse {
    status: string;
    id: number;
    icRegNumber: string;
    companyName: string;
    tradeName: string;
    offWebsite: string;
    offEmail: string;
    contactPersonName: string;
    phoneNumber: string;
    legalStatus: string;
    natureOfBusiness: string;
    countryOfIncorporation: string;
    dateOfIncorporation: string;
    TLNumber: string;
    TLIssuingAuthority: string;
    expiryDateofTL: string;
    VATTRN: string;
    tradeLicense: string;
    corporateAddress: CorporateAddress;
    authorizedPersonName: string;
    authorizedPersonNationality: string;
    authorizedPersonID: string;
    hasPresenceInIranOrNorthKorea: boolean;
    shareholders: Shareholder[];
    credentialId: number;
    updatedAt: string;
    createdAt: string;
}
export type KybDetailsUpdatePayload = userPayload & {
    kybId: string;
    icRegNumber: string;
    companyName: string;
    tradeName: string;
    offWebsite: string;
    offEmail: string;
    contactPersonName: string;
    phoneNumber: string;
    legalStatus: string;
    natureOfBusiness: string;
    countryOfIncorporation: string;
    dateOfIncorporation: string;
    TLNumber: string;
    TLIssuingAuthority: string;
    expiryDateofTL: string;
    VATTRN: string;
    tradeLicense: TradeLicense | string;
    corporateAddress: CorporateAddress;
    shareHolders: Shareholders[];
    authorizedPersonName: string;
    authorizedPersonNationality: string;
    authorizedPersonID: string;
    hasPresenceInIranOrNorthKorea: boolean;
};
interface CorporateAddress {
    city: string;
    poBox: string;
    country: string;
    streetName: string;
    buildingName: string;
}

interface Row {
    id: number;
    icRegNumber: string;
    companyName: string;
    tradeName: string;
    offWebsite: string;
    offEmail: string;
    contactPersonName: string;
    phoneNumber: string;
    legalStatus: string;
    OtherlegalStatus: string | null;
    natureOfBusiness: string;
    countryOfIncorporation: string;
    dateOfIncorporation: string;
    TLNumber: string;
    TLIssuingAuthority: string;
    expiryDateofTL: string;
    VATTRN: string;
    tradeLicense: string;
    corporateAddress: CorporateAddress;
    shareholders: Shareholder[];
    status: string;
    remarks: string | null;
    authorizedPersonName: string;
    authorizedPersonNationality: string;
    authorizedPersonID: string;
    hasPresenceInIranOrNorthKorea: boolean;
    createdAt: string;
    updatedAt: string;
    credentialId: number;
}

export interface SubmittedKYBDetailsResponse {
    count: number;
    rows: any[];
}
