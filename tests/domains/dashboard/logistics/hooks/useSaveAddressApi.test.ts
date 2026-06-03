import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { saveAddressApi } from '@src/domains/dashboard/logistics/api/address';
import { useSaveAddressApi } from '@src/domains/dashboard/logistics/hooks/useSaveAddressApi';
import { useAppSelector } from '@src/hooks/store';

vi.mock('@src/domains/dashboard/logistics/api/address', () => ({
    saveAddressApi: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('useSaveAddressApi', () => {
    beforeEach(() => {
        (useAppSelector as any).mockReturnValue({ role: 'admin', id: 1 });
    });

    it('should handle sender address correctly', async () => {
        (saveAddressApi as any).mockResolvedValueOnce({ success: true });

        const { result } = renderHook(() => useSaveAddressApi());

        expect(result.current.isLoading).toBe(true);

        await act(async () => {
            const response = await result.current.handleSenderAddress({
                Line1: '123 Main St',
                Line2: 'Apt 4B',
                Line3: 'Contact Name',
                City: 'Springfield',
                CountryCode: 'US',
                Description: 'desc@example.com',
                PostCode: '12345',
            });
            // Use waitFor to wait for the state to update
            await waitFor(() => expect(result.current.isLoading).toBe(true));
            expect(response).toEqual({ success: true });
        });
    });

    it('should return false when saveAddressApi fails for sender address', async () => {
        (saveAddressApi as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useSaveAddressApi());

        await act(async () => {
            const response = await result.current.handleSenderAddress({
                Line1: '123 Main St',
                Line2: 'Apt 4B',
                Line3: 'Contact Name',
                City: 'Springfield',
                CountryCode: 'US',
                Description: 'desc@example.com',
                PostCode: '12345',
            });
            // Use waitFor to wait for the state to update
            await waitFor(() => expect(result.current.isLoading).toBe(true));
            expect(response).toBe(false);
        });
    });

    // Similar test can be written for handleRecieverAddress function.
});
