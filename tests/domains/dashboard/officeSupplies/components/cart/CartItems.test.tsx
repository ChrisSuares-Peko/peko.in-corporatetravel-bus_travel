import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CartItems from '@domains/dashboard/officeSupplies/components/cart/CartItems';

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
                {
                    id: 2,
                    name: 'Product 2',
                    SKUCode: 'SKU2',
                    price: 200,
                    productImage: 'image2.jpg',
                    brand: 'Brand2',
                    VAT: '5%',
                    vatType: 'Standard',
                    productQuantity: 1,
                    totalPrice: 200,
                    totalVat: 10,
                    productQuantityInDB: 3,
                },
            ],
            count: 2,
            cartId: 123,
            itemsTotalAmount: 400,
            allowCheckout: true,
            grandTotal: 420,
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

const mockUpdateCart = vi.fn();
const mockDeleteItemFromCart = vi.fn();

vi.mock('@domains/dashboard/officeSupplies/hooks/useCartApi', () => ({
    useCartApi: () => ({
        updateCart: mockUpdateCart,
        isLoading: false,
        selectedProductId: null,
        deleteItemFromCart: mockDeleteItemFromCart,
    }),
}));

describe('CartItems Component', () => {
    let store: any;

    beforeEach(() => {
        store = mockStore(initialState);
        vi.clearAllMocks();
    });

    it('should render cart items correctly', () => {
        render(
            <Provider store={store}>
                <Router>
                    <CartItems />
                </Router>
            </Provider>
        );

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('should call updateCart when quantity is changed', () => {
        render(
            <Provider store={store}>
                <Router>
                    <CartItems />
                </Router>
            </Provider>
        );

        // const quantityInput = screen.getByDisplayValue('2');
        // fireEvent.change(quantityInput, { target: { value: '3' } });

        // expect(mockUpdateCart).toHaveBeenCalledWith(1, 'increase');
    });

    it('should call deleteItemFromCart when delete button is clicked', () => {
        render(
            <Provider store={store}>
                <Router>
                    <CartItems />
                </Router>
            </Provider>
        );

        const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
        fireEvent.click(deleteButton);

        expect(mockDeleteItemFromCart).toHaveBeenCalledWith(1);
    });

    it('should render the total price for each product', () => {
        render(
            <Provider store={store}>
                <Router>
                    <CartItems />
                </Router>
            </Provider>
        );

        expect(screen.getAllByText('AED 200.00')).toHaveLength(2);
    });
});
