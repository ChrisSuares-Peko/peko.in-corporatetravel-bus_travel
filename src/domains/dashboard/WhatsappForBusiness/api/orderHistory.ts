import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { FetchOrdersResponse } from '../types/orderHistory';
import { orderPayload } from '../types/types';

export const fetchOrders = async (payload: orderPayload) => {
    try {
        const endpoint = `${payload.userType}/${payload.userId}/officeAndBusiness/whatsapp-business/orders-history?searchText=${payload.searchText}&page=${payload.page}&pageSize=${payload.pageSize}`;
        const response: SuccessGenericResponse<FetchOrdersResponse> = await ApiClient.get(endpoint);
        return response.data; // Assuming the API response has a 'data' field with order details and pagination info
    } catch (err) {
        console.error('Failed to fetch orders:', err);
        return false;
    }
};
