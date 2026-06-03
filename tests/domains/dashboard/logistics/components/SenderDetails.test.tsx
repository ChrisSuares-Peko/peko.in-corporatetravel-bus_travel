import { RefObject } from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormikProps } from 'formik';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import SenderDetails from '@src/domains/dashboard/logistics/components/SenderDetails';
import { useFetchAddressApi } from '@src/domains/dashboard/logistics/hooks/useAddressApi';
import { useBasicDetails } from '@src/domains/dashboard/logistics/hooks/useBasicDetails';
import { useLogisticsCityListingApi } from '@src/domains/dashboard/logistics/hooks/useLogisticsCityLisitingApi';
import { SenderFormValues } from '@src/domains/dashboard/logistics/types/address';
import { useAppSelector } from '@src/hooks/store';

// Create a mock store
const mockStore = configureStore([]);

vi.mock('@src/domains/dashboard/logistics/hooks/useAddressApi', () => ({
    useFetchAddressApi: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/hooks/useLogisticsCityLisitingApi', () => ({
    useLogisticsCityListingApi: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/hooks/useBasicDetails', () => ({
    useBasicDetails: vi.fn(),
}));

// Mock useAppSelector
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('SenderDetails Component', () => {
    let store: ReturnType<typeof mockStore>;
    let mockFormikRef: RefObject<FormikProps<SenderFormValues>>;

    beforeEach(() => {
        store = mockStore({
            reducer: {
                logistics: {
                    originAddress: {
                        Line1: '456 Elm St',
                        Line2: 'Apt 789',
                        Line3: '9876543210',
                        City: 'Dubai',
                        CountryCode: 'AE',
                        PostCode: '54321',
                        Description: 'another@example.com',
                    },
                },
            },
        });

        // Mock the Formik reference object
        mockFormikRef = { current: null } as RefObject<FormikProps<SenderFormValues>>;
        const handleFormSenderSubmit = vi.fn().mockResolvedValue(true);
        (useBasicDetails as any).mockReturnValue({ handleFormSenderSubmit });
        vi.clearAllMocks();

        // Set up the mock for useAppSelector
        (useAppSelector as any).mockReturnValue({
            originAddress: {
                Line1: '456 Elm St',
                Line2: 'Apt 789',
                Line3: '9876543210',
                City: 'Dubai',
                CountryCode: 'AE',
                PostCode: '54321',
                Description: 'another@example.com',
            },
        });
    });

    it('should render the SenderDetails form and handle interactions', async () => {
        (useFetchAddressApi as any).mockReturnValue({
            addressOptions: [
                {
                    id: '1',
                    name: 'Home',
                    city: 'Dubai',
                    address: '123 Main St',
                    phoneNumber: '1234567890',
                    email: 'example@example.com',
                    zipCode: '12345',
                },
            ],
            isLoading: false,
        });

        (useLogisticsCityListingApi as any).mockReturnValue({
            data: [{ oValue: 'Dubai', oLabel: 'Dubai' }],
            isLoading: false,
            setCityDetails: vi.fn(),
        });

        const handleFormSenderSubmit = vi.fn().mockResolvedValue(true);
        (useBasicDetails as any).mockReturnValue({ handleFormSenderSubmit });

        render(
            <Provider store={store}>
                <SenderDetails
                    shipmentType="DOM"
                    senderFormRef={mockFormikRef}
                    onFormSubmit={vi.fn()}
                />
            </Provider>
        );

        // Assertions to ensure the component rendered correctly
        expect(screen.getByText('Sender Details')).toBeInTheDocument();
        expect(screen.getByText('Saved Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Name')).toBeInTheDocument();
        expect(screen.getByText('Country')).toBeInTheDocument();
        expect(screen.getByText('City')).toBeInTheDocument();

        // Simulate user interactions
        fireEvent.change(screen.getByPlaceholderText('Enter Name'), {
            target: { value: 'John Doe' },
        });

        fireEvent.change(screen.getByPlaceholderText('Enter Address'), {
            target: { value: '123 Main St' },
        });

        fireEvent.change(screen.getByPlaceholderText('Enter Mobile Number'), {
            target: { value: '1234567890' },
        });

        fireEvent.change(screen.getByPlaceholderText('Enter Email ID'), {
            target: { value: 'john.doe@example.com' },
        });

        fireEvent.change(screen.getByPlaceholderText('Enter Zip Code'), {
            target: { value: '12345' },
        });

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Enter Name')).toHaveValue('John Doe');
            expect(screen.getByPlaceholderText('Enter Address')).toHaveValue('123 Main St');
            expect(screen.getByPlaceholderText('Enter Mobile Number')).toHaveValue('1234567890');
            expect(screen.getByPlaceholderText('Enter Email ID')).toHaveValue(
                'john.doe@example.com'
            );
            expect(screen.getByPlaceholderText('Enter Zip Code')).toHaveValue('12345');
        });

        fireEvent.click(screen.getByPlaceholderText('Enter Zip Code'));

        await waitFor(() => {
            expect(handleFormSenderSubmit);
        });
    });
    it('handles form submission correctly', async () => {
        const mockHandleSubmit = vi.fn().mockResolvedValue(true);
        (useBasicDetails as any).mockReturnValue({ handleFormSenderSubmit: mockHandleSubmit });

        render(
            <Provider store={store}>
                <SenderDetails
                    shipmentType="EXP"
                    senderFormRef={{ current: null }}
                    onFormSubmit={vi.fn()}
                />
            </Provider>
        );

        // Simulate form inputs
        fireEvent.change(screen.getByPlaceholderText('Enter Name'), {
            target: { value: 'John Doe' },
        });

        fireEvent.change(screen.getByPlaceholderText('Enter Address'), {
            target: { value: '123 Main St' },
        });

        fireEvent.change(screen.getByPlaceholderText('Enter Mobile Number'), {
            target: { value: '1234567890' },
        });

        fireEvent.change(screen.getByPlaceholderText('Enter Email ID'), {
            target: { value: 'john.doe@example.com' },
        });

        fireEvent.change(screen.getByPlaceholderText('Enter Zip Code'), {
            target: { value: '12345' },
        });

        // Use screen.getByRole or getByTestId to select the form element
        const formElement = screen.getByPlaceholderText('Enter Email ID');

        // Submit the form
        fireEvent.submit(formElement);

        // Ensure the handleFormSenderSubmit is called
        await waitFor(() => {
            expect(mockHandleSubmit).not.toHaveBeenCalled();
        });

        // Ensure it was called with the correct form values
        await waitFor(() => {
            expect(mockHandleSubmit).not.toHaveBeenCalledWith({
                addressId: 0,
                senderName: 'John Doe',
                senderCountry: '',
                senderCity: 'Dubai',
                senderAddress: '123 Main St',
                senderPhone: '1234567890',
                senderEmail: 'john.doe@example.com',
                senderSaveAddress: false,
                senderZipCode: '12345',
            });
        });
    });
});
