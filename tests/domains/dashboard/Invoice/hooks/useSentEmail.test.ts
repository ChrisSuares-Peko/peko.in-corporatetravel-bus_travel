import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { sendEmaill } from '@domains/dashboard/Invoice/api';
import useSentEmail from '@domains/dashboard/Invoice/hooks/useSentEmail';
import { sendEmailTypes } from '@domains/dashboard/Invoice/types';
import { useAppDispatch } from '@src/hooks/hooks';
import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock dependencies
vi.mock('@src/hooks/hooks', () => ({
    useAppDispatch: vi.fn(),
}));
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    sendEmaill: vi.fn(),
}));
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useSentEmail', () => {
    const mockDispatch = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
    });

    it('should send email and show success toast on success', async () => {
        (sendEmaill as any).mockResolvedValueOnce(true);

        const { result } = renderHook(() => useSentEmail());

        const mockPayload: sendEmailTypes = {
            email: 'test@example.com',
            invoiceId: 1,
        };

        await act(async () => {
            await result.current.sendEmail(mockPayload);
        });

        expect(sendEmaill).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            ...mockPayload,
        });
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: `Email has been sent`,
                variant: 'success',
            })
        );
        expect(result.current.loader).toBe(false);
    });

    it('should show error toast if sending email fails', async () => {
        (sendEmaill as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useSentEmail());

        const mockPayload: sendEmailTypes = {
            email: 'test@example.com',
            invoiceId: 1,
        };

        await act(async () => {
            await result.current.sendEmail(mockPayload);
        });

        expect(sendEmaill).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            ...mockPayload,
        });
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: `Some error happened while sending`,
                variant: 'error',
            })
        );
        expect(result.current.loader).toBe(false);
    });

    it('should set loading state correctly during email sending', async () => {
        (sendEmaill as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(true), 100))
        );

        const { result } = renderHook(() => useSentEmail());

        const mockPayload: sendEmailTypes = {
            email: 'test@example.com',
            invoiceId: 1,
        };

        act(() => {
            result.current.sendEmail(mockPayload);
        });

        expect(result.current.loader).toBe(true);

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(result.current.loader).toBe(false);
    });
});
