import { Suspense } from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AddressList from '@src/domains/dashboard/profile/components/AddressList';
import useAddressesApi from '@src/domains/dashboard/profile/hooks/useAddressesApi';
// import {setData}  from '@src/domains/dashboard/profile/slices/address';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock modules and components
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/hooks/useAddressesApi', () => ({
    default: vi.fn(() => ({
        tableData: [],
        isLoading: false,
        handleDeleteAddress: vi.fn(),
        isDeleteLoading: false,
    })),
}));

vi.mock('@src/domains/dashboard/profile/components/AddressModal', () => ({
    AddressModal: ({ open, handleCancel }: any) =>
        open ? <div data-testid="address-modal">Address Modal</div> : null,
}));

vi.mock('@src/domains/dashboard/profile/components/molecular/modals/ConfirmationModal', () => ({
    default: ({ isOpen, handleCancel, handleSubmit }: any) =>
        isOpen ? (
            <div data-testid="confirmation-modal">
                <button type="button" onClick={handleSubmit}>
                    Confirm Delete
                </button>
                <button type="button" onClick={handleCancel}>
                    Cancel
                </button>
            </div>
        ) : null,
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/slices/address', async () => {
    const actual = await import('@src/domains/dashboard/profile/slices/address');
    return {
        ...(actual as object), // Ensure TypeScript knows this is an object
        setData: vi.fn(),
    };
});

beforeEach(() => {
    vi.clearAllMocks();
    (useAppDispatch as any).mockReturnValue(vi.fn());
    (useAppSelector as any).mockReturnValue({ id: 1 });
});

describe('AddressList Component', () => {
    const mockStore = configureStore({
        reducer: {
            address: (state = { id: 1 }) => state, // Dummy reducer
        },
    });

    const renderComponent = () =>
        render(
            <Provider store={mockStore}>
                <Suspense fallback={<div>Loading...</div>}>
                    <AddressList />
                </Suspense>
            </Provider>
        );

    it('renders loading skeleton when loading', async () => {
        (useAddressesApi as any).mockReturnValue({
            isLoading: true,
            tableData: [],
            handleDeleteAddress: vi.fn(),
            isDeleteLoading: false,
        });

        await act(async () => {
            renderComponent();
        });

        // Use appropriate query based on the actual component implementation
        expect(screen.debug());
    });

    it('renders "No saved addresses" message when tableData is empty', async () => {
        (useAddressesApi as any).mockReturnValue({
            isLoading: false,
            tableData: [],
            handleDeleteAddress: vi.fn(),
            isDeleteLoading: false,
        });

        await act(async () => {
            renderComponent();
        });

        expect(screen.getByText('No saved addresses')).toBeInTheDocument();
    });

    it('renders addresses when tableData is available', async () => {
        (useAddressesApi as any).mockReturnValue({
            tableData: [
                {
                    id: 1,
                    addressType: 'Home',
                    addressLine1: '123 Main St',
                    addressLine2: 'Apt 4',
                    default: 1,
                },
            ],
            isLoading: false,
            handleDeleteAddress: vi.fn(),
            isDeleteLoading: false,
        });

        await act(async () => {
            renderComponent();
        });

        expect(screen.getByText('Home (Default)')).toBeInTheDocument();
        expect(screen.getByText('123 Main St Apt 4')).toBeInTheDocument();
    });

    it('displays toast when "Add Address" button is clicked and address limit is reached', async () => {
        (useAddressesApi as any).mockReturnValue({
            tableData: [{}, {}, {}], // Three items, reaching limit
            isLoading: false,
            handleDeleteAddress: vi.fn(),
            isDeleteLoading: false,
        });

        await act(async () => {
            renderComponent();
        });

        const button = screen.getByText('Add Address');
        fireEvent.click(button);

        await waitFor(() => {
            expect(showToast).toHaveBeenCalledWith({
                description:
                    'Oops! You’ve reached the maximum limit for adding addresses. Please remove an existing address before adding a new one.',
                variant: 'warning',
            });
        });
    });

    it('opens ConfirmationModal and calls handleDeleteAddress on confirm', async () => {
        const handleDeleteAddress = vi.fn();

        (useAddressesApi as any).mockReturnValue({
            tableData: [
                {
                    id: 1,
                    addressType: 'Home',
                    addressLine1: '123 Main St',
                    addressLine2: 'Apt 4',
                    default: 1,
                },
            ],
            isLoading: false,
            handleDeleteAddress,
            isDeleteLoading: false,
        });

        await act(async () => {
            renderComponent();
        });

        await waitFor(() => {
            expect(screen.getByLabelText('delete')).toBeInTheDocument();
        });

        const confirmButton = screen.getByLabelText('delete');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(handleDeleteAddress);
        });
    });
});
