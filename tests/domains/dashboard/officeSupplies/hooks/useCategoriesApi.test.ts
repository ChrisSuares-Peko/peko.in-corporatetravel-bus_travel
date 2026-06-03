import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getCategoryList } from '@domains/dashboard/officeSupplies/api/product';
import { useCategoriesApi } from '@domains/dashboard/officeSupplies/hooks/useCategoriesApi';
import { CategoryListResponse } from '@domains/dashboard/officeSupplies/types/category';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/api/product', () => ({
    getCategoryList: vi.fn(),
}));

describe('useCategoriesApi', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch categories and set loading to false after success', async () => {
        const mockResponse: CategoryListResponse = {
            data: [
                {
                    id: 1,
                    categoryName: 'Category 1', // Correct property name
                    categoryImage: 'image_url_1',
                    categoryStatus: true,
                    createdAt: '2024-08-29T12:00:00Z',
                    updatedAt: '2024-08-29T12:00:00Z',
                    vendorId: 1,
                    vendor: {
                        id: 1,
                        vendorName: 'Vendor 1',
                    },
                },
                {
                    id: 2,
                    categoryName: 'Category 2', // Correct property name
                    categoryImage: 'image_url_2',
                    categoryStatus: true,
                    createdAt: '2024-08-29T12:00:00Z',
                    updatedAt: '2024-08-29T12:00:00Z',
                    vendorId: 2,
                    vendor: {
                        id: 2,
                        vendorName: 'Vendor 2',
                    },
                },
            ],
        };
        (getCategoryList as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCategoriesApi());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false); // Wait for loading to be false
        });

        expect(getCategoryList).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
        });
        expect(result.current.data).toEqual(mockResponse.data);
    });

    it('should handle API failure and set loading to false', async () => {
        (getCategoryList as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useCategoriesApi());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false); // Wait for loading to be false
        });

        expect(getCategoryList).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
        });
        expect(result.current.data).toEqual([]); // Should remain an empty array on failure
    });
});
