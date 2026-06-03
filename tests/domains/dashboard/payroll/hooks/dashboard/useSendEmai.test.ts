import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest';

import { sendEmail } from '@src/domains/dashboard/Payroll/api/dashBoardIndex'; // Mock this API
import { useSendEmail } from '@src/domains/dashboard/Payroll/hooks/dashboardHooks/useEmailSendApi'; // The hook
import { useAppSelector } from '@src/hooks/store';
import '@testing-library/jest-dom/vitest';

vi.mock('@src/hooks/store', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
        ...actual,
        useAppSelector: vi.fn(),
    };
});

vi.mock('@src/domains/dashboard/Payroll/api/dashBoardIndex', async importOriginal => {
    const actual = (await importOriginal()) as Record<string, any>;
    return {
        ...actual,
        sendEmail: vi.fn(),
    };
});

describe('useSendEmail hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should successfully send email and return true', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mocking the API call to return a successful response
        const mockResponse = { success: true };
        (sendEmail as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useSendEmail());

        // Initially, isLoading should be false
        expect(result.current.isLoading).toBe(false);

        // Trigger the hook to send email
        act(() => {
            result.current.sendEmails('holiday123');
        });

        // Wait for isLoading to become true
        await waitFor(() => expect(result.current.isLoading).toBe(true));

        // Wait for isLoading to become false again
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Asserting the correct API call is made
        expect(sendEmail).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            holidayId: 'holiday123',
        });
    });

    it('should handle API failure and return false', async () => {
        // Mocking the Redux selector
        (useAppSelector as Mock).mockReturnValue({
            role: 'user',
            id: '456',
        });

        // Mock the API call to throw an error
        (sendEmail as Mock).mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useSendEmail());

        // Initially, isLoading should be false
        expect(result.current.isLoading).toBe(false);

        // Trigger the hook to send email
        act(() => {
            result.current.sendEmails('holiday456');
        });

        // Wait for isLoading to become true
        await waitFor(() => expect(result.current.isLoading).toBe(true));

        // Wait for isLoading to become false again
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        // Asserting the correct API call is made
        expect(sendEmail).toHaveBeenCalledWith({
            userId: '456',
            userType: 'user',
            holidayId: 'holiday456',
        });
    });
});
