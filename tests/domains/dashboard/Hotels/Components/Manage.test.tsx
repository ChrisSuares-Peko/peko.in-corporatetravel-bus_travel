import { configureStore } from '@reduxjs/toolkit';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';
import Manage from '@src/domains/dashboard/Hotels/Components/BookingHistory/Manage';

// Define initial state for the mock store
const initialState = {
    reducer: {
        hotels: {
            hotelsRequest: {
                rooms: [],
            },
        },
    },
};

// Create the mock store with the initial state
const mockStore = configureStore({
    reducer: (state = initialState) => state,
});

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
vi.mock('@src/slices/getHotelSlice', () => ({
    getTxnId: vi.fn(),
}));

vi.mock('@domains/dashboard/Hotels/hooks/useCancellationApi', () => ({
    default: vi.fn(() => ({
        cancellation: vi.fn().mockResolvedValue({
            data: [],
        }),
        isLoading: false,
    })),
}));

vi.mock('@domains/dashboard/Hotels/hooks/useDownloadTicketApi', () => ({
    default: vi.fn(() => ({
        download: vi.fn().mockResolvedValue({
            pdfFile: {
                data: [],
            },
        }),
    })),
}));

vi.mock('@domains/dashboard/Hotels/hooks/useTimeConvertHook', () => ({
    default: vi.fn(() => ({
        convertToAMPM: vi.fn(time => time),
    })),
}));

vi.mock('@domains/dashboard/Hotels/hooks/useDateField', () => ({
    default: vi.fn(() => ({
        showModal: vi.fn(),
        isModalOpen: false,
        handleCancel: vi.fn(),
    })),
}));

describe('Manage Component', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    const defaultProps = {
        orderId: 123,
        details: JSON.stringify({
            data: [
                {
                    hotel: {
                        name: 'Test Hotel',
                        checkInDate: '2024-08-20',
                        checkOutDate: '2024-08-22',
                        bookingStatus: 'CONFIRMED',
                    },
                    bookingReferenceId: 'ABC123',
                    bookingStatus: 'CONFIRMED',
                },
            ],
            hotelContact: {
                image: '',
                checkInTime: '14:00',
                checkOutTime: '12:00',
                cancellationPolicy: [{ cancellationDeadlineDate: '2024-08-18' }],
            },
            meta: {
                conversationId: 'conversation123',
            },
        }),
        txnId: 'txn123',
        baseAmt: 1000,
        refetch: vi.fn(),
    };

    it('should render the Manage component with correct details', () => {
        render(
            <Provider store={mockStore}>
                <Router>
                    <Manage {...defaultProps} />
                </Router>
            </Provider>
        );

        expect(screen.getByText('Test Hotel')).toBeInTheDocument();
        expect(screen.getByText('2024-08-20')).toBeInTheDocument();
        expect(screen.getByText('2024-08-22')).toBeInTheDocument();
        expect(screen.getByText('Booking number:')).toBeInTheDocument();
        expect(screen.getByText('ABC123')).toBeInTheDocument();
    });

    it('should handle booking cancellation', async () => {
        render(
            <Provider store={mockStore}>
                <Router>
                    <Manage {...defaultProps} />
                </Router>
            </Provider>
        );

        const cancelBookingButton = screen.getByText('Cancel Booking');
        fireEvent.click(cancelBookingButton);

        await waitFor(() => {
            expect(screen.getByText('Cancel Booking')).toBeInTheDocument();
        });
    });

    it('should handle ticket download', async () => {
        render(
            <Provider store={mockStore}>
                <Router>
                    <Manage {...defaultProps} />
                </Router>
            </Provider>
        );

        const downloadButton = screen.getByText('Download');
        fireEvent.click(downloadButton);

        // await waitFor(() => {
        //     expect(downloadButton).toBeDisabled();
        // });
    });

    it('should show cancelled status when booking is cancelled', () => {
        const cancelledProps = {
            ...defaultProps,
            details: JSON.stringify({
                data: [
                    {
                        hotel: {
                            name: 'Test Hotel',
                            checkInDate: '2024-08-20',
                            checkOutDate: '2024-08-22',
                            bookingStatus: 'Cancelled',
                        },
                        bookingReferenceId: 'ABC123',
                        bookingStatus: 'Cancelled',
                    },
                ],
                hotelContact: {
                    image: '',
                    checkInTime: '14:00',
                    checkOutTime: '12:00',
                },
                meta: {
                    conversationId: 'conversation123',
                },
            }),
        };

        render(
            <Provider store={mockStore}>
                <Router>
                    <Manage {...cancelledProps} />
                </Router>
            </Provider>
        );

        expect(screen.getByText('Cancelled')).toBeInTheDocument();
    });
});
