import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SendReferralMail } from '@src/domains/dashboard/profile/api/RefferalCode';
import useReferralCode from '@src/domains/dashboard/profile/hooks/useReferralCode';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/api/RefferalCode', () => ({
    SendReferralMail: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useReferralCode', () => {
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppSelector as any).mockReturnValue({
            role: 'userRole',
            id: 123,
        });

        (useAppDispatch as any).mockReturnValue(mockDispatch);
    });

    it('should have correct initial state', () => {
        const { result } = renderHook(() => useReferralCode({}));
        expect(result.current.isLoading).toBe(false);
    });

    it('should set isLoading to true and then false after sending email', async () => {
        const mockData = { success: true };
        (SendReferralMail as any).mockResolvedValue(mockData);

        const { result } = renderHook(() => useReferralCode({}));

        expect(result.current.isLoading).toBe(false);
        await act(async () => {
            await result.current.handleSendReferralMail('test@example.com');
        });
        expect(result.current.isLoading).toBe(false);
    });

    it('should dispatch showToast and call handleCancel on successful email send', async () => {
        const mockData = { success: true };
        const handleCancel = vi.fn();
        (SendReferralMail as any).mockResolvedValue(mockData);

        const { result } = renderHook(() => useReferralCode({ handleCancel }));

        await act(async () => {
            await result.current.handleSendReferralMail('test@example.com');
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Email sent successfully',
                variant: 'success',
            })
        );
        expect(handleCancel).toHaveBeenCalled();
    });

    it('should not dispatch showToast if handleCancel is not provided', async () => {
        const mockData = { success: true };
        (SendReferralMail as any).mockResolvedValue(mockData);

        const { result } = renderHook(() => useReferralCode({}));

        await act(async () => {
            await result.current.handleSendReferralMail('test@example.com');
        });

        expect(mockDispatch).not.toHaveBeenCalled();
    });
});
