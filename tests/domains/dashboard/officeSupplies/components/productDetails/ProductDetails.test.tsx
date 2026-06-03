import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ProductDetails from '@domains/dashboard/officeSupplies/components/productDetails/ProductDetails';
import { useCartApi } from '@domains/dashboard/officeSupplies/hooks/useCartApi';
import {
    ProductDetails as ProductDetailsType,
    ProductImage,
} from '@domains/dashboard/officeSupplies/types/productDetails';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import useScreenSize from '@src/hooks/useScreenSize';

vi.mock('@domains/dashboard/officeSupplies/hooks/useCartApi', () => ({
    useCartApi: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/hooks/useScreenSize', () => ({
    default: vi.fn(),
}));

const mockUseCartApi = {
    buyNow: vi.fn(),
    addToCart: vi.fn(),
    isLoading: false,
    loading: false,
};

(useCartApi as any).mockReturnValue(mockUseCartApi);
const mockDispatch = vi.fn();
(useAppDispatch as any).mockReturnValue(mockDispatch);
(useAppSelector as any).mockReturnValue({ items: [] });
(useScreenSize as any).mockReturnValue({ md: true });

describe('ProductDetails Component', () => {
    const mockStore = configureStore([]);
    const store = mockStore({
        reducer: {
            cart: { items: [] },
        },
    });

    const productDetails: ProductDetailsType = {
        id: 1,
        brand: 'Example Brand',
        name: 'Example Product',
        description: 'This is an example product description.',
        highlights: 'These are some example highlights.',
        SKUCode: 'EX12345',
        productImage: 'http://example.com/image.jpg',
        price: '100.00',
        vendorPrice: '90.00',
        VAT: '5%',
        vatType: 'inclusive',
        quantity: 10,
        warranty: '1 year',
        status: true,
        discountType: 'percentage',
        discount: '10%',
        actualPrice: '90.00',
        vendors: [],
        features: {},
        createdAt: '2024-08-22T00:00:00Z',
        updatedAt: '2024-08-22T00:00:00Z',
        categoryId: 36,
        category: {
            id: 36,
            categoryName: 'Example Category',
            categoryImage: 'http://example.com/category-image.jpg',
            categoryStatus: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            vendorId: 1,
        },
    };

    const productImages: ProductImage[] = [
        {
            id: 1,
            productImageUrl: 'http://example.com/image1.jpg',
            imageField: 'main',
            productId: 1,
        },
        {
            id: 2,
            productImageUrl: 'http://example.com/image2.jpg',
            imageField: 'thumbnail',
            productId: 1,
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const setup = (isLoading = false) =>
        render(
            <Provider store={store}>
                <Router>
                    <ProductDetails
                        productDetails={productDetails}
                        productImages={productImages}
                        isLoading={isLoading}
                    />
                </Router>
            </Provider>
        );

    it('renders product details correctly', () => {
        setup();
        expect(screen.getByText('Example Brand')).toBeInTheDocument();
        expect(screen.getByText('Example Product')).toBeInTheDocument();
        expect(screen.getByAltText('Example Product')).toBeInTheDocument();
    });

    it('handles add to cart functionality', async () => {
        setup();

        const addToCartButton = screen.getAllByText('Add to Cart')[1];
        fireEvent.click(addToCartButton);

        await waitFor(() => {
            expect(mockUseCartApi.addToCart).toHaveBeenCalledWith(1, 1);
        });
    });

    it('handles buy now functionality and navigates to cart page', async () => {
        setup();

        const buyNowButton = screen.getAllByText('Buy Now')[1];
        fireEvent.click(buyNowButton);

        await waitFor(() => {
            expect(mockUseCartApi.buyNow).toHaveBeenCalledWith(1, 1);
        });
    });

    it('displays loading skeleton when loading', () => {
        setup(true);
        const skeletons = screen.getAllByRole('generic');
        const skeleton = skeletons.find(el => el.classList.contains('ant-skeleton'));

        expect(skeleton).toBeInTheDocument();
        expect(skeleton).toHaveClass('ant-skeleton');
        expect(skeleton).toHaveClass('my-8');
        expect(skeleton).toHaveClass('css-dev-only-do-not-override-1rqnfsa');

        const skeletonContent = skeleton?.querySelector('.ant-skeleton-content');
        expect(skeletonContent).toBeInTheDocument();

        const skeletonTitle = skeletonContent?.querySelector('.ant-skeleton-title');
        expect(skeletonTitle).toBeInTheDocument();
        expect(skeletonTitle).toHaveStyle('width: 38%');

        const skeletonParagraph = skeletonContent?.querySelector('.ant-skeleton-paragraph');
        expect(skeletonParagraph).toBeInTheDocument();
        expect(skeletonParagraph?.children).toHaveLength(3);
        expect(skeletonParagraph?.lastElementChild).toHaveStyle('width: 61%');
    });
});
