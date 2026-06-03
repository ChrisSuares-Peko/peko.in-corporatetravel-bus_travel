import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { sendEmail } from '@domains/dashboard/Invoice/api';
import useSendMail from '@domains/dashboard/Invoice/hooks/useSendMail';
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
    sendEmail: vi.fn(),
}));
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useSendMail', () => {
    const mockDispatch = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
    });

    it('should send email and show success toast on success', async () => {
        (sendEmail as any).mockResolvedValueOnce(true);

        const { result } = renderHook(() => useSendMail());

        const mockPayload = {
            email: 'test@example.com',
            subject: 'Test Subject',
            body: 'Test Body',
        };

        await act(async () => {
            await result.current.sendMail(mockPayload);
        });

        expect(sendEmail).toHaveBeenCalledWith({
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
        expect(result.current.loading).toBe(false);
    });

    it('should show error toast if sending email fails', async () => {
        (sendEmail as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useSendMail());

        const mockPayload = {
            email: 'test@example.com',
            subject: 'Test Subject',
            body: 'Test Body',
        };

        await act(async () => {
            await result.current.sendMail(mockPayload);
        });

        expect(sendEmail).toHaveBeenCalledWith({
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
        expect(result.current.loading).toBe(false);
    });

    it('should set loading state correctly during email sending', async () => {
        (sendEmail as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(true), 100))
        );

        const { result } = renderHook(() => useSendMail());

        const mockPayload = {
            email: 'test@example.com',
            subject: 'Test Subject',
            body: 'Test Body',
        };

        act(() => {
            result.current.sendMail(mockPayload);
        });

        expect(result.current.loading).toBe(true);

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(result.current.loading).toBe(false);
    });
});
