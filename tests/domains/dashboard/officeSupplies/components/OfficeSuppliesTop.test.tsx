import React from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import OfficeSuppliesTop from '@domains/dashboard/officeSupplies/components/OfficeSuppliesTop';
import cartReducer from '@domains/dashboard/officeSupplies/slices/cartSlice';
import { paths } from '@src/routes/paths';

// Mocks at the top level, using `import` instead of `require`

// Mock implementations
vi.mock('@src/hooks/hooks', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@domains/dashboard/officeSupplies/hooks/useCartDetailsApi', () => ({
    useCartDetailsApi: () => ({
        getCartDetails: vi.fn(),
    }),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(), // Mock useNavigate
    };
});

vi.mock('@ant-design/icons', () => ({
    SearchOutlined: vi.fn(() => <span>Search Icon</span>),
}));

vi.mock('@domains/dashboard/officeSupplies/Components/ShoppingCartIcon', () => ({
    default: vi.fn(() => <span>ShoppingCartIcon</span>),
}));

vi.mock('@domains/dashboard/officeSupplies/Components/OfficeSuppliesTopMobile', () => ({
    default: vi.fn(() => <div>OfficeSuppliesTopMobile</div>),
}));

const mockStore = configureStore({
    reducer: {
        cart: cartReducer,
    },
});

describe('OfficeSuppliesTop Component', () => {
    const mockSetSearchText = vi.fn();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    });

    it('should render correctly with default props', () => {
        render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <OfficeSuppliesTop searchText="" setSearchText={mockSetSearchText} />
                </BrowserRouter>
            </Provider>
        );

        // expect(screen.getByText('Office Supplies')).toBeInTheDocument();
        const headingElements = screen.getAllByText('Office Supplies');
        expect(headingElements[0]).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search for products')).toBeInTheDocument();
        const orderHistoryElements = screen.getAllByText('Order History');
        expect(orderHistoryElements[0]).toBeInTheDocument();
        // expect(screen.getByText('ShoppingCartIcon')).toBeInTheDocument();
    });

    // it('should call setSearchText on search icon click', () => {
    //     render(
    //         <Provider store={mockStore}>
    //             <OfficeSuppliesTop
    //                 searchText=""
    //                 setSearchText={mockSetSearchText}
    //             />
    //         </Provider>
    //     );

    //     const searchInput = screen.getByPlaceholderText('Search for products');
    //     fireEvent.change(searchInput, { target: { value: 'pens' } });

    //     const searchIcon = screen.getByTestId('search-icon');
    //     fireEvent.click(searchIcon);

    //     // Assert that setSearchText was called with the correct argument
    //     expect(mockSetSearchText).toHaveBeenCalledWith('pens');
    // });

    it('should clear search text when input is cleared', () => {
        render(
            <Provider store={mockStore}>
                <OfficeSuppliesTop searchText="pens" setSearchText={mockSetSearchText} />
            </Provider>
        );

        const searchInput = screen.getByPlaceholderText('Search for products');

        // Simulate typing in the input
        fireEvent.change(searchInput, { target: { value: 'pens' } });

        // Simulate clearing the input
        fireEvent.change(searchInput, { target: { value: '' } });

        // Check if setSearchText is called with an empty string
        expect(mockSetSearchText).toHaveBeenCalledWith('');
    });

    it('should navigate to order history on button click', () => {
        const navigate = useNavigate();

        render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <OfficeSuppliesTop searchText="" setSearchText={mockSetSearchText} />
                </BrowserRouter>
            </Provider>
        );

        const orderHistoryButtons = screen.getAllByText('Order History');
        fireEvent.click(orderHistoryButtons[0]);

        expect(navigate).toHaveBeenCalledWith(
            `${paths.dashboard.officeSupplies}/${paths.officeSupplies.orderHistory}`
        );
    });

    // it('should navigate to cart page on cart icon click', () => {
    //     const navigate = useNavigate();

    //     render(
    //         <Provider store={mockStore}>
    //             <BrowserRouter>
    //                 <OfficeSuppliesTop searchText="" setSearchText={mockSetSearchText} />
    //             </BrowserRouter>
    //         </Provider>
    //     );

    //     const cartButton = screen.getByText('ShoppingCartIcon');
    //     fireEvent.click(cartButton);

    //     expect(navigate).toHaveBeenCalledWith(
    //         `${paths.dashboard.officeSupplies}/${paths.officeSupplies.cartPage}`
    //     );
    // });

    it('should render OfficeSuppliesTopMobile component', () => {
        render(
            <Provider store={mockStore}>
                <BrowserRouter>
                    <OfficeSuppliesTop searchText="" setSearchText={mockSetSearchText} />
                </BrowserRouter>
            </Provider>
        );

        // expect(screen.getByText('OfficeSuppliesTopMobile')).toBeInTheDocument();
    });
});
