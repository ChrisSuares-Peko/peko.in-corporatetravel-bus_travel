import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { useCartDetailsApi } from './useCartDetailsApi';
import { addToCartApi, deleteFromCartApi, updateCartApi } from '../api/cart';
import {
    AddToCartRequestResponse,
    DeleteFromCartResponse,
    updateFromCartResponse,
} from '../types/cartTypes';

export function useCartApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number>();

    const { getCartDetails } = useCartDetailsApi();

    const buyNow = async (productId: number, productQuantity: number) => {
        setSelectedProductId(productId);
        setLoading(true);
        const data: AddToCartRequestResponse | false = await addToCartApi({
            userId: id,
            userType: role,
            productId,
            productQuantity,
        });
        if (data) {
            getCartDetails();
            const cartStatus = data as AddToCartRequestResponse;
            if (cartStatus.status === 'added') {
                setIsLoading(false);
                return true;
            }
            if (cartStatus.status === 'updated') {
                setLoading(false);
                return true;
            }
            setLoading(false);
            return false;
        }
        setLoading(false);
        return false;
    };

    const addToCart = async (productId: number, productQuantity: number) => {
        setSelectedProductId(productId);
        setIsLoading(true);
        const data: AddToCartRequestResponse | false = await addToCartApi({
            userId: id,
            userType: role,
            productId,
            productQuantity,
        });
        if (data) {
            getCartDetails();
            const cartStatus = data as AddToCartRequestResponse;
            if (cartStatus.status === 'added') {
                dispatch(
                    showToast({
                        description: 'Product successfully added to cart',
                        variant: 'success',
                    })
                );
            } else if (cartStatus.status === 'updated') {
                dispatch(
                    showToast({
                        description: 'Product successfully updated in cart',
                        variant: 'success',
                    })
                );
            } else {
                dispatch(
                    showToast({
                        description: 'Failed to add product to cart. Please try again later.',
                        variant: 'error',
                    })
                );
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    const deleteItemFromCart = async (productId: number) => {
        setSelectedProductId(productId);
        setIsLoading(true);
        const data: DeleteFromCartResponse | false = await deleteFromCartApi({
            userId: id,
            userType: role,
            productId,
        });
        if (data) {
            dispatch(
                showToast({ description: 'Product removed successfully', variant: 'success' })
            );
            getCartDetails();
        } else {
            setIsLoading(false);
        }
    };

    const updateCart = async (productId: number, operation: string) => {
        setSelectedProductId(productId);
        setIsLoading(true);
        const data: updateFromCartResponse | false = await updateCartApi({
            userId: id,
            userType: role,
            productId,
            operation,
            productQuantity: 1,
        });
        if (data) {
            getCartDetails();
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        selectedProductId,
        addToCart,
        deleteItemFromCart,
        updateCart,
        buyNow,
        loading,
    };
}
