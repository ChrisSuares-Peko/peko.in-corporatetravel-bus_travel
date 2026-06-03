import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import {
    addToCartApi,
    deleteFromCartApi,
    updateCartApi,
} from '@domains/dashboard/officeSupplies/api/cart';
import { useCartApi } from '@domains/dashboard/officeSupplies/hooks/useCartApi';
import { useCartDetailsApi } from '@domains/dashboard/officeSupplies/hooks/useCartDetailsApi';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/api/cart', () => ({
    addToCartApi: vi.fn(),
    deleteFromCartApi: vi.fn(),
    updateCartApi: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/hooks/useCartDetailsApi', () => ({
    useCartDetailsApi: vi.fn(),
}));
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useCartApi', () => {
    const mockDispatch = vi.fn();
    const mockGetCartDetails = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useCartDetailsApi as any).mockReturnValue({ getCartDetails: mockGetCartDetails });
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should add a product to the cart successfully and show a success toast', async () => {
        const mockResponse = { status: 'added' };
        (addToCartApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCartApi());

        await act(async () => {
            await result.current.addToCart(1, 2);
        });

        expect(addToCartApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            productId: 1,
            productQuantity: 2,
        });
        expect(mockGetCartDetails).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Product successfully added to cart',
                variant: 'success',
            })
        );
        expect(result.current.isLoading).toBe(false);
    });

    it('should update a product in the cart and show a success toast', async () => {
        const mockResponse = { status: 'updated' };
        (addToCartApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCartApi());

        await act(async () => {
            await result.current.addToCart(1, 2);
        });

        expect(addToCartApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            productId: 1,
            productQuantity: 2,
        });
        expect(mockGetCartDetails).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Product successfully updated in cart',
                variant: 'success',
            })
        );
        expect(result.current.isLoading).toBe(false);
    });

    // it('should handle failure to add a product to the cart and show an error toast', async () => {
    //     // Mocking the API to return false, simulating a failure
    //     (addToCartApi as any).mockResolvedValueOnce(false);

    //     const { result } = renderHook(() => useCartApi());

    //     await act(async () => {
    //         await result.current.addToCart(1, 2);
    //     });

    //     expect(addToCartApi).toHaveBeenCalledWith({
    //         userId: '123',
    //         userType: 'user',
    //         productId: 1,
    //         productQuantity: 2,
    //     });

    //     // Expect dispatch to be called with the correct error message
    //     expect(mockDispatch).toHaveBeenCalledWith(
    //         showToast({
    //             description: 'Failed to add product to cart. Please try again later.',
    //             variant: 'error',
    //         })
    //     );

    //     expect(result.current.isLoading).toBe(false);
    // });

    it('should delete a product from the cart successfully and show a success toast', async () => {
        const mockResponse = { success: true };
        (deleteFromCartApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCartApi());

        await act(async () => {
            await result.current.deleteItemFromCart(1);
        });

        expect(deleteFromCartApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            productId: 1,
        });
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({ description: 'Product removed successfully', variant: 'success' })
        );
        expect(result.current.isLoading).toBe(true);
    });

    it('should update the cart successfully', async () => {
        const mockResponse = { success: true };
        (updateCartApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCartApi());

        await act(async () => {
            await result.current.updateCart(1, 'increment');
        });

        expect(updateCartApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            productId: 1,
            operation: 'increment',
            productQuantity: 1,
        });
        expect(mockGetCartDetails).toHaveBeenCalled();
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle the buy now functionality', async () => {
        const mockResponse = { status: 'added' };
        (addToCartApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCartApi());

        await act(async () => {
            const success = await result.current.buyNow(1, 2);
            expect(success).toBe(true);
        });

        expect(addToCartApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            productId: 1,
            productQuantity: 2,
        });
        expect(mockGetCartDetails).toHaveBeenCalled();
        expect(result.current.loading).toBe(true);
    });
});
