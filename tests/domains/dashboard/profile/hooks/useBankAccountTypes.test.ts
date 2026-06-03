import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getAccountTypes } from '@src/domains/dashboard/profile/api/general';
import useBankAccountTypes from '@src/domains/dashboard/profile/hooks/useBankAccountTypes';
import { AccountTypeResponse } from '@src/domains/dashboard/profile/types/index';

vi.mock('@src/domains/dashboard/profile/api/general', () => ({
    getAccountTypes: vi.fn(),
}));

describe('useBankAccountTypes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch account types and update state', async () => {
        const mockResponse: AccountTypeResponse = {
            accountType: [
                { label: 'Savings', value: 'savings' },
                { label: 'Checking', value: 'checking' },
            ],
        };

        (getAccountTypes as any).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useBankAccountTypes());

        await waitFor(() => {
            expect(result.current.accountTypeList).toEqual(mockResponse.accountType);
        });

        expect(getAccountTypes).toHaveBeenCalledTimes(1);
    });

    it('should handle fetch failure gracefully', async () => {
        (getAccountTypes as any).mockResolvedValue(false);

        const { result } = renderHook(() => useBankAccountTypes());

        await waitFor(() => {
            expect(result.current.accountTypeList).toEqual([]);
        });

        expect(getAccountTypes).toHaveBeenCalledTimes(1);
    });
});
