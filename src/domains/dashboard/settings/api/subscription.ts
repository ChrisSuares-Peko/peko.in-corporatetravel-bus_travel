import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    CurrentPlanResponse,
    GetAllSavedCardsResponse,
    PackageQueryParams,
    ResponseDataSubscriptionHistory,
    downloadResponse,
} from '../types/subscription';

export const getPurchaseHistory = async ({
    itemsPerPage,
    page,
    status,
    packageType,
}: PackageQueryParams) => {
    try {
        const resp: SuccessGenericResponse<ResponseDataSubscriptionHistory> = await ApiClient.get(
            `user/subscription/purchse-history`,
            {
                params: {
                    page,
                    itemsPerPage,
                    status,
                    packageType,
                },
            }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getCurrentSubscription = async () => {
    try {
        const resp: SuccessGenericResponse<CurrentPlanResponse> = await ApiClient.get(
            `user/subscription/current-details`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const downloadInvoice = async (invoiceId: number) => {
    try {
        const res: SuccessGenericResponse<downloadResponse> = await ApiClient.get(
            `user/subscription/downlaod-invoice/${invoiceId}`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const cancelSubscriptionPatch = async (subscriptionId: number) => {
    try {
        const res: SuccessGenericResponse<{ message: string }> = await ApiClient.patch(
            `user/subscription/cancel-subscription/${subscriptionId}`
        );

        return res;
    } catch (error) {
        return false;
    }
};

export const getAllCards = async () => {
    try {
        const res: SuccessGenericResponse<GetAllSavedCardsResponse> = await ApiClient.get(
            `user/subscription/all-cards`
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const updateDefaultCard = async (cardId: number) => {
    try {
        const res: SuccessGenericResponse<{}> = await ApiClient.patch(
            `user/subscription/change-default-card/${cardId}`
        );

        return res;
    } catch (error) {
        return false;
    }
};
