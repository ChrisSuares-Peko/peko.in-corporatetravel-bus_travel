import { DropDown, UserPayload } from '@customtypes/general';
import { Scope } from '@src/enums/enums';

export interface GetOtpPayload extends UserPayload {
    scope: Scope;
    iban: string;
    accountNumber: string;
    selectedId?: number | string;
}

export type AddressListResponse = {
    data: AddressDetail[];
};

export interface AddressDetail {
    id: number;
    name: string;
    nickname: string;
    department: string | null;
    city: string | null;
    country: string | null;
    addressLine1: string;
    addressLine2: string;
    phoneNumber: string;
    email: string | null;
    countryCode: string | null;
    zipCode: string | null;
    default: number;
    addressType: string | null;
    createdAt: string;
    updatedAt: string;
    credentialId: number;
}

export type AddressTableData = {
    id: number;
    label: string;
    value: string;
}[];

export type AddressTypesResponse = {
    addressType: DropDown;
};
export type CompanySizesResponse = {
    companySize: DropDown;
};

export type CountriesResponse = {
    countries: DropDown;
};

export type ActivityResponse = {
    companyActivity: DropDown;
};
export type AccountTypeResponse = {
    accountType: DropDown;
};

export interface AddAddressRequestPayload {
    addressType: string;
    addressLine1: string;
    addressLine2: string;
    credentialId?: string;
    default: boolean;
    name: string;
    phoneNumber: string;
    userType: string;
    otp?: string;
    scope?: string;
}

export type AddAddressResponse = {
    isReceiver: boolean;
    id: number;
    addressType: string;
    addressLine1: string;
    addressLine2: string;
    credentialId: string;
    default: boolean;
    name: string;
    phoneNumber: string;
    updatedAt: string;
    createdAt: string;
};

export interface DeleteRequestPayload extends UserPayload {
    id: number;
    otp?: string;
    scope?: string;
}

export interface updateAddressRequestPayload extends AddAddressRequestPayload {
    id: number;
    otp?: string;
    scope?: string;
}
export type updateResponse = {
    updatedAddress: number[];
};

export type BankListResponse = {
    data: BankDetail[];
};
export type BankDetail = {
    id: number;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    iban: string | null;
    status: number;
    default: number;
    createdAt: string;
    updatedAt: string;
    credentialId: number;
    bankAddress?: string;
    swiftCode: string;
    accountType: string;
};

export interface AddBankRequestPayload extends UserPayload {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    bankBranch: string;
    credentialId?: string;
    iban: string;
    swiftCode: String;
    default: boolean;
    otp: string;
    scope: string;
    selectedId: string;
}
export interface UpdateBankRequestPayload extends AddBankRequestPayload {
    id: number;
}

export type AddBankResponse = {
    status: boolean;
    id: number;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    credentialId: string;
    ifscCode: string;
    default: boolean;
    updatedAt: string;
    createdAt: string;
};

export type BasicInfoResponse = {
    name: string;
    mobileNo: string;
    city: string;
    designation: string;
    email: string;
    country: string;
    contactPersonName: string;
    companySize: string;
    landlineNo: string;
    mobileVerified: number;
    logo: string;
    package: Package;
    credential: Credential;
};

export interface Package {
    packageName: string;
}

export interface Credential {
    username: string;
}

export type CompanyInfoResponse = {
    activity: string;
    trnExpiry: string | null;
    trnNo: string;
    tradeLicenseExpiry: string;
    tradeLicenseNo: string;
    tradeLicenseDoc: string | null;
    trnCertificate: string | null;
    eidDoc: string | null;
};

export interface SecurityInfoResponse {
    sendMfaCodeToEmail: number;
    sendMfaCodeToPhone: number;
    sendMfaCodeToAuthApp: number;
}

export interface SecurityInfoUpdatePayload extends UserPayload {
    sendMfaCodeToEmail?: number;
    sendMfaCodeToPhone?: number;
    sendMfaCodeToAuthApp?: number;
    otp?: string;
    scope?: string;
}

export type SecurityInfoUpdateResponse = {
    result: number[];
    docs: {};
};

export interface UpdateBasicInfoRequestPayload extends UserPayload {
    name: string;
    mobileNo: string;
    city: string;
    designation: string;
    email: string;
    country: string;
    companyName: string;
    companySize: string;
    landlineNo: string;
    profileImageBase: string;
    profileImageFormat: string;
    scope: string;
    otp: string;
}

export type UpdateBasicInfoResponse = {
    result: string;
    docs: {
        logo: string;
    };
};

export interface UpdateCompanyInfoRequestPayload extends UserPayload {
    activity: string;
    cinNumber: string;
    gstNumber: string;
    panNumber: string;
    cinDoc: string;
    gstDoc: string;
    panDoc: string;
    cinFormat: string;
    gstFormat: string;
    panFormat: string;
    scope: string;
    otp: string;
    trnExpiry?: string;
    tradeLicenseExpiry?: string;
}

export interface ChangePasswordRequestPayload extends UserPayload {
    id?: string;
    oldPassword: string;
    newPassword: string;
}
export interface progressResponse {
    addressDetailsProgress: number;
    progress: string;
    bankDetailsProgress: number;
    basicInfoProgress: number;
    companyInfoProgress: number;
    strength: string;
    tips: string;
    referralLink: string;
}
export type PasswordPolicyResponse = {
    data: {
        id: number;
        level: number;
        minLength: number;
        minPasswordAge: number;
        maxPasswordAge: number;
        minChangeChars: number;
        prohibitPasswordReuse: boolean;
        prohibitPasswordReuseTimes: number | null;
        maxInvalidLoginAttempts?: number;
        lockEffectivePeriod?: number;
        lockoutTimespan?: number;
        enableBannedPasswords?: boolean;
        customBannedPasswords?: string;
        preventPersonalDataInPassword?: boolean;
        createdAt: string;
        updatedAt: string;
    }[];
};

export type PasswordPolicy = {
    id?: number;
    level: number;
    minLength: number;
    minPasswordAge: number;
    maxPasswordAge: number;
    minChangeChars: number;
    prohibitPasswordReuse?: boolean;
    prohibitPasswordReuseTimes?: number | null;
    maxInvalidLoginAttempts?: number;
    lockEffectivePeriod?: number;
    lockoutTimespan?: number;
    enableBannedPasswords?: boolean;
    customBannedPasswords?: string;
    preventPersonalDataInPassword?: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type SubCorporateProfileResponse = {
    name: string;
    mobileNo: string;
    email: string;
    role: string;
    credential: {
        username: string;
    };
};
