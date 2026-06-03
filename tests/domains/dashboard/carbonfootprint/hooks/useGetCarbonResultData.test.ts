import { renderHook } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import useGetCarbonResultData from '@src/domains/dashboard/carbonFootprint/hooks/useGetCarbonResultData';
import { paths } from '@src/routes/paths';

// Mock useNavigate from react-router-dom
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

describe('useGetCarbonResultData', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        (useNavigate as any).mockReturnValue(mockNavigate);
        vi.clearAllMocks();
    });

    it('should set state correctly when state data is provided', async () => {
        const state = {
            data: {
                totalCo2Usage: '1000',
                groupedByCategory: [{ category: 'Energy', co2Usage: 500 }],
            },
            advanced: true,
        };

        const { result } = renderHook(() => useGetCarbonResultData(state));

        expect(result.current.totalCo2Usage).toBe('1000');
        expect(result.current.groupedByCategory).toEqual([{ category: 'Energy', co2Usage: 500 }]);
        expect(result.current.advancedCal).toBe(true);
    });

    it('should navigate to carbon calculator when state is not provided', () => {
        renderHook(() => useGetCarbonResultData(null));

        expect(mockNavigate).toHaveBeenCalledWith(
            `/${paths.zeroCarbon.index}/${paths.zeroCarbon.carbonCalculator}`
        );
    });

    it('should set advancedCal to false when state.advanced is false', () => {
        const state = {
            data: {
                totalCo2Usage: '1000',
                groupedByCategory: [{ category: 'Energy', co2Usage: 500 }],
            },
            advanced: false,
        };

        const { result } = renderHook(() => useGetCarbonResultData(state));

        expect(result.current.advancedCal).toBe(false);
    });
});
