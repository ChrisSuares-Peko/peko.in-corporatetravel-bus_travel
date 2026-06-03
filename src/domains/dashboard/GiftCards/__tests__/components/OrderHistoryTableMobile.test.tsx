import React from 'react';

import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, beforeEach, afterEach, test, expect, vi, Mock } from 'vitest';

import OrderHistoryTableMobile from '../../components/OrderHistoryTableMobile';
import * as useFilterModule from '../../hooks/useFilter';
import * as useOrderHistoryTableModule from '../../hooks/useOrderHistoryTable';

describe('OrderHistoryTableMobile', () => {
    beforeEach(() => {
        vi.spyOn(useOrderHistoryTableModule, 'useOrderHistoryTable').mockReturnValue({
            data: mockData,
            isLoading: false,
            count: 1,
        });

        vi.clearAllMocks();
        cleanup();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });
    const mockData = [
        {
            date: '2024-08-28T00:00:00Z',
            giftCardName: 'Gift Card A',
            txnId: 'TXN123',
            paymentMode: 'Credit Card',
            amount: '150.5',
            status: 'SUCCESS',
        },
    ];

    const mockHandleSearch = vi.fn();
    const mockHandlePageChange = vi.fn();

    test('renders initial state with skeleton loaders', () => {
        vi.spyOn(useOrderHistoryTableModule, 'useOrderHistoryTable').mockReturnValue({
            data: [],
            isLoading: true,
            count: 0,
        });
        const { container } = render(<OrderHistoryTableMobile />);

        const skeleton = container.querySelector('.ant-skeleton-active');

        expect(skeleton).toBeInTheDocument();
    });

    test('search input updates filter state and calls handleSearch', async () => {
        vi.spyOn(useFilterModule, 'default').mockReturnValue({
            handleSearch: mockHandleSearch,
            handlePageChange: mockHandlePageChange,
        });
        render(<OrderHistoryTableMobile />);

        // Find the search input
        const searchInput = screen.getByPlaceholderText('Search');

        // Type into search input
        fireEvent.change(searchInput, { target: { value: 'Gift Card A' } });

        await waitFor(() => {
            expect(mockHandleSearch).toHaveBeenCalled();
            // Adjust the assertion to match the structure of SyntheticBaseEvent
            expect(mockHandleSearch).toHaveBeenCalledWith(
                expect.objectContaining({
                    target: expect.objectContaining({
                        value: 'Gift Card A',
                    }),
                })
            );
        });
    });

    test('shows empty state when no data is available', () => {
        (useOrderHistoryTableModule.useOrderHistoryTable as Mock).mockReturnValue({
            data: [],
            isLoading: false,
            count: 0,
        });

        render(<OrderHistoryTableMobile />);

        // Check for empty state message
        expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    test('renders data correctly when available', () => {
        render(<OrderHistoryTableMobile />);

        expect(screen.getByText('Gift Card A')).toBeInTheDocument();
    });
});
