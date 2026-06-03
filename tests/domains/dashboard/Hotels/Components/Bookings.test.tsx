import { configureStore } from '@reduxjs/toolkit';
import { render, screen, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { describe, it, expect, afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';
import Bookings from '@src/domains/dashboard/Hotels/Components/BookingReview/Bookings';

describe('Bookings Component', () => {
    afterEach(() => {
        cleanup();
    });

    const initialState = {
        reducer: {
            hotels: {
                hotelsRequest: {
                    rooms: [
                        { adult: 2, child: 1 },
                        { adult: 1, child: 0 },
                    ],
                    checkIn: '2024-08-25',
                    checkOut: '2024-08-28',
                },
                roomResponse: [{ price: '300' }, { price: '500' }],
                hotelResponse: {
                    data: [
                        {
                            name: 'Test Hotel',
                            city: 'Test City',
                            country: 'Test Country',
                        },
                    ],
                },
            },
        },
    };

    const mockStore = configureStore({
        reducer: (state = initialState) => state,
    });

    const renderComponent = (props = {}) =>
        render(
            <Provider store={mockStore}>
                <Bookings
                    hotel="Test Hotel"
                    details={{ city: 'Test City', country: 'Test Country' }}
                    checkInTime="14:00"
                    checkoutTime="12:00"
                    {...props}
                />
            </Provider>
        );

    it('renders correctly with default props', () => {
        renderComponent();

        expect(screen.getByText('Your Booking Summary')).toBeInTheDocument();
        expect(screen.getByText('Check In')).toBeInTheDocument();
        expect(screen.getByText('Check Out')).toBeInTheDocument();
        expect(screen.getByText('Total guests')).toBeInTheDocument();
        expect(screen.getByText('Total rooms')).toBeInTheDocument();
        expect(screen.getByText('Total length of stay')).toBeInTheDocument();
    });

    it('calculates and displays the correct total guests and rooms', () => {
        renderComponent();

        expect(screen.getByText('3 Adults, 1 Child')).toBeInTheDocument();
        expect(screen.getByText('2 Rooms')).toBeInTheDocument();
    });

    it('calculates and displays the correct length of stay', () => {
        renderComponent();

        expect(screen.getByText('3 Nights')).toBeInTheDocument();
    });

    it('displays the correct check-in and check-out times', () => {
        renderComponent();

        const checkin = screen.getByTestId('checkin');
        expect(checkin).toBeInTheDocument();

        const checkout = screen.getByTestId('checkout');
        expect(checkout).toBeInTheDocument();
    });
});
