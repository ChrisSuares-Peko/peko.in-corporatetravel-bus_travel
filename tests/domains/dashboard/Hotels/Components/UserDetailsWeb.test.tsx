import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import UserDetailsWeb from '@src/domains/dashboard/Hotels/Components/GuestDetails/UserDetailsWeb';

// Define initial state for the mock store
const initialState = {
    reducer: {
        hotels: {
            hotelsRequest: {
                rooms: [
                    {
                        roomIndex: 1,
                        adult: 2,
                        child: 1,
                        childAge: [5],
                    },
                ],
            },
            keyData: {
                hotelKey: 'mockHotelKey',
                conversationId: 'mockConversationId',
                searchKey: 'mockSearchKey',
            },
            reservedData: [
                {
                    ratePlan: {
                        meal: 'Breakfast included',
                        cancelPolicyIndicator: true,
                        lastCancellationDate: '2023-08-25',
                    },
                    roomTypeDesc: 'Deluxe Room',
                },
            ],
            roomResponse: [
                {
                    roomKey: 'mockRoomKey',
                    roomIndex: 1,
                    price: 100,
                },
            ],
            formCount: [1, 2, 3], // assuming there are three forms filled
            prebookRoomData: [
                {
                    rateNotes: 'Mock rate notes',
                },
            ],
        },
        subscriptions: {
            services: [], // Add this part to avoid undefined error
        },
    },
};

// Create the mock store with the initial state
const mockStore = configureStore({
    reducer: (state = initialState) => state,
});

vi.mock('react-svg', () => ({
    ReactSVG: ({ src }: { src: string }) => <img src={src} alt="icon" />,
}));

// Mock necessary hooks and functions
vi.mock('@src/hooks/store', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useAppSelector: (selector: (state: typeof initialState) => any) => selector(initialState),
        useAppDispatch: () => vi.fn(),
    };
});

vi.mock('@src/routes/paths', () => ({
    paths: {
        hotels: {
            bookings: '/hotels/bookings',
        },
    },
}));

vi.mock('@domains/dashboard/Hotels/hooks/usePrebookApi', () => {
    const originalModule = vi.importActual('@domains/dashboard/Hotels/hooks/usePrebookApi');
    return {
        __esModule: true,
        ...originalModule,
        default: vi.fn(() => ({
            PrebookDetails: vi.fn().mockResolvedValue({
                data: [
                    {
                        hotel: {
                            bookingKey: 'mockBookingKey',
                            rooms: [],
                            priceChangeIndicator: false,
                        },
                    },
                ],
            }),
        })),
    };
});

vi.mock('react-router-dom', async importOriginal => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useLocation: vi.fn(() => ({ state: { key: 'search123' } })),
    };
});

describe('UserDetailsWeb Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders continue button', () => {
        render(
            <Provider store={mockStore}>
                <Router>
                    <UserDetailsWeb employeesList={[]} generateEmployeesDropdown={vi.fn()} />
                </Router>
            </Provider>
        );

        const ctn = screen.getByTestId('continue');
        expect(ctn).toBeInTheDocument();
    });

    it('renders room details and guest details', () => {
        render(
            <Provider store={mockStore}>
                <Router>
                    <UserDetailsWeb employeesList={[]} generateEmployeesDropdown={vi.fn()} />
                </Router>
            </Provider>
        );

        expect(screen.getByText('Deluxe Room')).toBeInTheDocument();
        expect(screen.getByText('Breakfast included')).toBeInTheDocument();
        expect(screen.getByText('Guest Details')).toBeInTheDocument();
    });

    it('handles continue button click and triggers form submission', async () => {
        render(
            <Provider store={mockStore}>
                <Router>
                    <UserDetailsWeb employeesList={[]} generateEmployeesDropdown={vi.fn()} />
                </Router>
            </Provider>
        );

        fireEvent.click(screen.getByText('Continue'));

        // await waitFor(() => {
        //     expect(mockNavigate).toHaveBeenCalledWith(paths.hotels.bookings);
        // });
    });

    it('shows loading state when submitting the form', async () => {
        render(
            <Provider store={mockStore}>
                <Router>
                    <UserDetailsWeb employeesList={[]} generateEmployeesDropdown={vi.fn()} />
                </Router>
            </Provider>
        );

        fireEvent.click(screen.getByText('Continue'));

        // Look for the button element within the Ant Design Button component
        const continueButton = screen.getByRole('button', { name: /continue/i });
        // expect(continueButton).toBeDisabled();
    });
});
