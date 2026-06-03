import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest';

import OrderHistoryPage from '../../components/OrderHistoryTable';
import * as useFilterModule from '../../hooks/useFilter';
import { useOrderHistoryTable } from '../../hooks/useOrderHistoryTable';

// Mocking the useOrderHistoryTable hook to control data fetching
vi.mock('../../hooks/useOrderHistoryTable', () => ({
    useOrderHistoryTable: vi.fn(),
}));

describe('OrderHistoryPage', () => {
    const mockData = [
        {
            date: '2024-08-28T00:00:00Z',
            giftCardName: 'Gift Card A',
            txnId: 'TXN123',
            paymentMode: 'Credit Card',
            amount: 150.5,
            status: 'SUCCESS',
            key: 'TXN123',
        },
    ];
    const handleSearchMock = vi.fn();
    beforeEach(() => {
        (useOrderHistoryTable as Mock).mockReturnValue({
            data: mockData,
            isLoading: false,
            count: 1,
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('renders OrderHistoryPage component', () => {
        render(<OrderHistoryPage />);

        // Check if search input is rendered
        expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
        // Check if the table is rendered with the correct columns
        expect(screen.getByText('Date')).toBeInTheDocument();
        expect(screen.getByText('Gift Card Name')).toBeInTheDocument();
        expect(screen.getByText('Order ID')).toBeInTheDocument();
        expect(screen.getByText('Payment Mode')).toBeInTheDocument();
        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
    });

    test('displays data correctly in the table', () => {
        render(<OrderHistoryPage />);

        // Check if data is displayed correctly
        expect(screen.getByText('Gift Card A')).toBeInTheDocument();
        expect(screen.getByText('TXN123')).toBeInTheDocument();
        expect(screen.getByText('AED 150.50')).toBeInTheDocument();
        expect(screen.getByText('success')).toBeInTheDocument();
    });

    test('search input updates filter state', async () => {
        vi.spyOn(useFilterModule, 'default').mockReturnValue({
            handleSearch: handleSearchMock,
            handlePageChange: vi.fn(),
        });
        render(<OrderHistoryPage />);

        // Find the search input
        const searchInput = screen.getByPlaceholderText('Search');

        // Type into search input
        fireEvent.change(searchInput, { target: { value: 'Gift Card A' } });

        await waitFor(() => {
            expect(handleSearchMock).toHaveBeenCalled();
            // Adjust the assertion to match the structure of SyntheticBaseEvent
            expect(handleSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    target: expect.objectContaining({
                        value: 'Gift Card A',
                    }),
                })
            );
        });
    });

    test('displays empty message when no data is available', () => {
        (useOrderHistoryTable as Mock).mockReturnValue({
            data: [],
            isLoading: false,
            count: 0,
        });

        render(<OrderHistoryPage />);
        expect(screen.getByText(/no data/i)).toBeInTheDocument(); // Adjust according to the actual message shown
    });
});
