import { SuccessGenericResponse, UserPayload } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { DeviceList } from '../types/compatibleDeviceType';
import { EsimOrderDetails, OrderDetailsPayload } from '../types/orderDetails';
import { ordersList, OrdersListPayload } from '../types/ordersList';
import { PackageList, PackageListPayload } from '../types/packagesList';
import { TopUpPayload, TopUpPlanList } from '../types/TopUp';

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
            `${payload.userType}/${payload.userId}/travel/eSIM/orderPackageList`,
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
