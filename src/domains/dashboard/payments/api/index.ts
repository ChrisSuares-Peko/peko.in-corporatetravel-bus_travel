import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    OrderResponse,
    PaymentGeneric,
    PaymentIntentRequestPayload,
    PaymentIntentResponse,
    CardPaymentResponse,
    QueuedPaymentRequestPayload,
    QueuedPaymentResponse,
    WalletBalanceResponse,
    PaymentResponse,
    TransactionDetailsResponse,
    TransactionDetailsPayload,
    vendorBalanceResponse,
    BulkPaymentStatusResp,
} from '../types';

export const createPaymentLink = async (payload: PaymentGeneric & UserPayload) => {
    try {
        const { userId, userType, ...restPayload } = payload;
        const resp: SuccessGenericResponse<CardPaymentResponse> = await ApiClient.post(
            `${userType}/${userId}/paymentGateway/ni-payments/create`,
            restPayload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getWalletBalance = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<WalletBalanceResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/others/profile/walletDetails`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getOrder = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<OrderResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/paymentGateway/lean-payments/order`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const createPaymentIntentId = async (payload: PaymentIntentRequestPayload & UserPayload) => {
    try {
        const { userId, userType, ...restPayload } = payload;
        const resp: SuccessGenericResponse<PaymentIntentResponse> = await ApiClient.post(
            `${userType}/${userId}/paymentGateway/lean-payments/paymentIntent`,
            restPayload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getQueuedPayments = async (payload: QueuedPaymentRequestPayload & UserPayload) => {
    try {
        const { userId, userType, ...restPayload } = payload;
        const resp: SuccessGenericResponse<QueuedPaymentResponse> = await ApiClient.post(
            `${userType}/${userId}/paymentGateway/lean-payments/queuedPayments`,
            restPayload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const completeLeanPayment = async (payload: PaymentGeneric & UserPayload) => {
    try {
        const { userId, userType, ...restPayload } = payload;
        const resp: SuccessGenericResponse<PaymentResponse> = await ApiClient.post(
            `${userType}/${userId}/paymentGateway/lean-payments/complete`,
            restPayload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const doWalletPayment = async (payload: PaymentGeneric & UserPayload & { url: string }) => {
    try {
        const { userId, userType, url, ...restPayload } = payload;
        const resp: SuccessGenericResponse<PaymentResponse> = await ApiClient.post(
            `${userType}/${userId}/${url}`,
            restPayload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getTransactionDetails = async (payload: UserPayload & TransactionDetailsPayload) => {
    try {
        const resp: SuccessGenericResponse<TransactionDetailsResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/paymentGateway/transactions/details/${payload.transactionId}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getVendorBalance = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<vendorBalanceResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/payoll`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getBulkPaymentStatusApi = async (payload: UserPayload, batchId: number) => {
    try {
        const resp: SuccessGenericResponse<BulkPaymentStatusResp> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/payment/bulk-payment/status/${batchId}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
