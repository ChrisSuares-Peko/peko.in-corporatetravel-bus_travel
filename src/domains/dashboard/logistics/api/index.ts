import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    ICalculateRateResponse,
    ICityListingResponse,
    ICountryListingResponse,
    IServiceTypeListingResponse,
    PaymentLogisticsPayload,
    calculateRatePayload,
    logisticsCityListing,
    logisticsCountryListing,
    logisticsServiceTypeListing,
    trackShipmentPayload,
} from '../types';
import { TransactionsRequestPayload, TransactionsResponse } from '../types/orderHistory';
import { ITrackShipmentResponse } from '../types/tracking';

export const countryListing = async (payload: logisticsCountryListing) => {
    try {
        const res: SuccessGenericResponse<ICountryListingResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/logistics/fetchCountries`,
            {
                params: {
                    searchText: payload.searchText || '',
                },
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const cityListing = async ({
    userType,
    userId,
    countryCode,
    searchText,
}: logisticsCityListing) => {
    try {
        const res: SuccessGenericResponse<ICityListingResponse> = await ApiClient.get(
            `${userType}/${userId}/travel/logistics/fetchCities`,
            {
                params: {
                    countryCode,
                    searchText: searchText || '',
                },
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const serviceTypeListing = async ({
    userType,
    userId,
    shipmentType,
    itemType,
}: logisticsServiceTypeListing) => {
    try {
        const res: SuccessGenericResponse<IServiceTypeListingResponse> = await ApiClient.get(
            `${userType}/${userId}/travel/logistics/fetch-service-type`,
            {
                params: {
                    shipmentType: shipmentType || '',
                    itemType: itemType || '',
                },
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const calculateRate = async ({ userType, userId, ...payload }: calculateRatePayload) => {
    try {
        const res: SuccessGenericResponse<ICalculateRateResponse> = await ApiClient.post(
            `${userType}/${userId}/travel/logistics/calculateRate`,
            payload
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const logisticsPayment = async ({ userType, userId, ...payload }: calculateRatePayload) => {
    try {
        const res: SuccessGenericResponse<PaymentLogisticsPayload> = await ApiClient.post(
            `${userType}/${userId}/travel/logistics/payment`,
            payload
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const trackShipment = async ({ userType, userId, trackingNumber }: trackShipmentPayload) => {
    try {
        const res: SuccessGenericResponse<ITrackShipmentResponse> = await ApiClient.post(
            `${userType}/${userId}/travel/logistics/trackShipments`,
            {
                shipments: [trackingNumber],
                lastTrackingUpdate: true,
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};

export const getTransactionsApi = async (payload: TransactionsRequestPayload) => {
    try {
        const res: SuccessGenericResponse<TransactionsResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/logistics/orders`,
            {
                params: {
                    sort: payload.sort,
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                    searchText: payload.search,
                    from: payload.from,
                    to: payload.to,
                },
            }
        );
        const { data } = res;
        return data;
    } catch (error) {
        return false;
    }
};
