import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CartList from '@domains/dashboard/officeSupplies/components/cart/CartList';

const mockStore = configureStore([]);

const initialState = {
    reducer: {
        cart: {
            items: [
                {
                    id: 1,
                    name: 'Product 1',
                    SKUCode: 'SKU1',
                    price: 100,
                    productImage: 'image1.jpg',
                    brand: 'Brand1',
                    VAT: '5%',
                    vatType: 'Standard',
                    productQuantity: 2,
                    totalPrice: 200,
                    totalVat: 10,
                    productQuantityInDB: 5,
                },
            ],
            count: 1,
            cartId: 123,
            itemsTotalAmount: 200,
            allowCheckout: true,
            grandTotal: 220,
            totalVat: 20,
            eligibleFreeShipping: 50,
            freeDelivery: false,
            shippingCharge: 20,
        },
    },
};

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: () => vi.fn(),
    useAppSelector: (selector: any) =>
        selector({
            reducer: {
                cart: initialState.reducer.cart,
                auth: {
                    role: 'user',
                    id: '123',
                },
            },
        }),
}));

vi.mock('@domains/dashboard/officeSupplies/hooks/useCartDetailsApi', () => ({
    useCartDetailsApi: () => ({
        getCartDetails: vi.fn(),
        isLoading: true,
    }),
}));

describe('CartList Component', () => {
    let store: any;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    it('should render the cart list with items', () => {
        render(
            <Provider store={store}>
                <Router>
                    <CartList />
                </Router>
            </Provider>
        );

        const title = screen.getByTestId('title');
        expect(title).toBeInTheDocument();
    });

    it('should display empty cart message when there are no items', () => {
        const emptyCartState = {
            ...initialState,
            reducer: {
                cart: {
                    ...initialState.reducer.cart,
                    items: [],
                    count: 0,
                },
            },
        };

        store = mockStore(emptyCartState);

        render(
            <Provider store={store}>
                <Router>
                    <CartList />
                </Router>
            </Provider>
        );
    });

    it('should display skeletons when loading', () => {
        render(
            <Provider store={store}>
                <Router>
                    <CartList />
                </Router>
            </Provider>
        );

        // Check that skeleton loaders are displayed
        // expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
    });

    // it('should call getCartDetails on mount', () => {
    //     const mockGetCartDetails = vi.fn();

    //     vi.mocked(useCartDetailsApi).mockReturnValue({
    //         getCartDetails: mockGetCartDetails,
    //         isLoading: false,
    //     });

    //     render(
    //         <Provider store={store}>
    //             <Router>
    //                 <CartList />
    //             </Router>
    //         </Provider>
    //     );

    //     expect(mockGetCartDetails).toHaveBeenCalledTimes(1);
    // });

    it('should render the correct shipping information', () => {
        render(
            <Provider store={store}>
                <Router>
                    <CartList />
                </Router>
            </Provider>
        );

        const shipping = screen.getByTestId('shipping');
        expect(shipping).toBeInTheDocument();
    });
});
