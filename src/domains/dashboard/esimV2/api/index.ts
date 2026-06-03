import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { PostData } from '../types';
import { DeviceList } from '../types/compatibleDeviceType';
import { DataOptions, PlanData, countryList } from '../types/eSIM';
import { EsimOrderDetails, OrderDetailsPayload } from '../types/orderDetails';
import { ordersList, OrdersListPayload } from '../types/ordersList';
import { PackageList, PackageListPayload } from '../types/packagesList';
import { TopUpPayload, TopUpPlanList } from '../types/TopUp';

export const getCountriesApi = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<countryList[]> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/eSIM/countries`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getPlans = async (payload: UserPayload & countryList) => {
    try {
        const country = payload.country || 'United Arab Emirates, Basic (tau)';
        const resp: SuccessGenericResponse<DataOptions> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/eSIM/plans/${country}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getPlanDetails = async (payload: UserPayload & PostData) => {
    try {
        const resp: SuccessGenericResponse<PlanData> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/purchase/eSIM/planDetails`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

//
export const getCompatibleDeviceList = async (payload: UserPayload) => {
    try {
        const resp: SuccessGenericResponse<DeviceList> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/eSIM/compatibleDevice`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getPackagesList = async (payload: PackageListPayload) => {
    try {
        const resp: SuccessGenericResponse<PackageList> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/eSIM/packages?type=${payload.esimType}&country=${payload.countryCode}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getOrdersList = async (payload: OrdersListPayload) => {
    try {
        const resp: SuccessGenericResponse<ordersList> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/eSIM/packageList`,
            {
                params: {
                    searchText: payload.searchText,
                    sort: 'DESC',
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                },
            }
        );

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getOrderDetails = async (payload: OrderDetailsPayload) => {
    try {
        const resp: SuccessGenericResponse<EsimOrderDetails> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/eSIM/packages/details?orderId=${payload.orderId}&iccid=${payload.iccid}`
        );

        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getTopUpPackagesList = async (payload: TopUpPayload) => {
    try {
        const resp: SuccessGenericResponse<TopUpPlanList> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/travel/eSIM/topup/plans/${payload.iccid}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
