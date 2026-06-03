import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
    getSelectProjects,
    getNeutriliseNowData,
} from '@src/domains/dashboard/carbonFootprint/api';
import useGetSelectProjects from '@src/domains/dashboard/carbonFootprint/hooks/useGetSelectProjects';
import * as reduxHooks from '@src/hooks/store';

// Mock API calls
vi.mock('@src/domains/dashboard/carbonFootprint/api', () => ({
    getSelectProjects: vi.fn(),
    getNeutriliseNowData: vi.fn(),
}));

describe('useGetSelectProjects', () => {
    const mockSelectProjects = {
        projectOptions: [
            { id: 1, name: 'Project One' },
            { id: 2, name: 'Project Two' },
        ],
    };

    const mockNeutrilizeResponse = {
        success: true,
        data: {
            id: 1,
            name: 'Project One',
            rate: {
                priceToPartner: 75,
            },
        },
        usdToAed: 3.67,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock the useAppSelector hook
        vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue({
            role: 'user',
            id: '1',
        });
    });

    it('should fetch and set project options on initial load', async () => {
        (getSelectProjects as any).mockResolvedValue(mockSelectProjects);

        const { result } = renderHook(() => useGetSelectProjects());

        await waitFor(() => {
            expect(result.current.selectData).toEqual(mockSelectProjects.projectOptions);
            expect(result.current.selected).toEqual(mockSelectProjects.projectOptions[0].id);
        });
    });

    it('should fetch and set project data when a project is selected', async () => {
        (getSelectProjects as any).mockResolvedValue(mockSelectProjects);
        (getNeutriliseNowData as any).mockResolvedValue(mockNeutrilizeResponse);

        const { result } = renderHook(() => useGetSelectProjects());

        await waitFor(() => {
            expect(result.current.selectData).toEqual(mockSelectProjects.projectOptions);
        });

        act(() => {
            result.current.changeSelectedOption(2);
        });

        await waitFor(() => {
            expect(result.current.projectData).toEqual(mockNeutrilizeResponse.data);
            expect(result.current.ConversionUsdToAed).toEqual(mockNeutrilizeResponse.usdToAed);
            expect(result.current.value).toEqual(
                mockNeutrilizeResponse.data.rate.priceToPartner * mockNeutrilizeResponse.usdToAed
            );
        });
    });

    it('should handle amount changes and update credit accordingly', async () => {
        (getNeutriliseNowData as any).mockResolvedValue(mockNeutrilizeResponse);

        const { result } = renderHook(() => useGetSelectProjects());

        // Ensure initial value is set
        await waitFor(() => {
            expect(result.current.value).toBeDefined();
        });

        act(() => {
            result.current.handleAmountChange({ target: { value: '100' } });
        });
        await waitFor(() => {
            expect(result.current.amount).toEqual('100');
        });
        const expectedCredit = (100 / (result.current.value || 1)).toFixed(4);
        await waitFor(() => {
            expect(result.current.credit).toEqual(expectedCredit);
        });
    });

    it('should handle credit changes and update amount accordingly', async () => {
        (getNeutriliseNowData as any).mockResolvedValue(mockNeutrilizeResponse);

        const { result } = renderHook(() => useGetSelectProjects());

        act(() => {
            result.current.handleCreditChange({ target: { value: '10' } });
        });

        await waitFor(() => {
            expect(result.current.credit).toEqual('10');
        });

        const expectedAmount = (10 * (result.current.value || 1)).toFixed(2);

        act(() => {
            // Re-run the effect or re-render if needed
            result.current.handleCreditChange({ target: { value: '10' } });
        });

        await waitFor(() => {
            expect(parseFloat(result.current.amount).toFixed(2)).toEqual(expectedAmount);
        });
    });

    it('should handle package selection and reset amount and credit', async () => {
        const { result } = renderHook(() => useGetSelectProjects());

        act(() => {
            result.current.handleAmountChange({ target: { value: '100' } });
            result.current.handleCreditChange({ target: { value: '10' } });
        });

        act(() => {
            result.current.handleSelectPackage({ target: { value: 'package1' } });
        });

        await waitFor(() => {
            expect(result.current.selectedPackage).toEqual('package1');
            expect(result.current.amount).toBe('');
            expect(result.current.credit).toBe('');
        });
    });
});
