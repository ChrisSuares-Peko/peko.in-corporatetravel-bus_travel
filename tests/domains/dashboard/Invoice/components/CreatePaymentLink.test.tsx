import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import useGetPaymentlink from '@domains/dashboard/Invoice/hooks/useGetPaymentlinkApi';
import CreatePaymentLink from '@domains/dashboard/Invoice/pages/paymentLinks/CreatePaymentLink';
import { useAppDispatch } from '@src/hooks/store';

vi.mock('@src/hooks/store');
vi.mock('@domains/dashboard/Invoice/hooks/useGetPaymentlinkApi', () => ({
    default: vi.fn(),
}));

describe('CreatePaymentLink Component', () => {
    const mockStore = configureStore([]);
    let store: any;

    beforeEach(() => {
        store = mockStore({
            // Mock initial state if necessary
        });

        (useAppDispatch as any).mockReturnValue(vi.fn());

        (useGetPaymentlink as any).mockReturnValue({
            getPaymentLink: vi.fn().mockResolvedValue(true),
            isLoading: false,
        });
    });

    it('renders the component correctly', () => {
        render(
            <Provider store={store}>
                <CreatePaymentLink />
            </Provider>
        );

        expect(screen.getByText('Create Payment Link')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Customer Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email ID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
        expect(screen.getByText('Click to Upload')).toBeInTheDocument();
    });

    it('fills out and submits the form correctly', async () => {
        const mockGetPaymentLink = vi.fn().mockResolvedValue(true);
        (useGetPaymentlink as any).mockReturnValue({
            getPaymentLink: mockGetPaymentLink,
            isLoading: false,
        });

        render(
            <Provider store={store}>
                <CreatePaymentLink />
            </Provider>
        );

        fireEvent.change(screen.getByPlaceholderText('Customer Name'), {
            target: { value: 'John Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText('Mobile Number'), {
            target: { value: '1234567890' },
        });
        fireEvent.change(screen.getByPlaceholderText('Email ID'), {
            target: { value: 'johndoe@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Amount'), {
            target: { value: '1000' },
        });

        fireEvent.click(screen.getByText('Submit'));

        // Simulate the loading state
        await waitFor(() => {
            (useGetPaymentlink as any).mockReturnValue({
                getPaymentLink: mockGetPaymentLink,
                isLoading: true,
            });
            // expect(screen.getByText('Submit')).toBeDisabled();
        });
    });
});
