import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getPasswordPolicies } from '@src/domains/dashboard/profile/api/basicInfo';
import useGetPasswordPolicies from '@src/domains/dashboard/profile/hooks/useGetPasswordPolicies';
import { PasswordPolicy } from '@src/domains/dashboard/profile/types';
import { useAppSelector } from '@src/hooks/store';

vi.mock('@src/domains/dashboard/profile/api/basicInfo', () => ({
    getPasswordPolicies: vi.fn(),
}));

// Mock the useAppSelector hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('useGetPasswordPolicies', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial loading state', () => {
        const mockState = {
            reducer: {
                auth: {
                    role: 'user',
                    id: '123',
                },
            },
        };
        (useAppSelector as any).mockImplementation((selector: (state: typeof mockState) => any) =>
            selector(mockState)
        );

        const { result } = renderHook(() => useGetPasswordPolicies());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.respData).toBeUndefined();
    });

    it('should fetch and set password policies', async () => {
        const mockPolicy: PasswordPolicy = {
            level: 1,
            minLength: 8,
            minPasswordAge: 1,
            maxPasswordAge: 90,
            minChangeChars: 3,
            prohibitPasswordReuse: true,
            prohibitPasswordReuseTimes: 5,
            maxInvalidLoginAttempts: 3,
            lockEffectivePeriod: 30,
            lockoutTimespan: 15,
            enableBannedPasswords: true,
            customBannedPasswords: 'password,123456',
            preventPersonalDataInPassword: true,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-02',
        };
        (getPasswordPolicies as any).mockResolvedValue({ data: [mockPolicy] });

        const mockState = {
            reducer: {
                auth: {
                    role: 'user',
                    id: '123',
                },
            },
        };
        (useAppSelector as any).mockImplementation((selector: (state: typeof mockState) => any) =>
            selector(mockState)
        );

        const { result } = renderHook(() => useGetPasswordPolicies());

        await waitFor(() => {
            expect(getPasswordPolicies).toHaveBeenCalledWith({ userId: '123', userType: 'user' });
            expect(result.current.isLoading).toBe(false);
            expect(result.current.respData).toEqual(mockPolicy);
        });
    });

    it('should handle API failure', async () => {
        (getPasswordPolicies as any).mockResolvedValue(false);

        const mockState = {
            reducer: {
                auth: {
                    role: 'user',
                    id: '123',
                },
            },
        };
        (useAppSelector as any).mockImplementation((selector: (state: typeof mockState) => any) =>
            selector(mockState)
        );

        const { result } = renderHook(() => useGetPasswordPolicies());

        await waitFor(() => {
            expect(getPasswordPolicies).toHaveBeenCalledWith({ userId: '123', userType: 'user' });
            expect(result.current.isLoading).toBe(false);
            expect(result.current.respData).toBeUndefined();
        });
    });
});
