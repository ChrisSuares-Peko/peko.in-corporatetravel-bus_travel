import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { plansApi } from '@src/domains/dashboard/works/api/plansApi';
import { usePlansApi } from '@src/domains/dashboard/works/hooks/usePlansApi';
import { PlansResponse } from '@src/domains/dashboard/works/type/index';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@src/domains/dashboard/works/api/plansApi', () => ({
    plansApi: vi.fn(),
}));

describe('usePlansApi Hook', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockPlansApi = plansApi as any;

    beforeEach(() => {
        // Clear previous mock calls
        mockUseAppSelector.mockClear();
        mockPlansApi.mockClear();
    });

    it('should set isLoading to true initially', () => {
        // Mocking initial selector response
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });

        // Render the hook
        const { result } = renderHook(() => usePlansApi('1'));

        // Initial state assertions
        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toEqual([]);
    });

    it('should set data and update loading state when API call is successful', async () => {
        const mockData: PlansResponse = {
            data: [
                {
                    id: 1,
                    name: 'Plan A',
                    description: 'Description for Plan A',
                    price: '100',
                    billingCycle: 'Monthly',
                    features: 'Feature 1, Feature 2',
                    status: true,
                    popular: false,
                    createdAt: '2024-01-01',
                    updatedAt: '2024-01-02',
                    workId: 10,
                },
            ],
        };

        // Mock successful selector and API responses
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockPlansApi.mockResolvedValue(mockData);

        // Render the hook
        const { result } = renderHook(() => usePlansApi('1'));

        // Wait for state updates
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Final state assertions
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockData.data);
    });

    it('should set isLoading to false and data to an empty array when API call fails', async () => {
        // Mock selector and a failed API response
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockPlansApi.mockResolvedValue(false); // Simulate API failure

        // Render the hook
        const { result } = renderHook(() => usePlansApi('1'));

        // Wait for state updates
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Final state assertions
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual([]);
    });
});
