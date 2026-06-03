import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    GetIFrameURLPayload,
    GetRedirectURLRes,
    OrderHistoryRequestPayload,
    OrderHistoryResponse,
} from '../types/types';

export const getRedirectURL = async (payload: GetIFrameURLPayload) => {
    try {
        const resp: SuccessGenericResponse<GetRedirectURLRes> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/insurance/journey-integration-url?redirectType=${payload.redirectType}&landingUrl=${payload?.landingUrl}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getOrderHistoryApi = async (payload: OrderHistoryRequestPayload) => {
    try {
        const { userId, userType, page, pageSize, searchText } = payload;
        const params = {
            searchText,
            page,
            pageSize,
        };
        const resp: SuccessGenericResponse<OrderHistoryResponse> = await ApiClient.get(
            `${userType}/${userId}/purchase/insurance/find-all`,
            { params }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
