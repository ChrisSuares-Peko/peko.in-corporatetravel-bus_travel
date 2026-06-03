import axios from 'axios';

import { FRONTEND_BASE_URL, SERVER_URL } from '@src/config-global';
import { showToast } from '@src/slices/apiSlice';
import { store } from '@store/store';

import {
    EmailOtpVerifyPayload,
    ForgotPasswordRequest,
    LoginRequest,
    OtpRequest,
    PasswordExpryReset,
    RegistrationRequest,
    ResetPasswordRequest,
    ValidateUserRequest,
} from '../types';

export const signIn = async (payload: LoginRequest) => {
    try {
        const resp = await axios.post(`${SERVER_URL}/user/login`, {
            ...payload,
        });
        const { data } = resp;
        return data.data;
    } catch (err) {
        const { data } = err.response;
        store.dispatch(showToast({ description: data.message, variant: 'error' }));
        return false;
    }
};

export const signUp = async (payload: RegistrationRequest) => {
    try {
        if (!payload.referralCode) delete payload.referralCode;
        const resp = await axios.post(`${SERVER_URL}/user/signUp`, {
            ...payload,
        });
        const { data } = resp;
        return data.data;
    } catch (err) {
        const { data } = err.response;
        store.dispatch(showToast({ description: data.message, variant: 'error' }));
        return false;
    }
};

export const getOtp = async (payload: OtpRequest) => {
    try {
        const resp = await axios.post(`${SERVER_URL}/user/otp`, payload);
        const { data } = resp;
        return data;
    } catch (err) {
        const { data } = err.response;
        store.dispatch(showToast({ description: data.message, variant: 'error' }));
        return false;
    }
};

export const verifyEmailOtp = async (payload: EmailOtpVerifyPayload) => {
    try {
        const resp = await axios.post(`${SERVER_URL}/user/verify-emailOtp`, payload);
        const { data } = resp;
        return data;
    } catch (err) {
        const { data } = err.response;
        store.dispatch(showToast({ description: data.message, variant: 'error' }));
        return false;
    }
};

export const forgotPassword = async (payload: ForgotPasswordRequest) => {
    try {
        const payloadWithURL = {
            ...payload,
            baseUrl: FRONTEND_BASE_URL,
        };
        const resp = await axios.post(`${SERVER_URL}/user/forgotPassword`, payloadWithURL);
        const { data } = resp;
        return data;
    } catch (err) {
        const { data } = err.response;
        store.dispatch(showToast({ description: data.message, variant: 'error' }));
        return false;
    }
};

export const ResetPassword = async (payload: ResetPasswordRequest) => {
    try {
        const resp = await axios.post(`${SERVER_URL}/user/resetPassword`, payload);
        const { data } = resp;
        return data;
    } catch (err) {
        const { data } = err.response;
        store.dispatch(showToast({ description: data.message, variant: 'error' }));
        return false;
    }
};
export const ChangePassword = async (payload: PasswordExpryReset) => {
    try {
        const resp = await axios.post(`${SERVER_URL}/user/passwordExpiryReset`, payload);
        const { data } = resp;
        return data;
    } catch (err) {
        const { data } = err.response;
        store.dispatch(showToast({ description: data.message, variant: 'error' }));
        return false;
    }
};

export const ValidateUser = async (payload: ValidateUserRequest) => {
    try {
        if (!payload.referralCode) delete payload.referralCode;
        const resp = await axios.post(`${SERVER_URL}/user/validate`, payload);
        const { data } = resp;

        return data;
    } catch (err) {
        const { data } = err.response;
        store.dispatch(showToast({ description: data.message, variant: 'error' }));
        return { error: data.message };
    }
};

export const getPasswordPolicies = async (username: any) => {
    try {
        const resp = await axios.post(`${SERVER_URL}/user/password-policy/passwordPolicies`, {
            username,
        });

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
