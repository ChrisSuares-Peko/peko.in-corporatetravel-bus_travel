import { renderHook, act } from '@testing-library/react';
// import { message } from 'antd';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

import { trackShipment } from '@src/domains/dashboard/logistics/api';
import { useTrackShipmentApi } from '@src/domains/dashboard/logistics/hooks/useTrackShipmentApi';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/api', () => ({
    trackShipment: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useTrackShipmentApi', () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockReturnValue({ role: 'user', id: 123 });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default state', () => {
        const { result } = renderHook(() => useTrackShipmentApi());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toEqual({});
    });

    it('should track a shipment successfully', async () => {
        const mockResponse = {
            TrackingResults: [{ Key: '123', Value: [] }],
            orderResponse: 'order123',
            shipmentStatus: [],
            amount: '100',
            NonExistingWaybills: [],
        };

        (trackShipment as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useTrackShipmentApi());

        await act(async () => {
            const data = await result.current.handleTrackShipment('TRACK123');
            expect(data).toEqual({
                trackingNo: '123',
                trackingValues: [],
                orderResponse: 'order123',
                shipmentStatus: [],
                amount: '100',
            });
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual({
            trackingNo: '123',
            trackingValues: [],
            orderResponse: 'order123',
            shipmentStatus: [],
            amount: '100',
        });
        expect(trackShipment).toHaveBeenCalledWith({
            userId: 123,
            userType: 'user',
            trackingNumber: 'TRACK123',
        });
    });

    it('should handle non-existing waybills and show a warning', async () => {
        const mockResponse = {
            TrackingResults: [],
            orderResponse: '',
            shipmentStatus: [],
            amount: '',
            NonExistingWaybills: ['TRACK123'],
        };

        (trackShipment as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useTrackShipmentApi());

        await act(async () => {
            const data = await result.current.handleTrackShipment('TRACK123');
            expect(data).toBe(false);
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({ description: 'Invalid tracking number', variant: 'warning' })
        );
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle an API error and show an error toast', async () => {
        (trackShipment as any).mockResolvedValue(false);

        const { result } = renderHook(() => useTrackShipmentApi());

        await act(async () => {
            const data = await result.current.handleTrackShipment('TRACK123');
            expect(data).toBe(false);
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Unable to search shipments. Please try again.',
                variant: 'error',
            })
        );
        expect(result.current.isLoading).toBe(false);
    });
});
