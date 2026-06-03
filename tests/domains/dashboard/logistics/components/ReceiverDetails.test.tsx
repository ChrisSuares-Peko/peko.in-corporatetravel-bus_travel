import { RefObject } from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FormikProps } from 'formik';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ReceiverDetails from '@src/domains/dashboard/logistics/components/ReceiverDetails';
import { useFetchAddressApi } from '@src/domains/dashboard/logistics/hooks/useAddressApi';
import { useBasicDetails } from '@src/domains/dashboard/logistics/hooks/useBasicDetails';
import { useLogisticsCityListingApi } from '@src/domains/dashboard/logistics/hooks/useLogisticsCityLisitingApi';
import { useLogisticsCountryListingApi } from '@src/domains/dashboard/logistics/hooks/useLogisticsCountryListingApi';
import { RecieverFormValues } from '@src/domains/dashboard/logistics/types/address';
import { useAppSelector } from '@src/hooks/store';

// Import your logistics slice reducer

interface Props {
    recieverFormRef: RefObject<FormikProps<RecieverFormValues>>;
    shipmentType: string;
    onFormSubmit: (result: boolean) => void;
}

// Create a mock store
const mockStore = configureStore([]);

vi.mock('@src/domains/dashboard/logistics/hooks/useAddressApi', () => ({
    useFetchAddressApi: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/hooks/useLogisticsCityLisitingApi', () => ({
    useLogisticsCityListingApi: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/hooks/useLogisticsCountryListingApi', () => ({
    useLogisticsCountryListingApi: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/hooks/useBasicDetails', () => ({
    useBasicDetails: vi.fn(),
}));

// Mock useAppSelector
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('ReceiverDetails Component', () => {
    let store: ReturnType<typeof mockStore>;
    let mockFormikRef: RefObject<FormikProps<RecieverFormValues>>; // RefObject for the formik reference

    beforeEach(() => {
        store = mockStore({
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
                destinationAddress: {
                    Line1: '123 Main St',
                    Line2: 'Suite 456',
                    Line3: '1234567890',
                    City: 'Dubai',
                    CountryCode: 'AE',
                    PostCode: '12345',
                    Longitude: 0,
                    Latitude: 0,
                    Description: 'example@example.com',
                },
                shipmentDetails: {
                    actualWeight: '5kg',
                    numberOfPieces: 3,
                    productGroup: 'DOM',
                    productType: 'Electronics',
                    customsValueAmount: 150.0,
                    quantity: 2,
                    shipmentContent: 'Laptop and accessories',
                },
                shippingAmount: {
                    TotalAmount: 200.0,
                    TotalAmountBeforeTax: 180.0,
                    TaxAmount: 20.0,
                    type: 'Standard',
                },
                isComingFromDetails: false,
            },
        });

        // Mock the Formik reference object
        mockFormikRef = { current: null } as RefObject<FormikProps<RecieverFormValues>>;

        vi.clearAllMocks();

        // Set up the mock for useAppSelector
        (useAppSelector as any).mockReturnValue({
            destinationAddress: {
                Line1: '123 Main St',
                Line2: 'Suite 456',
                Line3: '1234567890',
                City: 'Dubai',
                CountryCode: 'AE',
                PostCode: '12345',
                Longitude: 0,
                Latitude: 0,
                Description: 'example@example.com',
            },
        });
    });

    it('should render the ReceiverDetails form and interact with it', async () => {
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
            setIsLoading: vi.fn(),
            setCityDetails: vi.fn(),
        });

        (useLogisticsCountryListingApi as any).mockReturnValue({
            data: [{ oValue: 'AE', oLabel: 'United Arab Emirates' }],
            isLoading: false,
        });

        const handleFormRecieverSubmit = vi.fn().mockResolvedValue(true);
        (useBasicDetails as any).mockReturnValue({ handleFormRecieverSubmit });

        render(
            <Provider store={store}>
                <ReceiverDetails
                    shipmentType="DOM"
                    recieverFormRef={mockFormikRef}
                    onFormSubmit={vi.fn()}
                />
            </Provider>
        );

        // Assertions to ensure the component rendered correctly
        expect(screen.getByText('Receiver Details')).toBeInTheDocument();
        expect(screen.getByText('Saved Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Name')).toBeInTheDocument();
        expect(screen.getByText('Country')).toBeInTheDocument();

        // Simulate user interactions
        // fireEvent.change(screen.getByPlaceholderText('Select Address'), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText('Enter Name'), {
            target: { value: 'John Doe' },
        });

        await waitFor(() => {
            expect(screen.getByPlaceholderText('Enter Name')).toHaveValue('John Doe');
        });
        screen.debug();
        // Check form submission
        fireEvent.submit(screen.getByPlaceholderText('Enter Name'));

        await waitFor(() => {
            expect(handleFormRecieverSubmit).toHaveBeenCalled();
        });
    });
});
