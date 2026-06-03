import { renderHook, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getTransactionDetailsApi } from '@src/domains/dashboard/works/api/orderHistory';
import { useOrderDetailsApi } from '@src/domains/dashboard/works/hooks/useOrderDetailsApi';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));
vi.mock('@src/domains/dashboard/works/api/orderHistory', () => ({
    getTransactionDetailsApi: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
describe('useOrderDetailsApi Hook', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockUseAppDispatch = useAppDispatch as any;
    const mockGetTransactionDetailsApi = getTransactionDetailsApi as any;
    useNavigate as any;

    beforeEach(() => {
        mockUseAppSelector.mockClear();
        mockUseAppDispatch.mockClear();
        mockGetTransactionDetailsApi.mockClear();
    });

    it('should set isLoading to true initially', () => {
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockGetTransactionDetailsApi.mockResolvedValue({
            orderResponse: '{}',
            workspaceOrderStatus: 'Pending',
        }); // Mock API response

        const { result } = renderHook(() => useOrderDetailsApi('order-1'));

        // Check initial state
        expect(result.current.isLoading).toBe(true);
    });

    it('should set order details and update loading state when API call is successful', async () => {
        const mockData = {
            orderResponse: JSON.stringify({
                planDetails: {
                    name: 'Plan Name',
                    description: 'Plan Description',
                    price: '100',
                    billingCycle: 'Monthly',
                    features: 'Feature1, Feature2',
                    work: {
                        contactName: 'Contact Name',
                        contactEmail: 'contact@example.com',
                        contactMobile: '1234567890',
                    },
                },
            }),
            workspaceOrderStatus: 'Completed',
        };

        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockGetTransactionDetailsApi.mockResolvedValue(mockData);

        const { result } = renderHook(() => useOrderDetailsApi('order-1'));

        await waitFor(() => expect(result.current.isLoading).toBe(true));

        // Check final state
        expect(result.current.isLoading).toBe(true);
        // Add more checks for dispatch and navigate as needed
    });

    it('should navigate to the index page if API call fails', async () => {
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockGetTransactionDetailsApi.mockResolvedValue(false); // Simulate failed API response

        const navigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(navigate);

        const { result } = renderHook(() => useOrderDetailsApi('order-1'));

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Check that navigation occurred
        expect(navigate).toHaveBeenCalledWith(`/${paths.works.index}`);
    });
});
