import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getProductList } from '@domains/dashboard/officeSupplies/api/product';
import { useProductsApi } from '@domains/dashboard/officeSupplies/hooks/useProductsApi';
import {
    ProductListResponse,
    ProductCardProps,
} from '@domains/dashboard/officeSupplies/types/products';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/api/product', () => ({
    getProductList: vi.fn(),
}));

describe('useProductsApi', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch product list and update state on success', async () => {
        const mockResponse: ProductListResponse = {
            count: 2,
            rows: [
                {
                    id: 1,
                    brand: 'Brand A',
                    name: 'Product A',
                    description: 'Description of Product A',
                    highlights: 'Highlights of Product A',
                    SKUCode: 'SKU123',
                    productImage: 'image_url_a',
                    price: '100.00',
                    vendorPrice: '90.00',
                    VAT: '5.00',
                    vatType: 'Percentage',
                    quantity: 10,
                    warranty: '1 year',
                    status: 1,
                    discountType: 'Flat',
                    discount: '10.00',
                    actualPrice: '110.00',
                    vendors: ['Vendor 1'],
                    createdAt: '2024-08-29T12:00:00Z',
                    updatedAt: '2024-08-29T12:00:00Z',
                    categoryId: 1,
                    category: {
                        id: 1,
                        categoryName: 'Category A',
                        categoryImage: 'category_image_url',
                        categoryStatus: true,
                        createdAt: '2024-08-29T12:00:00Z',
                        updatedAt: '2024-08-29T12:00:00Z',
                        vendorId: 1,
                        vendor: {
                            id: 1,
                            vendorName: 'Vendor A',
                        },
                    },
                },
                {
                    id: 2,
                    brand: 'Brand B',
                    name: 'Product B',
                    description: 'Description of Product B',
                    highlights: 'Highlights of Product B',
                    SKUCode: 'SKU124',
                    productImage: 'image_url_b',
                    price: '200.00',
                    vendorPrice: '180.00',
                    VAT: '10.00',
                    vatType: 'Percentage',
                    quantity: 5,
                    warranty: '2 years',
                    status: 1,
                    discountType: 'Flat',
                    discount: '20.00',
                    actualPrice: '220.00',
                    vendors: ['Vendor 2'],
                    createdAt: '2024-08-29T12:00:00Z',
                    updatedAt: '2024-08-29T12:00:00Z',
                    categoryId: 2,
                    category: {
                        id: 2,
                        categoryName: 'Category B',
                        categoryImage: 'category_image_url_b',
                        categoryStatus: true,
                        createdAt: '2024-08-29T12:00:00Z',
                        updatedAt: '2024-08-29T12:00:00Z',
                        vendorId: 2,
                        vendor: {
                            id: 2,
                            vendorName: 'Vendor B',
                        },
                    },
                },
            ],
        };
        (getProductList as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useProductsApi(1, 1, 10, 'ASC', ''));

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(getProductList).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            catIds: 1,
            limit: 10,
            offset: 0,
            searchText: '',
            sortBy: 'ASC',
        });

        const expectedProducts: ProductCardProps[] = [
            {
                id: 1,
                name: 'Product A',
                category: 'Category A',
                image: 'image_url_a',
                price: '100.00',
                quantity: 10,
                actualPrice: '110.00',
                savePrice: '10.00',
            },
            {
                id: 2,
                name: 'Product B',
                category: 'Category B',
                image: 'image_url_b',
                price: '200.00',
                quantity: 5,
                actualPrice: '220.00',
                savePrice: '20.00',
            },
        ];

        expect(result.current.data).toEqual(expectedProducts);
        expect(result.current.count).toBe(2);
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure and set loading to false', async () => {
        (getProductList as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useProductsApi(null, 1, 10, 'ASC', ''));

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(result.current.data).toEqual([]);
        expect(result.current.count).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
    });

    it('should fetch product list with different filter and pagination', async () => {
        const mockResponse: ProductListResponse = {
            count: 1,
            rows: [
                {
                    id: 1,
                    brand: 'Brand A',
                    name: 'Product A',
                    description: 'Description of Product A',
                    highlights: 'Highlights of Product A',
                    SKUCode: 'SKU123',
                    productImage: 'image_url_a',
                    price: '100.00',
                    vendorPrice: '90.00',
                    VAT: '5.00',
                    vatType: 'Percentage',
                    quantity: 10,
                    warranty: '1 year',
                    status: 1,
                    discountType: 'Flat',
                    discount: '10.00',
                    actualPrice: '110.00',
                    vendors: ['Vendor 1'],
                    createdAt: '2024-08-29T12:00:00Z',
                    updatedAt: '2024-08-29T12:00:00Z',
                    categoryId: 1,
                    category: {
                        id: 1,
                        categoryName: 'Category A',
                        categoryImage: 'category_image_url',
                        categoryStatus: true,
                        createdAt: '2024-08-29T12:00:00Z',
                        updatedAt: '2024-08-29T12:00:00Z',
                        vendorId: 1,
                        vendor: {
                            id: 1,
                            vendorName: 'Vendor A',
                        },
                    },
                },
            ],
        };
        (getProductList as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useProductsApi(2, 2, 5, 'DESC', 'search text'));

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(getProductList).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            catIds: 2,
            limit: 5,
            offset: 5,
            searchText: 'search text',
            sortBy: 'DESC',
        });

        const expectedProducts: ProductCardProps[] = [
            {
                id: 1,
                name: 'Product A',
                category: 'Category A',
                image: 'image_url_a',
                price: '100.00',
                quantity: 10,
                actualPrice: '110.00',
                savePrice: '10.00',
            },
        ];

        expect(result.current.data).toEqual(expectedProducts);
        expect(result.current.count).toBe(1);
        expect(result.current.isLoading).toBe(false);
    });
});
