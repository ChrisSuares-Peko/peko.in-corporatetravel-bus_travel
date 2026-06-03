import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import {
    AddToCartRequestPayload,
    AddToCartRequestResponse,
    CartDetailsPayload,
    CartDetailsResponse,
    DeleteFromCartRequestPayload,
    DeleteFromCartResponse,
    updateCartRequestPayload,
    updateFromCartResponse,
} from '../types/cartTypes';

export const getCartDetailsApi = async (payload: CartDetailsPayload) => {
    try {
        const { userId, userType } = payload;
        const resp: SuccessGenericResponse<CartDetailsResponse> = await ApiClient.get(
            `${userType}/${userId}/purchase/ecommerce/cartDetails`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const addToCartApi = async (payload: AddToCartRequestPayload) => {
    try {
        const resp: SuccessGenericResponse<AddToCartRequestResponse> = await ApiClient.post(
            `${payload.userType}/${payload.userId}/purchase/ecommerce/addToCart`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const updateCartApi = async (payload: updateCartRequestPayload) => {
    try {
        const resp: SuccessGenericResponse<updateFromCartResponse> = await ApiClient.put(
            `${payload.userType}/${payload.userId}/purchase/ecommerce/`,
            payload
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const deleteFromCartApi = async (payload: DeleteFromCartRequestPayload) => {
    try {
        const resp: SuccessGenericResponse<DeleteFromCartResponse> = await ApiClient.delete(
            `${payload.userType}/${payload.userId}/purchase/ecommerce?productId=${payload.productId}`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
