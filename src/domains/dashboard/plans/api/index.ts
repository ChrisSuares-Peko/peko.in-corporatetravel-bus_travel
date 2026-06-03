import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    AddOnPaymentRequestPayload,
    ApplyCouponPayload,
    ApplyCouponResponse,
    PackageDetailsResponse,
    PackagesData,
    PaymentRequestPayload,
    PaymentResponse,
    TableDataPackages,
    userPayload,
} from '../types';

export const getPackages = async () => {
    try {
        const resp: SuccessGenericResponse<PackagesData> = await ApiClient.get(
            `user/subscription/list-packages`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getPackageDetails = async (packageId: number) => {
    try {
        const resp: SuccessGenericResponse<PackageDetailsResponse> = await ApiClient.get(
            `user/subscription/package-details`,
            {
                params: {
                    packageId,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const postPaymentRequest = async ({
    userId,
    userType,
    ...payload
}: (PaymentRequestPayload & userPayload) | (AddOnPaymentRequestPayload & userPayload)) => {
    try {
        const resp: SuccessGenericResponse<PaymentResponse> = await ApiClient.post(
            `${userType}/${userId}/paymentGateway/ni-payments/create`,
            payload
        );
        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};

export const getPackageTableDetails = async () => {
    try {
        const resp: SuccessGenericResponse<TableDataPackages> = await ApiClient.get(
            `user/subscription/list-table`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const postPaymentRequestForFree = async ({
    userId,
    userType,
    ...payload
}: PaymentRequestPayload & userPayload) => {
    try {
        const resp: SuccessGenericResponse<PaymentResponse> = await ApiClient.post(
            `${userType}/${userId}/paymentGateway/subscriptions/payment`,
            payload
        );
        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};

export const postApplyCoupon = async ({
    userId,
    userType,
    ...payload
}: ApplyCouponPayload & userPayload) => {
    try {
        const resp: SuccessGenericResponse<ApplyCouponResponse> = await ApiClient.post(
            `${userType}/${userId}/purchase/coupons`,
            payload
        );
        const { data } = resp;

        return data;
    } catch (err) {
        return false;
    }
};
