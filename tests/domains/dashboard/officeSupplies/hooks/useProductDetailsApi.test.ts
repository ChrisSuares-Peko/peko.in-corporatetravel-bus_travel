import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getProductDetailsApi } from '@domains/dashboard/officeSupplies/api/product';
import { useProductDetailsApi } from '@domains/dashboard/officeSupplies/hooks/useProductDetailsApi';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/api/product', () => ({
    getProductDetailsApi: vi.fn(),
}));

describe('useProductDetailsApi', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    it('should fetch product details and update state on success', async () => {
        const mockResponse: any = {
            productDetails: {
                id: 1,
                brand: 'Brand A',
                name: 'Product A',
                description: 'Description of Product A',
                highlights: 'Highlights of Product A',
                SKUCode: 'SKU123',
                productImage: 'image_url',
                price: '100.00',
                vendorPrice: '90.00',
                VAT: '5.00',
                vatType: 'Percentage',
                quantity: 10,
                warranty: '1 year',
                status: true,
                discountType: 'Flat',
                discount: '10.00',
                actualPrice: '110.00',
                vendors: ['Vendor 1'],
                createdAt: '2024-08-29T12:00:00Z',
                updatedAt: '2024-08-29T12:00:00Z',
                categoryId: 1,
                category: {
                    id: 36,
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
            photos: [
                { id: 1, imageUrl: 'photo1_url', isMain: true },
                { id: 2, imageUrl: 'photo2_url', isMain: false },
            ],
            relatedProducts: {
                products: [
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
            },
        };
        (getProductDetailsApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useProductDetailsApi('12345'));

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(getProductDetailsApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            productId: '12345',
            limit: 6,
            page: 1,
        });

        expect(result.current.productDetails).toEqual(mockResponse.productDetails);
        expect(result.current.productImages).toEqual(mockResponse.photos);
        expect(result.current.relatedProducts).toEqual(mockResponse.relatedProducts.products);
        expect(result.current.isLoading).toBe(false);
    });

    it('should navigate to the office supplies index on failure', async () => {
        (getProductDetailsApi as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useProductDetailsApi('12345'));

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(getProductDetailsApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            productId: '12345',
            limit: 6,
            page: 1,
        });
        expect(mockNavigate).toHaveBeenCalledWith(`/${paths.officeSupplies.index}`);
        expect(result.current.isLoading).toBe(false);
    });
    it('should handle empty photos array gracefully', async () => {
        const mockResponse: any = {
            productDetails: {
                id: 1,
                brand: 'Brand A',
                name: 'Product A',
                description: 'Description of Product A',
                highlights: 'Highlights of Product A',
                SKUCode: 'SKU123',
                productImage: 'image_url',
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
            photos: [],
            relatedProducts: {
                products: [
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
            },
        };
        (getProductDetailsApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useProductDetailsApi('12345'));

        await act(async () => {});

        expect(getProductDetailsApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            productId: '12345',
            limit: 6,
            page: 1,
        });

        expect(result.current.productImages).toEqual([]);
        expect(result.current.relatedProducts).toEqual(mockResponse.relatedProducts.products);
        expect(result.current.isLoading).toBe(false);
    });
});
