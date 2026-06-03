import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import CustomerModal from '@domains/dashboard/Invoice/components/customers/CustomerModal';
import { useCustomerAdd } from '@domains/dashboard/Invoice/hooks/useCustomerAdd';
import { useCorporates } from '@domains/dashboard/Invoice/hooks/useGetCorporates';

vi.mock('@domains/dashboard/Invoice/hooks/useCustomerAdd', () => ({
    useCustomerAdd: vi.fn(),
}));

vi.mock('@domains/dashboard/Invoice/hooks/useGetCorporates', () => ({
    useCorporates: vi.fn(),
}));

const mockStore = configureStore([]);
let store: any;

describe('CustomerModal Component', () => {
    beforeEach(() => {
        store = mockStore({
            reducer: {
                user: { user: { id: 1, name: 'Test User' } },
            },
        });

        (useCustomerAdd as any).mockReturnValue({
            customerAdd: vi.fn().mockResolvedValue(true),
            customerUpdate: vi.fn().mockResolvedValue(true),
        });

        (useCorporates as any).mockReturnValue({
            tableData: [
                {
                    value: 1,
                    label: 'Corporate 1',
                    email: 'corp1@example.com',
                    mobileNo: '1234567890',
                },
                {
                    value: 2,
                    label: 'Corporate 2',
                    email: 'corp2@example.com',
                    mobileNo: '0987654321',
                },
            ],
        });
    });

    it('renders the component correctly', () => {
        render(
            <Provider store={store}>
                <CustomerModal open handleCancel={vi.fn()} setRefresh={vi.fn()} />
            </Provider>
        );

        expect(screen.getByText('Add Customer')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Customer Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Email ID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Mobile Number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter TRN Number')).toBeInTheDocument();
    });

    it('allows searching and selecting a corporate', async () => {
        render(
            <Provider store={store}>
                <CustomerModal open handleCancel={vi.fn()} setRefresh={vi.fn()} />
            </Provider>
        );

        const selectInput = screen.getByLabelText('Select user');
        fireEvent.mouseDown(selectInput);

        fireEvent.change(selectInput, { target: { value: 'Corporate 1' } });

        await waitFor(() => {
            expect(screen.getByText('Corporate 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Corporate 1'));
    });

    it('updates the form if data is passed in', () => {
        const data: any = {
            id: 1,
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            phoneNumber: '9876543210',
            address: '456 Elm St',
            trnNo: '987654321',
        };

        render(
            <Provider store={store}>
                <CustomerModal open handleCancel={vi.fn()} setRefresh={vi.fn()} data={data} />
            </Provider>
        );

        expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('jane.doe@example.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('9876543210')).toBeInTheDocument();
        expect(screen.getByDisplayValue('456 Elm St')).toBeInTheDocument();
        expect(screen.getByDisplayValue('987654321')).toBeInTheDocument();
    });
});
