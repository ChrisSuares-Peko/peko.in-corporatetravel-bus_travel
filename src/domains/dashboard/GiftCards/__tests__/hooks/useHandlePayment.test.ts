import { renderHook, act, cleanup } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi, Mock, afterEach } from 'vitest';

import useHandlePayment from '../../hooks/useHandlePayment';
import usePaymentRequest from '../../hooks/usePaymentRequest';

// Mock the usePaymentRequest hook
vi.mock('../../hooks/usePaymentRequest');

describe('useHandlePayment Hook', () => {
    const mockHandlePaymentRequest = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (usePaymentRequest as Mock).mockReturnValue({
            handlePaymentRequest: mockHandlePaymentRequest,
        });
    });
    afterEach(() => {
        cleanup();
    });
    const paymentData = { amount: 100, currency: 'USD' };
    it('should initialize with paymentSuccessful as false', () => {
        const { result } = renderHook(() => useHandlePayment());

        expect(result.current.paymentSuccessful).toBe(false);
    });

    it('should call handlePaymentRequest with correct data on handleSubmit', async () => {
        mockHandlePaymentRequest.mockResolvedValueOnce(true);

        const { result } = renderHook(() => useHandlePayment());

        await act(async () => {
            await result.current.handleSubmit(paymentData);
        });

        expect(mockHandlePaymentRequest).toHaveBeenCalledWith(paymentData);
    });

    it('should set paymentSuccessful to true when handlePaymentRequest is successful', async () => {
        mockHandlePaymentRequest.mockResolvedValueOnce(true);

        const { result } = renderHook(() => useHandlePayment());

        await act(async () => {
            await result.current.handleSubmit(paymentData);
        });

        expect(result.current.paymentSuccessful).toBe(true);
    });

    it('should set paymentSuccessful to false when handlePaymentRequest fails', async () => {
        mockHandlePaymentRequest.mockResolvedValueOnce(false);

        const { result } = renderHook(() => useHandlePayment());

        await act(async () => {
            await result.current.handleSubmit({});
        });

        expect(result.current.paymentSuccessful).toBe(false);
    });
});
