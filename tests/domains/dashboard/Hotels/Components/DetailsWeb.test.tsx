import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, afterEach } from 'vitest';

import DetailsWeb from '@domains/dashboard/Hotels/Components/HotelListing/DetailsWeb';
import { Hotels } from '@domains/dashboard/Hotels/types/types';

const mockStore = configureStore([]);

vi.mock('@domains/dashboard/Hotels/Components/Detailshead', () => ({
    __esModule: true,
    default: () => <div>Detailshead</div>,
}));

vi.mock('@domains/dashboard/Hotels/Components/Filterhotel', () => ({
    __esModule: true,
    default: () => <div>Filterhotel</div>,
}));

vi.mock('@domains/dashboard/Hotels/Components/HotelList', () => ({
    __esModule: true,
    default: ({ name }: { name: string }) => <div>{name}</div>,
}));

vi.mock('@domains/dashboard/Hotels/Components/Empty', () => ({
    __esModule: true,
    default: () => <div>No hotels found</div>,
}));

describe('DetailsWeb Component', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    // Mock hotel data for testing
    const hotelsData: Hotels[] = [
        {
            hotelKey: '1',

            propertyInfo: {
                imageUrl: 'http://example.com/image1.jpg',
                hotelName: 'Hotel One',
                address: '',
                phoneNumber: '',
                location: '',
                latitude: '',
                longitude: '',
                facilities: [],
                propertyType: '',
                starRating: '',
            },
            rooms: [
                {
                    roomRate: {
                        currency: 'USD',
                        netAmount: 100,
                        rates: [
                            {
                                name: 'Standard Rate',
                                amount: 100,
                                from: '2024-10-01',
                                rateIndex: '0',
                                to: '2024-10-05',
                            },
                        ],
                    },
                    roomIndex: 0,
                    roomKey: '',
                    roomId: '',
                    roomTypeDesc: '',
                    maxOccupancy: 0,
                    ratePlan: {
                        supplierCode: '',
                        meal: '',
                        availableStatus: '',
                        cancelPolicyIndicator: '',
                        code: '',
                        isPackage: false,
                        fixedCombo: false,
                        gstAssured: false,
                    },
                    rateNotes: '',
                    financialInfo: {
                        supplier: '',
                        payment: {
                            paymentTypes: [],
                        },
                    },
                },
            ],
        },
        {
            hotelKey: '2',

            propertyInfo: {
                imageUrl: 'http://example.com/image1.jpg',
                hotelName: 'Hotel Two',
                address: '',
                phoneNumber: '',
                location: '',
                latitude: '',
                longitude: '',
                facilities: [],
                propertyType: '',
                starRating: '',
            },
            rooms: [
                {
                    roomRate: {
                        currency: 'USD',
                        netAmount: 150,
                        rates: [
                            {
                                name: 'Premium Rate',
                                amount: 150,
                                from: '2024-10-01',
                                rateIndex: '1',
                                to: '2024-10-05',
                            },
                        ],
                    },
                    roomIndex: 0,
                    roomKey: '',
                    roomId: '',
                    roomTypeDesc: '',
                    maxOccupancy: 0,
                    ratePlan: {
                        supplierCode: '',
                        meal: '',
                        availableStatus: '',
                        cancelPolicyIndicator: '',
                        code: '',
                        isPackage: false,
                        fixedCombo: false,
                        gstAssured: false,
                    },
                    rateNotes: '',
                    financialInfo: {
                        supplier: '',
                        payment: {
                            paymentTypes: [],
                        },
                    },
                },
            ],
        },
    ];

    // Setup a mock Redux store state
    const store = mockStore({
        reducer: {
            auth: {
                role: 'user',
                id: '123',
            },
            hotels: {
                hotelsRequest: {
                    rooms: hotelsData,
                },
            },
        },
    });

    it('should render correctly with hotel data', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DetailsWeb
                        isLoading={false}
                        originaldata={hotelsData}
                        conversationId="123"
                        searchKey="test"
                        hotelsSearch={vi.fn()}
                    />
                </MemoryRouter>
            </Provider>
        );
    });

    it('should display loading state', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DetailsWeb
                        isLoading
                        originaldata={[]}
                        conversationId="123"
                        searchKey="test"
                        hotelsSearch={vi.fn()}
                    />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show empty state when no hotels found', () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DetailsWeb
                        isLoading={false}
                        originaldata={[]}
                        conversationId="123"
                        searchKey="test"
                        hotelsSearch={vi.fn()}
                    />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('No hotels found')).toBeInTheDocument();
    });

    it('should update filter options when reset filters is clicked', async () => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <DetailsWeb
                        isLoading={false}
                        originaldata={hotelsData}
                        conversationId="123"
                        searchKey="test"
                        hotelsSearch={vi.fn()}
                    />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText('Reset'));

        await waitFor(() => {
            const name = screen.getByTestId('show-text');
            expect(name).toBeInTheDocument();
        });
    });
});
