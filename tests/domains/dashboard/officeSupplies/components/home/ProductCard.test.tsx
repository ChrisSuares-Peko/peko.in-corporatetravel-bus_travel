import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, vi } from 'vitest';

import ProductListing from '@domains/dashboard/officeSupplies/components/home/ProductListing';
import { useProductsApi } from '@domains/dashboard/officeSupplies/hooks/useProductsApi';
import cartReducer from '@domains/dashboard/officeSupplies/slices/cartSlice';

const rootReducer = combineReducers({
    cart: cartReducer,
});

const mockStore = configureStore({
    reducer: rootReducer,
});

vi.mock('@domains/dashboard/officeSupplies/hooks/useProductsApi', () => ({
    useProductsApi: vi.fn(),
}));

vi.mock('@domains/dashboard/officeSupplies/components/Filters', () => ({
    __esModule: true,
    default: vi.fn(() => <div>Mock Filters</div>),
}));

vi.mock('@domains/dashboard/officeSupplies/components/ProductCard', () => ({
    __esModule: true,
    default: vi.fn(() => <div>Mock ProductCard</div>),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn().mockReturnValue({
        cart: {
            items: [
                {
                    id: 1,
                    name: 'Product 1',
                    price: 100,
                    productQuantity: 2,
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
        },
    }),
}));

describe('ProductListing Component', () => {
    const mockSetSearchText = vi.fn();
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
                <MemoryRouter>
                    <ProductListing {...defaultProps} />
                </MemoryRouter>
            </Provider>
        );
    });

    it('should render no products message when no products are available', () => {
        (useProductsApi as any).mockReturnValue({
            data: [],
            isLoading: false,
            count: 0,
        });

        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <ProductListing {...defaultProps} />
                </MemoryRouter>
            </Provider>
        );
    });

    it('should render product cards when products are available', () => {
        (useProductsApi as any).mockReturnValue({
            data: [
                { id: 1, name: 'Product 1', price: 100 },
                { id: 2, name: 'Product 2', price: 200 },
            ],
            isLoading: false,
            count: 2,
        });

        render(
            <Provider store={mockStore}>
                <MemoryRouter>
                    <ProductListing {...defaultProps} />
                </MemoryRouter>
            </Provider>
        );
    });

    // it('should handle pagination correctly', async () => {
    //     (useProductsApi as any).mockReturnValue({
    //         data: [
    //             { id: 1, name: 'Product 1', price: 100 },
    //             { id: 2, name: 'Product 2', price: 200 },
    //         ],
    //         isLoading: false,
    //         count: 2,
    //     });

    //     render(
    //         <Provider store={mockStore}>
    //             <MemoryRouter>
    //                 <ProductListing {...defaultProps} />
    //             </MemoryRouter>
    //         </Provider>
    //     );

    //     await waitFor(() => {
    //         expect(mockSetSearchText).toHaveBeenCalled();
    //     });
    // });
});
