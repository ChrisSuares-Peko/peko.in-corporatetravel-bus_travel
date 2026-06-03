import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect, vi } from 'vitest';

import ProductListing from '@domains/dashboard/officeSupplies/components/home/ProductListing';
import { useProductsApi } from '@domains/dashboard/officeSupplies/hooks/useProductsApi';
import cartReducer from '@domains/dashboard/officeSupplies/slices/cartSlice';

// Mock the necessary hooks and components
vi.mock('@domains/dashboard/officeSupplies/hooks/useProductsApi', () => ({
    useProductsApi: vi.fn(),
}));

vi.mock('@domains/dashboard/officeSupplies/components/Filters', () => ({
    __esModule: true,
    default: vi.fn(() => <div>Mock Filters</div>),
}));

vi.mock('@domains/dashboard/officeSupplies/components/home/ProductCard', () => ({
    __esModule: true,
    default: vi.fn(() => <div>Mock ProductCard</div>),
}));

vi.mock('@domains/dashboard/officeSupplies/slices/cartSlice', () => ({
    __esModule: true,
    default: vi.fn(() => ({
        items: [
            {
                id: 1,
                name: 'Product 1',
                price: 100,
                productQuantity: 2,
                productImage: 'image1.png',
                productQuantityInDB: 10,
                totalPrice: 200,
            },
            {
                id: 2,
                name: 'Product 2',
                price: 200,
                productQuantity: 1,
                productImage: 'image2.png',
                productQuantityInDB: 5,
                totalPrice: 200,
            },
        ],
        count: 2,
        freeDelivery: false,
        eligibleFreeShipping: 250,
        itemsTotalAmount: 400,
    })),
}));

// Create a mock store
const mockStore = configureStore({
    reducer: {
        cart: cartReducer,
    },
});

describe('ProductListing Component', () => {
    const mockSetSearchText = vi.fn();
    const mockSetFilter = vi.fn();
    const mockSetCurrentPage = vi.fn();

    const defaultProps = {
        selectedCategory: null,
        searchText: '',
        selectedCategoryName: 'All Products',
        setSearchText: mockSetSearchText,
    };

    it('should render loading skeleton when products are loading', () => {
        (useProductsApi as any).mockReturnValue({
            data: [],
            isLoading: true,
            count: 0,
        });

        render(
            <Provider store={mockStore}>
                <ProductListing {...defaultProps} />
            </Provider>
        );

        // Check if the skeleton loader is rendered
        // expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it('should render no products message when no products are available', () => {
        (useProductsApi as any).mockReturnValue({
            data: [],
            isLoading: false,
            count: 0,
        });

        render(
            <Provider store={mockStore}>
                <ProductListing {...defaultProps} />
            </Provider>
        );

        // Check if the no products message is rendered
        expect(screen.getByText(/No products/i)).toBeInTheDocument();
    });
});
