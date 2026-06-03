import { Scope } from '@src/enums/enums';

export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    refreshToken: string;
    sessionId: string;
    role: string;
    id: number;
    username: string;
    roleName: string;
    packageName: string;
    maxPasswordAge?: boolean;
};

export type RegisterUserState = {
    name?: string;
    contactPersonName?: string;
    companyname?: string;
    phonenumber?: string;
    email?: string;
    password?: string;
    confirmpassword?: string;
    referralCode?: string;
};

export type RegistrationRequest = {
    name: string;
    countryCode: number;
    mobileNo: string;
    email: string;
    contactPersonName: string;
    password: string;
    phoneOtp: string;
    scope: Scope;
    referralCode?: string;
};

export type ResgistrationResponse = {
    kycStatus: string;
    isActive: boolean;
    isMFA: boolean;
    sendMfaCodeToEmail: boolean;
    sendMfaCodeToPhone: boolean;
    sendMfaCodeToAuthApp: boolean;
    id: number;
    name: string;
    countryCode: string;
    mobileNo: string;
    email: string;
    companyName: string;
    credentialId: number;
    registeredBy: any;
    packageId: number;
    updatedAt: string;
    createdAt: string;
    corporateId: number;
};

export type OtpRequest = {
    name: string;
    mobileNo: string;
    email: string;
    scope: Scope;
    resend: boolean;
    password?: string;
};

export type EmailOtpVerifyPayload = {
    mobileNo: string;
    email: string;
    emailOtp: string;
};

export type ForgotPasswordRequest = {
    username: string;
};

export type ResetPasswordRequest = {
    password: string;
    token: string;
    username: string;
    isForgot: string;
};
export type PasswordExpryReset = {
    password: string;
    newPassword: string;
    username: string;
};

export type ValidateUserRequest = {
    mobileNo: string;
    email: string;
    referralCode?: string;
};

export type ValidateUserValues = {
    contactPersonName: string;
    name: string;
    phonenumber: string;
    email: string;
    referralCode?: string;
};

export type passwordUserData = {
    password: string;
    userName: string;
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
