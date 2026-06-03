import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getPasswordPolicies } from '../../api';
import useGetPasswordPolicies from '../../hooks/useGetPasswordPolicies';

vi.mock('../../api', () => ({
    getPasswordPolicies: vi.fn(),
}));

describe('useGetPasswordPolicies', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default states', () => {
        const { result } = renderHook(() => useGetPasswordPolicies('testUser'));

        expect(result.current.isLoading).toBe(true);
        expect(result.current.respData).toBeUndefined();
    });

    it('should call getPasswordPolicies API with correct username and set response data on success', async () => {
        const mockResponse = {
            status: true,
            message: 'Policies fetched',
            responseCode: '200',
            data: {
                level: 1,
                minLength: 8,
                minPasswordAge: 1,
                maxPasswordAge: 90,
                minChangeChars: 3,
                prohibitPasswordReuse: true,
            },
        };

        (getPasswordPolicies as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useGetPasswordPolicies('testUser'));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.respData).toEqual(mockResponse.data);
        });

        expect(getPasswordPolicies).toHaveBeenCalledWith('testUser');
    });

    it('should handle API failure and set respData to undefined', async () => {
        (getPasswordPolicies as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useGetPasswordPolicies('testUser'));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.respData).toBeUndefined();
        });
    });

    it('should set isLoading to true during API call', async () => {
        (getPasswordPolicies as any).mockImplementation(() => new Promise(() => {}));

        const { result } = renderHook(() => useGetPasswordPolicies('testUser'));

        act(() => {
            expect(getPasswordPolicies).toHaveBeenCalledWith('testUser');
        });

        expect(result.current.isLoading).toBe(true);
    });

    it('should re-fetch data when username changes', async () => {
        const mockResponse1 = {
            status: true,
            message: 'Policies fetched',
            responseCode: '200',
            data: { level: 1 },
        };
        const mockResponse2 = {
            status: true,
            message: 'Policies fetched',
            responseCode: '200',
            data: { level: 2 },
        };

        (getPasswordPolicies as any)
            .mockResolvedValueOnce(mockResponse1)
            .mockResolvedValueOnce(mockResponse2);

        const { result, rerender } = renderHook(
            ({ username }) => useGetPasswordPolicies(username),
            {
                initialProps: { username: 'testUser1' },
            }
        );

        await waitFor(() => {
            expect(result.current.respData).toEqual(mockResponse1.data);
        });

        rerender({ username: 'testUser2' });

        await waitFor(() => {
            expect(result.current.respData).toEqual(mockResponse2.data);
        });
    });
});
