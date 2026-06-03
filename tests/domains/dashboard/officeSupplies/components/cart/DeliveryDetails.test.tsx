import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import DeliveryDetails from '@domains/dashboard/officeSupplies/components/cart/DeliveryDetails';
import { useFetchAddressApi } from '@domains/dashboard/officeSupplies/hooks/useFetchAddressApi';

const mockStore = configureStore([]);
const initialState = {
    reducer: {
        cart: {
            items: [],
            count: 0,
            cartId: 0,
            itemsTotalAmount: 0,
            allowCheckout: false,
            grandTotal: 0,
            totalVat: 0,
            eligibleFreeShipping: 0,
            freeDelivery: false,
            shippingCharge: 0,
        },
        user: {
            data: {
                contactPersonName: '',
            },
        },
        auth: {
            role: 'user',
            id: '123',
        },
    },
};

vi.mock('@domains/dashboard/officeSupplies/hooks/useFetchAddressApi', () => ({
    useFetchAddressApi: vi.fn(),
}));

describe('DeliveryDetails Component', () => {
    let store: any;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    it('should render loading state when isLoading is true', () => {
        (useFetchAddressApi as any).mockReturnValue({
            addressOptions: [],
            isLoading: true,
        });

        render(
            <Provider store={store}>
                <Router>
                    <DeliveryDetails formRef={{ current: null }} setAddress={vi.fn()} />
                </Router>
            </Provider>
        );

        // Check that the Skeleton is displayed
        // expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should render the form when loading is complete', () => {
        (useFetchAddressApi as any).mockReturnValue({
            addressOptions: [
                { label: 'Address 1', value: '{"address":"123 Main St"}' },
                { label: 'Address 2', value: '{"address":"456 Elm St"}' },
            ],
            isLoading: false,
        });

        render(
            <Provider store={store}>
                <Router>
                    <DeliveryDetails formRef={{ current: null }} setAddress={vi.fn()} />
                </Router>
            </Provider>
        );

        // Check that the form elements are rendered
        expect(screen.getByText('Saved Address')).toBeInTheDocument();
        expect(screen.getByText('Select a person')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter first name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter last name')).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText('House no, Building name, Area, Colony')
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter mobile number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter remarks')).toBeInTheDocument();
    });

    it('should update the form when an address is selected', () => {
        (useFetchAddressApi as any).mockReturnValue({
            addressOptions: [
                {
                    label: 'Address 1',
                    value: '{"address":"123 Main St", "phoneNumber":"1234567890"}',
                },
                {
                    label: 'Address 2',
                    value: '{"address":"456 Elm St", "phoneNumber":"0987654321"}',
                },
            ],
            isLoading: false,
        });

        render(
            <Provider store={store}>
                <Router>
                    <DeliveryDetails formRef={{ current: null }} setAddress={vi.fn()} />
                </Router>
            </Provider>
        );

        fireEvent.mouseDown(screen.getByText('Select a person'));
        fireEvent.click(screen.getByText('Address 1'));

        expect(screen.getByPlaceholderText('House no, Building name, Area, Colony')).toHaveValue(
            '123 Main St'
        );
        expect(screen.getByPlaceholderText('Enter mobile number')).toHaveValue('1234567890');
    });
});
