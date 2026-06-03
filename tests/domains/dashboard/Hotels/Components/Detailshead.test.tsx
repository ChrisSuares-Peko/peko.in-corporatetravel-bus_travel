import { configureStore } from '@reduxjs/toolkit';
import { render, screen, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import Detailshead from '@domains/dashboard/Hotels/Components/HotelListing/Detailshead';

// Define the initial state for the mock store
const initialState = {
    reducer: {
        hotels: {
            hotelsRequest: {
                city: 'Dubai',
                country: 'United Arab Emirates',
                checkIn: '2024-08-20',
                checkOut: '2024-08-22',
                rooms: [{ adult: 2, child: 1, childAge: [5] }],
            },
        },
        auth: {
            role: 'user',
            id: '123',
        },
    },
};

// Create the mock store with the initial state
const mockStore = configureStore({
    reducer: (state = initialState) => state,
});

// Mock necessary hooks and functions
vi.mock('@src/hooks/store', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object), // Spread the original module to keep other exports
        useAppSelector: (selector: (state: typeof initialState) => any) => selector(initialState),
        useAppDispatch: () => vi.fn(), // Mock useAppDispatch
    };
});

vi.mock('@domains/dashboard/Hotels/hooks/useSearchCityApi', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useSearchCityApi: () => ({
            isLoading: false,
            cityList: vi.fn(),
            cityOptions: [{ cityName: 'Dubai', countryName: 'United Arab Emirates' }],
        }),
    };
});

vi.mock('@domains/dashboard/Hotels/hooks/useTimeConvertHook', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useTimeConvert: () => ({
            convertToDateString: (date: any) => date,
        }),
    };
});

vi.mock('@src/slices/apiSlice', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        showToast: vi.fn().mockImplementation(message => {
            const toastElement = document.createElement('div');
            toastElement.textContent = message.description;
            document.body.appendChild(toastElement);
        }),
    };
});

vi.mock('@domains/dashboard/Hotels/slices/getHotelSlice', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        getHotels: vi.fn(),
    };
});

vi.mock('react-router-dom', () => ({
    useLocation: () => ({ state: { key: 'search123' } }),
}));

const mockHotelsSearch = vi.fn();

describe('Detailshead', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('should render correctly', () => {
        render(
            <Provider store={mockStore}>
                <Detailshead hotelsSearch={mockHotelsSearch} />
            </Provider>
        );

        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('Check-In')).toBeInTheDocument();
        expect(screen.getByText('Check-Out')).toBeInTheDocument();
        expect(screen.getByText('Guests & Nationality')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
    });

    it('should display selected city and country', async () => {
        render(
            <Provider store={mockStore}>
                <Detailshead hotelsSearch={mockHotelsSearch} />
            </Provider>
        );

        // Check the value of the input field directly
        const cityInput = screen.getByDisplayValue('Dubai, United Arab Emirates');
        expect(cityInput).toBeInTheDocument();
    });

    // it('should handle form submission with valid data', async () => {
    //     // Adjust the mock for getHotels to ensure it is called
    //     const mockDispatch = vi.fn();
    //     vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);

    //     render(
    //         <Provider store={mockStore}>
    //             <Detailshead hotelsSearch={mockHotelsSearch} />
    //         </Provider>
    //     );

    //     // Find the search button and simulate a click
    //     const searchButton = screen.getByText('Search');
    //     fireEvent.click(searchButton);

    //     // Ensure that the getHotels function is called
    //     await waitFor(() => {
    //         expect(vi.mocked(getHotels)).toHaveBeenCalled();
    //     });
    // });

    // it('should show toast message when location is not selected', async () => {
    //     render(
    //         <Provider store={mockStore}>
    //             <Detailshead hotelsSearch={mockHotelsSearch} />
    //         </Provider>
    //     );

    //     // Simulate clearing the location and searching
    //     fireEvent.change(screen.getByPlaceholderText('Enter location'), { target: { value: '' } });
    //     fireEvent.click(screen.getByText('Search'));

    //     const toastMessage = await screen.findByText((content) => content.includes('Please select a location'));

    //     expect(toastMessage).toBeInTheDocument();
    // });

    // Add more tests based on the functionalities and requirements
});
