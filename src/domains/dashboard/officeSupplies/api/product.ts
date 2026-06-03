import { SuccessGenericResponse } from '@customtypes/general';
import { ApiClient } from '@src/services/config';

import { CategoryListResponse, CategoryListPayload } from '../types/category';
import { ProductDetailsPayload, ProductDetailsResponse } from '../types/productDetails';
import { ProductListPayload, ProductListResponse } from '../types/products';

export const getCategoryList = async (payload: CategoryListPayload) => {
    try {
        const resp: SuccessGenericResponse<CategoryListResponse> = await ApiClient.get(
            `${payload.userType}/${payload.userId}/purchase/ecommerce/categories`
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getProductList = async (payload: ProductListPayload) => {
    try {
        const { limit, offset, userId, searchText, userType, catIds, sortBy } = payload;
        const params = { offset, limit, searchText, catIds, sortBy };
        const resp: SuccessGenericResponse<ProductListResponse> = await ApiClient.get(
            `${userType}/${userId}/purchase/ecommerce/products`,
            { params }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};

export const getProductDetailsApi = async (payload: ProductDetailsPayload) => {
    try {
        const { limit, page, userId, userType, productId } = payload;

        const params = {
            productId,
            limit,
            page,
        };

        const resp: SuccessGenericResponse<ProductDetailsResponse> = await ApiClient.get(
            `${userType}/${userId}/purchase/ecommerce/product/details`,
            { params }
        );
        const { data } = resp;
        return data;
    } catch (err) {
        return false;
    }
};
