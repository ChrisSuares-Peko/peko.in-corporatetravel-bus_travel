import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { planDetailsApi } from '@src/domains/dashboard/works/api/planDetailsApi';
import { usePlanDetailsApi } from '@src/domains/dashboard/works/hooks/usePlanDetailsApi';
import { useAppSelector } from '@src/hooks/store';
import { WorkPlan } from 'src/domains/dashboard/works/type/index';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@src/domains/dashboard/works/api/planDetailsApi', () => ({
    planDetailsApi: vi.fn(),
}));

describe('usePlanDetailsApi Hook', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockPlanDetailsApi = planDetailsApi as any;

    beforeEach(() => {
        mockUseAppSelector.mockClear();
        mockPlanDetailsApi.mockClear();
    });

    it('should set isLoading to true initially', () => {
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });

        const { result } = renderHook(() => usePlanDetailsApi('1'));

        expect(result.current.isLoading).toBe(true);
    });

    it('should set data and update loading state when API call is successful', async () => {
        const mockData: WorkPlan = {
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
        };

        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockPlanDetailsApi.mockResolvedValue(mockData);

        const { result } = renderHook(() => usePlanDetailsApi('1'));

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Check final state
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockData);
    });

    it('should set isLoading to false and data to undefined when API call fails', async () => {
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
        mockPlanDetailsApi.mockResolvedValue(false); // Simulate API failure

        const { result } = renderHook(() => usePlanDetailsApi('1'));

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Check final state
        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBeUndefined();
    });
});
