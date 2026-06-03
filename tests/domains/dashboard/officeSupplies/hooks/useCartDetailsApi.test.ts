import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getCartDetailsApi } from '@domains/dashboard/officeSupplies/api/cart';
import { useCartDetailsApi } from '@domains/dashboard/officeSupplies/hooks/useCartDetailsApi';
import { setData } from '@domains/dashboard/officeSupplies/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/api/cart', () => ({
    getCartDetailsApi: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/slices/cartSlice', () => ({
    setData: vi.fn(),
}));

describe('useCartDetailsApi', () => {
    const mockDispatch = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch cart details and dispatch setData action successfully', async () => {
        const mockResponse: any = {
            items: [
                {
                    id: 1,
                    name: 'Product 1',
                    SKUCode: 'SKU123',
                    price: 100,
                    productImage: 'image_url',
                    brand: 'Brand Name',
                    quantity: 1,
                    category: 'Category Name',
                    description: 'Product Description',
                    // Add all other required properties here
                },
            ],
        };
        (getCartDetailsApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCartDetailsApi());

        await act(async () => {
            await result.current.getCartDetails();
        });

        expect(getCartDetailsApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
        });
        expect(mockDispatch).toHaveBeenCalledWith(setData(mockResponse));
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure and set isLoading to false', async () => {
        (getCartDetailsApi as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useCartDetailsApi());

        await act(async () => {
            await result.current.getCartDetails();
        });

        expect(getCartDetailsApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
        });
        expect(mockDispatch).not.toHaveBeenCalledWith(setData(expect.anything()));
        expect(result.current.isLoading).toBe(false);
    });
});
