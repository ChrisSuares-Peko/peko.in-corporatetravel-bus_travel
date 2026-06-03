import { renderHook, act, cleanup } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, beforeEach, it, expect, Mock, afterEach } from 'vitest';

import { useAppSelector } from '@src/hooks/store'; // Adjust the path as necessary

import { makePayment } from '../../api/index';
import usePaymentRequest from '../../hooks/usePaymentRequest'; // Adjust the path as necessary

// Mock the necessary dependencies
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('../../api/index', () => ({
    makePayment: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('usePaymentRequest Hook', () => {
    const mockNavigate = vi.fn();
    const mockMakePayment = makePayment as Mock;
    const mockUseAppSelector = useAppSelector as Mock;
    const payload = {
        cardId: '12345',
        receiverFirstName: 'John',
        receiverLastName: 'Doe',
        receiverEmail: 'john.doe@example.com',
        receiverMobile: '+1234567890',
        gender: 'Male',
        amount: 50,
        quantity: 2,
        totalAmount: 100,
        senderName: 'Jane Smith',
        postcode: '123456',
        message: 'Happy Birthday! Enjoy your gift.',
        userType: 'customer',
        credentialId: 7890,
    };
    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as Mock).mockReturnValue(mockNavigate);

        mockUseAppSelector.mockReturnValue({
            role: 'userRole',
            id: 'userId',
        });
    });
    afterEach(() => {
        cleanup();
    });
    it('should call makePayment with correct parameters', async () => {
        const { result } = renderHook(() => usePaymentRequest());

        mockMakePayment.mockResolvedValueOnce(true);

        await act(async () => {
            await result.current.handlePaymentRequest(payload);
        });

        expect(mockMakePayment).toHaveBeenCalledWith({
            ...payload,
            credentialId: 'userId',
            userType: 'userRole',
        });
    });

    it('should navigate to success page on successful payment', async () => {
        const { result } = renderHook(() => usePaymentRequest());

        mockMakePayment.mockResolvedValueOnce(true);

        await act(async () => {
            await result.current.handlePaymentRequest(payload);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/gift-cards/success');
    });

    it('should navigate to failure page on failed payment', async () => {
        const { result } = renderHook(() => usePaymentRequest());

        mockMakePayment.mockResolvedValueOnce(false); // Mock failed payment

        await act(async () => {
            await result.current.handlePaymentRequest(payload);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/gift-cards/failure');
    });
});
