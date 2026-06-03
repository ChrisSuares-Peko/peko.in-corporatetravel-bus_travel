import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import OrderSummary from '@domains/dashboard/officeSupplies/components/cart/OrderSummary';

const mockStore = configureStore([]);

const initialState = {
    reducer: {
        cart: {
            items: [
                {
                    id: 1,
                    name: 'Product 1',
                    price: 100,
                    productQuantity: 2,
                    totalPrice: 200,
                    totalVat: 10,
                    productQuantityInDB: 5,
                },
            ],
            count: 1,
            itemsTotalAmount: 200,
            totalVat: 10,
            shippingCharge: 20,
            grandTotal: 230,
            freeDelivery: false,
        },
    },
};

describe('OrderSummary Component', () => {
    let store: any;
    let mockFormRef: any;

    beforeEach(() => {
        store = mockStore(initialState);
        mockFormRef = { current: { handleSubmit: vi.fn() } };
    });

    it('should render the order summary correctly', () => {
        render(
            <Provider store={store}>
                <OrderSummary formRef={mockFormRef} />
            </Provider>
        );

        expect(screen.getByText('AED 190.00')).toBeInTheDocument();
        expect(screen.getByText('AED 10.00')).toBeInTheDocument();
        expect(screen.getByText('AED 20.00')).toBeInTheDocument();
        expect(screen.getByText('AED 230.00')).toBeInTheDocument();

        const payNowButton = screen.getByRole('button', { name: /Pay Now/i });
        expect(payNowButton).toBeInTheDocument();
        expect(payNowButton).not.toBeDisabled();
    });

    it('should call handleSubmit when "Pay Now" button is clicked', () => {
        render(
            <Provider store={store}>
                <OrderSummary formRef={mockFormRef} />
            </Provider>
        );

        const payNowButton = screen.getByRole('button', { name: /Pay Now/i });
        fireEvent.click(payNowButton);

        expect(mockFormRef.current.handleSubmit).toHaveBeenCalledTimes(1);
    });

    it('should disable "Pay Now" button when cart is empty', () => {
        const emptyCartState = {
            reducer: {
                cart: {
                    ...initialState.reducer.cart,
                    count: 0,
                },
            },
        };
        store = mockStore(emptyCartState);

        render(
            <Provider store={store}>
                <OrderSummary formRef={mockFormRef} />
            </Provider>
        );

        const payNowButton = screen.getByRole('button', { name: /Pay Now/i });
        expect(payNowButton).toBeDisabled();
    });
});
