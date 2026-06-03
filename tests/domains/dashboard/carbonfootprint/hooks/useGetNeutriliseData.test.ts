import { renderHook, act, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getNeutriliseNowData } from '@src/domains/dashboard/carbonFootprint/api';
import useGetNeutriliseData from '@src/domains/dashboard/carbonFootprint/hooks/useGetNeutriliseData';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/domains/dashboard/carbonFootprint/api', () => ({
    getNeutriliseNowData: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('useGetNeutriliseData', () => {
    const mockNavigate = vi.fn();
    const mockResponseData = {
        data: {
            id: 1,
            name: 'Project One',
            rate: {
                priceToPartner: 75,
            },
            packages: [{ id: 1, name: 'Package One', credits: 100 }],
        },
        usdToAed: 3.67,
        calculatedRate: 10,
        co2FootPrint: 50,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useAppSelector as any).mockReturnValue({
            role: 'user',
            id: '123',
        });
    });

    it('should fetch and set project data on initial load', async () => {
        (getNeutriliseNowData as any).mockResolvedValue(mockResponseData);

        const { result } = renderHook(() => useGetNeutriliseData(1));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.projectData).toEqual(mockResponseData.data);
        expect(result.current.ConversionUsdToAed).toEqual(mockResponseData.usdToAed);
        expect(result.current.calculatedRate).toEqual(
            (mockResponseData.calculatedRate * mockResponseData.usdToAed).toFixed(2)
        );
        expect(result.current.value).toEqual(
            mockResponseData.data.rate.priceToPartner * mockResponseData.usdToAed
        );
        expect(result.current.co2FootPrint).toEqual(mockResponseData.co2FootPrint);
    });

    it('should handle amount change and update credit accordingly', async () => {
        (getNeutriliseNowData as any).mockResolvedValue(mockResponseData);

        const { result } = renderHook(() => useGetNeutriliseData(1));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        act(() => {
            result.current.handleAmountChange({
                target: { value: '100' },
            });
        });

        expect(result.current.amount).toEqual('100');
        expect(result.current.credit).toEqual((100 / result.current.value).toFixed(4));
    });

    it('should handle credit change and update amount accordingly', async () => {
        (getNeutriliseNowData as any).mockResolvedValue(mockResponseData);

        const { result } = renderHook(() => useGetNeutriliseData(1));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        act(() => {
            result.current.handleCreditChange({
                target: { value: '10' },
            });
        });

        expect(result.current.credit).toEqual('10');
        expect(result.current.amount).toEqual(
            parseFloat((10 * result.current.value).toFixed(2)).toString()
        );
    });

    it('should handle package selection and reset amount and credit', async () => {
        (getNeutriliseNowData as any).mockResolvedValue(mockResponseData);

        const { result } = renderHook(() => useGetNeutriliseData(1));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        act(() => {
            result.current.handleSelectPackage({ target: { value: 0 } });
        });

        expect(result.current.selectedPackage).toEqual(0);

        // If initial amount or credit can be undefined, handle that in the test
        expect(result.current.amount ?? '').toBe('');
        expect(result.current.credit ?? '').toBe('');
    });

    it('should handle full neutrilization and update amount and credit', async () => {
        (getNeutriliseNowData as any).mockResolvedValue(mockResponseData);

        const { result } = renderHook(() => useGetNeutriliseData(1));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        act(() => {
            result.current.handleNeutrilizefull();
        });

        expect(result.current.credit).toEqual(mockResponseData.co2FootPrint);
        expect(result.current.amount).toEqual(
            parseFloat((mockResponseData.co2FootPrint * result.current.value).toFixed(2)).toString()
        );
    });

    it('should navigate to project listing if no projectId is provided', () => {
        renderHook(() => useGetNeutriliseData(undefined));

        expect(mockNavigate).toHaveBeenCalledWith(
            `${paths.dashboard.moreServices}/${paths.zeroCarbon.index}/${paths.zeroCarbon.projectListing}`
        );
    });
});
