import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import HistoryTable from '@domains/dashboard/officeSupplies/components/OrderHistory/HistoryTable';
import { useOrderHistoryApi } from '@domains/dashboard/officeSupplies/hooks/useOrderHistoryApi';

vi.mock('@domains/dashboard/officeSupplies/hooks/useOrderHistoryApi', () => ({
    useOrderHistoryApi: vi.fn(),
}));

describe('HistoryTable Component', () => {
    beforeEach(() => {
        vi.mocked(useOrderHistoryApi).mockReturnValue({
            orders: [
                {
                    id: 1,
                    transactionId: '123ABC',
                    date: '2024-01-01T00:00:00Z',
                    amount: '100.00',
                    status: 'completed',
                    products: [{ productName: 'Product 1' }],
                },
                {
                    id: 2,
                    transactionId: '456DEF',
                    date: '2024-01-02T00:00:00Z',
                    amount: '200.00',
                    status: 'pending',
                    products: [{ productName: 'Product 2' }],
                },
            ],
            isLoading: false,
            count: 2,
        });
    });

    const setup = () =>
        render(
            <MemoryRouter>
                <HistoryTable />
            </MemoryRouter>
        );

    it('should render the table with order history', () => {
        setup();

        expect(screen.getByText('Date')).toBeInTheDocument();
        expect(screen.getByText('Product Name')).toBeInTheDocument();
        expect(screen.getByText('Order ID')).toBeInTheDocument();
        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();

        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('AED 100.00')).toBeInTheDocument();
        expect(screen.getByText('AED 200.00')).toBeInTheDocument();
    });

    it('should render the correct status with appropriate styling', () => {
        setup();

        expect(screen.getByText('completed').closest('span')).toHaveStyle('color: #26A411');
        expect(screen.getByText('pending').closest('span')).toHaveStyle('color: #CD9300');
    });

    it('should navigate to the correct order details page on View Details click', () => {
        setup();

        const viewDetailsLinks = screen.getAllByText('View Details');

        // Test for the first order
        expect(viewDetailsLinks[0]).toHaveAttribute(
            'href',
            '/office-supplies/order-history/order-details/1'
        );

        // Test for the second order
        expect(viewDetailsLinks[1]).toHaveAttribute(
            'href',
            '/office-supplies/order-history/order-details/2'
        );
    });
});
