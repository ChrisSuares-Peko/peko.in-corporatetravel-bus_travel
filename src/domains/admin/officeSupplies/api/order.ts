import { CommonFileBuffer, SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    OrderUpdatePayload,
    UpdateOrderRequestPayload,
    getData,
    payloadVendors,
    transactionResponse,
    vendorListResponse,
} from '../types/types';

export const getAllData = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<transactionResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/ecommerce/orders`,
            {
                params: {
                    from: payload.from,
                    to: payload.to,
                    sort: payload.sort,
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                    searchText: payload.searchText,
                    status: payload.status,
                    sortField: payload.sortField,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getFileBufferReportOrders = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/ecommerce/orders/${payload.type}`,
            {
                params: {
                    from: payload.from,
                    to: payload.to,
                    sort: payload.sort,
                    searchText: payload.searchText,
                    status: payload.status,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getCancelledOrders = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<transactionResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/ecommerce/cancelAndRefund/orders`,
            {
                params: {
                    from: payload.from,
                    to: payload.to,
                    sort: payload.sort,
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                    searchText: payload.searchText,
                    status: payload.status,
                    sortField: payload.sortField,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getFileBufferReportCancelledOrders = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/ecommerce/cancelAndRefund/orders/${payload.type}`,
            {
                params: {
                    from: payload.from,
                    to: payload.to,
                    sort: payload.sort,
                    searchText: payload.searchText,
                    status: payload.status,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getVendorList = async ({
    userId,
    userType,
    ...payload
}: UserPayload & payloadVendors) => {
    try {
        const resp: SuccessGenericResponse<vendorListResponse[]> = await ApiClient.post(
            `${userType}/${userId}/purchase/ecommerce/orders/vendors`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const updateOrderApi = async ({
    userId,
    userType,
    id,
    ...payload
}: UserPayload & OrderUpdatePayload) => {
    try {
        const resp: SuccessGenericResponse<vendorListResponse[]> = await ApiClient.put(
            `${userType}/${userId}/purchase/ecommerce/orders?corporateTxnId=${id}`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getOtpEcommerce = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/ecommerce/cancelAndRefund/get-otp?scope=email`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const updateOrderDetails = async ({
    userId,
    userType,
    corporateTxnId,
    ...payload
}: UpdateOrderRequestPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.put(
            `${userType}/${userId}/purchase/ecommerce/cancelAndRefund/?corporateTxnId=${corporateTxnId}`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getReturnedOrders = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<transactionResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/ecommerce/returnAndRefund/orders`,
            {
                params: {
                    from: payload.from,
                    to: payload.to,
                    sort: payload.sort,
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                    searchText: payload.searchText,
                    status: payload.status,
                    sortField: payload.sortField,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getFileBufferReportReturnedOrders = async (payload: UserPayload & getData) => {
    try {
        const resp: SuccessGenericResponse<CommonFileBuffer> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/ecommerce/returnAndRefund/orders/${payload.type}`,
            {
                params: {
                    from: payload.from,
                    to: payload.to,
                    sort: payload.sort,
                    searchText: payload.searchText,
                    status: payload.status,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const updateReturnOrderDetails = async ({
    userId,
    userType,
    corporateTxnId,
    ...payload
}: UpdateOrderRequestPayload) => {
    try {
        const resp: SuccessGenericResponse<{}> = await ApiClient.put(
            `${userType}/${userId}/purchase/ecommerce/returnAndRefund/?corporateTxnId=${corporateTxnId}`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
