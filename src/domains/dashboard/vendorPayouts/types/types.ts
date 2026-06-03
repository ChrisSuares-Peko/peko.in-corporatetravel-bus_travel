import { UserPayload } from '@customtypes/general';

export type InvoicePayload = {
    userId: number;
    userType: string;
    postData: FormData;
};

export type InvoiceResponse = {
    status: boolean;
    message: string;
    data: {};
    responseCode: string;
};

export type BeneficiaryTableRow = {
    result: any;
    id: string;
    updatedAt: string;
    fullName: string;
    email: string;
    country: string;
    phoneNumber: number;
};

type InitialStateDataType = {
    fullName: string;
    personalEmail: string;
};

export type validateBeneficiaryInformationPayload = {
    userId?: number;
    userType?: string;
    personalEmail?: string;
    mobileNo?: string;
};

export type ValidationResponse = {
    status: boolean;
    responseCode: string;
    message: string;
    data: {
        jsonData: InitialStateDataType[];
    };
};

export type GetPayload = {
    userId: number;
    userType: string;
};
export type GetCheckRatePayload = {
    userId: number;
    userType: string;
    deliveryMode: string;
    country: string;
    totalAmount: number;
};
export type GetStatePayload = {
    countryCode: any;
    userId: number;
    userType: string;
};
export type GetBankPayload = {
    countryCode: any;
    userId: number;
    userType: string;
};
export interface TransferData {
    countryCode: string;
    countryName: string;
    payingCurrency: string;
    receivingLimit: number;
    deliveryMode: number;
    deliveryModeDescription: string;
}

export interface CountryListResponse {
    data: TransferData[];
}
export type getCountryPayload = GetPayload & {
    countryCode?: string;
};
export type getStaticDataPayload = GetPayload & {
    filterType?: string;
};
export type ChargeAndExchangeratePayload = UserPayload & {
    settlementCurrency?: string;
    destinationCountry?: string;
    sourceCurrency?: string;
    targetCurrency?: string;
    originatingCountry?: string;
    deliveryMode?: string;
    sourceAmount?: string;
};
interface ChargeSlabItem {
    amountRangeFrom: number;
    amountRangeTo: number;
    charge: number;
    slabCurrency: string;
    commissionType: string;
    settlementRate: number;
    receivingRateGroup: string;
    receivingRateGroupCode: string;
}

// Define the type for the Charge Slab
interface ChargeSlab {
    data: ChargeSlabItem[];
}

// Define the type for a single Exchange Rate item
interface ExchangeRateItem {
    destinationCountry: string;
    receivingAgent: string;
    payingCurrency: string;
    specialPayingGroup: string;
    groupDescription: string;
    settlementRate: number;
}

// Define the type for the Exchange Rate
interface ExchangeRate {
    data: ExchangeRateItem[];
}

// Define the combined type for the data property
export interface ChargeAndExchangeRateResponse {
    chargeSlab: ChargeSlab;
    exchangeRate: ExchangeRate;
}
export type AgentAndExchangeratePayload = UserPayload & {
    settlementCurrency?: string;
    destinationCountry?: string;
    deliveryMode?: string;
};
export interface ExchangeRateType {
    destinationCountry: string;
    receivingAgent: string;
    payingCurrency: string;
    specialPayingGroup: string;
    groupDescription: string;
    settlementRate: number;
}

export type AgentAndExchangeRateResponse = ExchangeRateType[];
export type GetCityPayload = {
    countryCode: any;
    stateCode: any;
    userId: number;
    userType: string;
};

export type beneficiaryResponse = {
    status: boolean;
    message: string;
    data: {};
    responseCode: string;
};

export interface LogoImage {
    base64: string;
    format: string;
}

export type CreateBeneficiaryPayload = {
    beneficiaryInformation: {
        logo?: LogoImage | null;
        fullName: string;
        email: string;
        phoneNumber: string;
        relationShip: string;
        additionalDetails: string;
        addressLineOne: string;
        addressLineTwo: string;
        country: undefined;
        state: string;
        city: string;
        bankName: string;
        bankAccountNumber: string;
        bankCode: string;
        bankAccountName: string;
        bankAddress: string;
        deliveryMode: string | null;
    };

    userType?: string;
    userId?: number;
};
export type UpdateBeneficiaryPayload = {
    beneficiaryInformation: {
        logo?: LogoImage | null;
        fullName: string;
        email: string;
        phoneNumber: string;
        relationShip: string;
        additionalDetails: string;
        addressLineOne: string;
        addressLineTwo: string;
        country: undefined;
        state: string;
        city: string;
        bankName: string;
        bankAccountNumber: string;
        bankCode: string;
        bankAccountName: string;
        bankAddress: string;
        deliveryMode: string | null;
    };

    userType?: string;
    userId?: number;
    bId: string | undefined;
};
export type BeneficiaryFormType = {
    beneficiaryInformation: {
        logo?: LogoImage | null;
        fullName: string;
        email: string;
        phoneNumber: string;
        relationShip: string;
        additionalDetails: string;
        addressLineOne: string;
        addressLineTwo: string;
        country: undefined;
        state: string;
        city: string;
        bankName: string;
        bankAccountNumber: string;
        bankCode: string;
        bankAccountName: string;
        bankAddress: string;
        deliveryMode: string | null;
    };
};
export type BeneficiaryData = {
    id: string;
    logo?: LogoImage | null;
    fullName: string;
    email: string;
    phoneNumber: string;
    relationShip: string;
    additionalDetails: string;
    addressLineOne: string;
    addressLineTwo: string;
    country: undefined;
    state: string;
    city: string;
    bankName: string;
    bankAccountNumber: string;
    bankCode: string;
    bankAccountName: string;
    bankAddress: string;
    deliveryMode: string | null;
};

export type BeneficiaryDeletePayload = {
    userId: number;
    userType: string;
    bId: string | undefined;
};

export type filterStates = {
    search: string;
    draw?: number;
    start: number;
    length: number;
};

export type BeneficiaryTablePayload = {
    userId: number;
    userType: string;
    start: number;
    length: number;
    search: string;
};
