import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { cancelbookings } from '@domains/dashboard/Hotels/Api';
import useBookingCancelApi from '@domains/dashboard/Hotels/hooks/useBookingCancelApi';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Hotels/Api', () => ({
    cancelbookings: vi.fn(),
}));

describe('useBookingCancelApi', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({
            role: 'user',
            id: '123',
            corporateTxnId: 'corpTxnId',
        });
    });

    it('should cancel booking successfully and set loader to false', async () => {
        const mockResponse = {
            status: 'success',
            message: 'Booking cancelled successfully',
        };
        (cancelbookings as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useBookingCancelApi());

        await act(async () => {
            await result.current.cancelBooked('booking123', 'conversation456', 'otp', 'scope');
        });

        expect(cancelbookings).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            conversationId: 'conversation456',
            bookingReferenceId: 'booking123',
            selectedCorporateTxnId: 'corpTxnId',
            otp: 'otp',
            scope: 'scope',
        });
        expect(result.current.loader).toBe(false);
    });

    it('should handle API failure gracefully and set loader to false', async () => {
        (cancelbookings as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useBookingCancelApi());

        await act(async () => {
            await result.current.cancelBooked('booking123', 'conversation456', 'otp', 'scope');
        });

        expect(cancelbookings).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            conversationId: 'conversation456',
            bookingReferenceId: 'booking123',
            selectedCorporateTxnId: 'corpTxnId',
            otp: 'otp',
            scope: 'scope',
        });
        expect(result.current.loader).toBe(false);
    });

    it('should set loader to true while the API call is in progress', async () => {
        (cancelbookings as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(true), 100))
        );

        const { result } = renderHook(() => useBookingCancelApi());

        act(() => {
            result.current.cancelBooked('booking123', 'conversation456', 'otp', 'scope');
        });

        expect(result.current.loader).toBe(true);

        await act(async () => {
            // Wait for the mock API to resolve
            await new Promise(resolve => setTimeout(resolve, 100));
        });

        expect(result.current.loader).toBe(false);
    });

    it('should set loader to false after the API call regardless of success or failure', async () => {
        (cancelbookings as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useBookingCancelApi());

        await act(async () => {
            await result.current.cancelBooked('booking123', 'conversation456', 'otp', 'scope');
        });

        expect(result.current.loader).toBe(false);
    });
});
