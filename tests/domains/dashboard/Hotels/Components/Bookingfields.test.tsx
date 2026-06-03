import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import Bookingfields from '@src/domains/dashboard/Hotels/Components/HotelSearch/Bookingfields';

// Mock necessary hooks and functions
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: () => vi.fn(),
    useAppSelector: (selector: any) =>
        selector({
            reducer: {
                hotels: {
                    hotelsRequest: {
                        rooms: [],
                    },
                },
                auth: {
                    role: 'user',
                    id: '123',
                },
            },
        }),
}));

vi.mock('../hooks/useDateField', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useDateFields: () => ({
            showModal: vi.fn(),
            setCalendarOpen: vi.fn(),
            handleCancel: vi.fn(),
            handleCheckInSelect: vi.fn(),
            handleCheckOutSelect: vi.fn(),
            isModalOpen: false,
            calendarOpen: false,
            isSelectingCheckIn: true,
        }),
    };
});

vi.mock('../hooks/useSearchCityApi', async importOriginal => {
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

vi.mock('../hooks/useTimeConvertHook', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useTimeConvert: () => ({
            convertToDateString: (date: any) => date,
        }),
    };
});

vi.mock('@src/slices/apiSlice', async (importOriginal: () => Promise<any>) => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        showToast: vi.fn().mockImplementation(message => {
            // Simulate the rendering of the toast message in the DOM
            const toastElement = document.createElement('div');
            toastElement.textContent = message.description;
            document.body.appendChild(toastElement);
        }),
    };
});

vi.mock('@src/slices/getHotelSlice', () => ({
    getHotels: vi.fn(),
    resetData: vi.fn(),
    resetRoomResponse: vi.fn(),
    resetGetHotels: vi.fn(),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: { key: 'search123' } }),
}));

describe('Bookingfields', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('should render correctly', () => {
        render(<Bookingfields />);

        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('Check-In')).toBeInTheDocument();
        expect(screen.getByText('Check-Out')).toBeInTheDocument();
        expect(screen.getByText('Guests')).toBeInTheDocument();
        expect(screen.getByText('Search Hotels')).toBeInTheDocument();
    });

    // it('should display selected city and country', async () => {
    //     render(<Bookingfields />);

    //     const cityText = await screen.findByText((content) => content.includes('Dubai'));
    //     const countryText = await screen.findByText((content) => content.includes('United Arab Emirates'));

    //     expect(cityText).toBeInTheDocument();
    //     expect(countryText).toBeInTheDocument();
    // });

    it('should select check-in and check-out dates', async () => {
        render(<Bookingfields />);

        const datePickers = screen.getAllByPlaceholderText('Select date');
        const checkInPicker = datePickers[0];
        const checkOutPicker = datePickers[1];

        fireEvent.change(checkInPicker, { target: { value: '2024-08-20' } });
        fireEvent.change(checkOutPicker, { target: { value: '2024-08-22' } });

        await waitFor(() => {
            expect(checkInPicker).toHaveValue('2024-08-20');
            expect(checkOutPicker).toHaveValue('2024-08-22');
        });
    });

    it('should handle form submission with valid data', async () => {
        render(<Bookingfields />);

        fireEvent.click(screen.getByText('Search Hotels'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('hotels/hotel-listing', {
                state: { key: 'searchHotels' },
            });
        });
    });

    it('should show toast message when city name is empty', async () => {
        render(<Bookingfields />);

        fireEvent.change(screen.getByPlaceholderText('Enter location'), { target: { value: '' } });
        fireEvent.click(screen.getByText('Search Hotels'));

        const toastMessage = await screen.findByText(content =>
            content.includes('City name should not be empty')
        );

        expect(toastMessage).toBeInTheDocument();
    });

    // Add more tests based on the functionalities and requirements
});
