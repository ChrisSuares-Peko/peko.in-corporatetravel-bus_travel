import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { ApiResponse } from '../types';

export const getESROrderHistory = async (payload: any) => {
    try {
        const resp: SuccessGenericResponse<ApiResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/esr/orderHistory`,
            {
                params: {
                    sort: payload.sort,
                    page: payload.page,
                    itemsPerPage: payload.itemsPerPage,
                    searchText: payload.searchText,
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
