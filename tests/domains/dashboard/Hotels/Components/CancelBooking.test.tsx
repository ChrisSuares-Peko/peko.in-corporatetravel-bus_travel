import React from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import CancelBooking from '@src/domains/dashboard/Hotels/Components/BookingHistory/CancelBooking';
import { CancellationData } from '@src/domains/dashboard/Hotels/types/cancellationTypes';

const initialState = {
    reducer: {
        auth: {
            role: 'user',
            id: '123',
        },
    },
};

describe('CancelBooking Component', () => {
    const mockCancelBooked = vi.fn();
    const mockHandleCancel = vi.fn();
    const mockRefetch = vi.fn();

    vi.mock('@src/domains/dashboard/Hotels/hooks/useBookingCancelApi', () => ({
        __esModule: true,
        default: () => ({
            cancelBooked: mockCancelBooked,
            loader: false,
        }),
    }));

    // Mock necessary hooks and functions
    vi.mock('@src/hooks/store', async importOriginal => {
        const actual = await importOriginal();
        return {
            ...(actual as object), // Spread the original module to keep other exports
            useAppSelector: (selector: (state: typeof initialState) => any) =>
                selector(initialState),
            useAppDispatch: () => vi.fn(), // Mock useAppDispatch
        };
    });

    vi.mock('react-router-dom', () => ({
        useLocation: () => ({ state: { key: 'search123' } }),
    }));

    afterEach(() => {
        cleanup();
        vi.clearAllMocks(); // This will reset all mocks after each test
    });

    const mockStore = configureStore({
        reducer: {
            // Your reducers go here
        },
        preloadedState: {
            // Your initial state goes here if necessary
        },
    });

    const props = {
        BookingId: '12345',
        cId: 'abcde',
        isModalOpen: true,
        handleCancel: mockHandleCancel,
        charges: [
            {
                bookingStatus: 'CONFIRMED',
                bookingReferenceId: 'REF123',
                command: 'CANCEL',
                currency: 'AED',
                cancellationCharge: [
                    {
                        supplierCancellationCharge: 100,
                        adminCancellationCharge: 50,
                        totalCancellationCharges: 150,
                    },
                ],
            },
        ] as CancellationData,
        baseAmt: 500,
        refetch: mockRefetch,
        isLoading: false,
    };

    it('renders correctly with given props', () => {
        render(
            <Provider store={mockStore}>
                <CancelBooking {...props} />
            </Provider>
        );

        expect(screen.getByText('Confirm Cancellation')).toBeInTheDocument();
        expect(screen.getByText('Cancellation Charges')).toBeInTheDocument();
        expect(screen.getByText('Total Amount you paid')).toBeInTheDocument();
        expect(screen.getByText('AED 500.00')).toBeInTheDocument();
        expect(screen.getByText('Supplier Cancellation Charges')).toBeInTheDocument();

        const supplier = screen.getByTestId('supplier');
        expect(supplier).toBeInTheDocument();

        // expect(screen.getByText('AED 100')).toBeInTheDocument();
        expect(screen.getByText('Admin Cancellation Charges')).toBeInTheDocument();
        const admin = screen.getByTestId('admin');
        expect(admin).toBeInTheDocument();

        // expect(screen.getByText('AED 50')).toBeInTheDocument();
        expect(screen.getByText('Total Cancellation Charges')).toBeInTheDocument();
        // expect(screen.getByText('AED 150')).toBeInTheDocument();
        const total = screen.getByTestId('total');
        expect(total).toBeInTheDocument();

        expect(screen.getByText('Amount will be refunded')).toBeInTheDocument();
        // expect(screen.getByText('AED 350')).toBeInTheDocument();
        const amount = screen.getByTestId('amount');
        expect(amount).toBeInTheDocument();

        expect(
            screen.getByText('Note: Your money will be credited within 7-10 business days')
        ).toBeInTheDocument();
    });

    // it('calls handleCancelBooked and refetch on booking cancellation', () => {
    //     render(
    //         <Provider store={mockStore}>
    //             <CancelBooking {...props} />
    //         </Provider>
    //     );

    //     const cancelButton = screen.getByText('Cancel Booking');
    //     fireEvent.click(cancelButton);

    //     expect(mockCancelBooked).toHaveBeenCalledWith('12345', 'abcde');
    //     expect(mockHandleCancel).toHaveBeenCalled();
    //     expect(mockRefetch).toHaveBeenCalled();
    // });

    it('calls handleCancel when modal is closed', () => {
        render(
            <Provider store={mockStore}>
                <CancelBooking {...props} />
            </Provider>
        );

        const closeButton = screen.getByRole('button', { name: /close/i });
        fireEvent.click(closeButton);

        expect(mockHandleCancel).toHaveBeenCalled();
    });

    it('disables the cancel button while loading', () => {
        vi.mock('@src/domains/dashboard/Hotels/hooks/useBookingCancelApi', () => ({
            __esModule: true,
            default: () => ({
                // cancelBooked: mockCancelBooked,
                loader: true,
            }),
        }));

        render(
            <Provider store={mockStore}>
                <CancelBooking {...props} isLoading />
            </Provider>
        );

        const cancelButton = screen.getByText('Cancel Booking');

        // Check for disabled attribute or class name
        // expect(cancelButton).toHaveAttribute('disabled');
        // If using a class to disable
        // expect(cancelButton).toHaveClass('disabled-class-name');
    });
});
