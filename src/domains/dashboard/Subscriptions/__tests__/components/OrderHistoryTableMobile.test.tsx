import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { Dayjs } from 'dayjs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NoUndefinedRangeValueType } from 'rc-picker/lib/PickerInput/RangePicker';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

import OrderHistoryTableMobile from '../../components/orderHistory/OrderHistoryTableMobile';
import * as useFilterModule from '../../hooks/useFilter';
import * as useOrderHistoryTableModule from '../../hooks/useOrderHistoryTable'; // Import the module

const handleSearchMock = vi.fn();

// Mock the useFilter hook
// vi.mock('../../../hooks/useFilter', () => ({
//   __esModule: true,
//   default: vi.fn().mockReturnValue({
//     handleSearch: handleSearchMock,
//     handlePageChange: vi.fn(),
//   }),
// }));

describe('OrderHistoryTableMobile', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        cleanup();
    });

    const mockData = [
        {
            transactionId: '12345',
            dateandtime: '2024-08-25T12:34:56Z',
            paymentMode: 'Credit Card',
            subscriptionName: 'Basic Plan',
            amount: 'AED 10.00',
            status: 'Active',
            plan: 'Plant Details',
        },
    ];

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state correctly', () => {
        vi.spyOn(useOrderHistoryTableModule, 'useOrderHistoryTable').mockReturnValue({
            data: [],
            isLoading: true,
            count: 0,
        });

        const { container } = render(<OrderHistoryTableMobile searchText="" />);

        // Check for the presence of the skeleton loader using the container
        const skeletonLoader = container.querySelector('.ant-skeleton');
        expect(skeletonLoader).toBeInTheDocument();

        // You can also check for specific elements within the skeleton loader
        const skeletonTitle = container.querySelector('.ant-skeleton-title');
        expect(skeletonTitle).toBeInTheDocument();

        const skeletonParagraphs = container.querySelectorAll('.ant-skeleton-paragraph li');
        expect(skeletonParagraphs.length).toBeGreaterThan(0);
    });

    it('renders empty state correctly', () => {
        vi.spyOn(useOrderHistoryTableModule, 'useOrderHistoryTable').mockReturnValue({
            data: [],
            isLoading: false,
            count: 0,
        });

        render(<OrderHistoryTableMobile searchText="" />);

        // Check if Empty component is rendered
        expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });

    it('renders data correctly', () => {
        vi.spyOn(useOrderHistoryTableModule, 'useOrderHistoryTable').mockReturnValue({
            data: mockData,
            isLoading: false,
            count: mockData.length,
        });
        render(<OrderHistoryTableMobile searchText="" />);

        expect(screen.getByText(/AED 10.00/i)).toBeInTheDocument();
        expect(screen.getByText(/Active/i)).toBeInTheDocument();
    });

    it('handles search input change', async () => {
        vi.spyOn(useFilterModule, 'default').mockReturnValue({
            handleSearch: handleSearchMock,
            handlePageChange: vi.fn(),
            handleDateChange(
                dates: NoUndefinedRangeValueType<Dayjs>,
                dateStrings: [string, string]
            ): void {
                throw new Error('Function not implemented.');
            },
            handleFromChange(date: Dayjs, dates: string | string[]): void {
                throw new Error('Function not implemented.');
            },
            handleToChange(date: Dayjs, dates: string | string[]): void {
                throw new Error('Function not implemented.');
            },
        });
        render(<OrderHistoryTableMobile searchText="" />);

        const searchInput = screen.getByPlaceholderText('Search for orders');
        fireEvent.change(searchInput, { target: { value: 'Test' } });

        await waitFor(() => {
            expect(handleSearchMock).toHaveBeenCalled();
            // Adjust the assertion to match the structure of SyntheticBaseEvent
            expect(handleSearchMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    target: expect.objectContaining({
                        value: 'Test',
                    }),
                })
            );
        });
    });
});
