// useDarbApi.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'; // Make sure to use react-hooks package
import { describe, it, expect, vi, Mock } from 'vitest';

import { useAppSelector } from '@src/hooks/store';

import { getBalanceApi } from '../../../api/darb';
import { useDarbApi } from '../../../hooks/darb/useDarbApi';
import { GetLimitResponse } from '../../../types';

// Mock the necessary functions and hooks
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('../../../api/darb', () => ({
    getBalanceApi: vi.fn(),
}));

describe('useDarbApi', () => {
    it('should initially set loading state to true', () => {
        // Mock the useAppSelector hook to return dummy values
        (useAppSelector as any).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        const { result } = renderHook(() => useDarbApi());
        expect(result.current.isLoading).toBe(true);
        expect(result.current.limitData).toBeUndefined();
    });

    it('should set limitData and loading to false on successful API call', async () => {
        // Mock the useAppSelector hook to return dummy values
        (useAppSelector as any).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mock the getBalanceApi function
        const mockResponse: GetLimitResponse = {
            minDenomination: 10,
            maxDenomination: 1000,
            flexiKey: 'someFlexiKey',
            typeKey: 1,
            accessKey: 'someAccessKey',
            serviceProvider: 'someServiceProvider',
            surcharge: '5%',
        };
        (getBalanceApi as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useDarbApi());

        await act(async () => {
            await result.current.getBalance('eid123', 'trafficNo123', 'flexiKey123');
        });

        // Wait for state updates
        await waitFor(() => {
            expect(getBalanceApi).toHaveBeenCalledWith({
                userId: '123',
                userType: 'admin',
                eid: 'eid123',
                trafficNo: 'trafficNo123',
                flexiKey: 'flexiKey123',
            });
            expect(result.current.limitData).toEqual(mockResponse);
        });
    });

    it('should handle API failure correctly', async () => {
        // Mock the useAppSelector hook to return dummy values
        (useAppSelector as any).mockReturnValue({
            role: 'admin',
            id: '123',
        });

        // Mock the getBalanceApi function to return false
        (getBalanceApi as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useDarbApi());

        await act(async () => {
            await result.current.getBalance('eid123', 'trafficNo123', 'flexiKey123');
        });

        // Wait for state updates
        await waitFor(() => {
            expect(getBalanceApi).toHaveBeenCalledWith({
                userId: '123',
                userType: 'admin',
                eid: 'eid123',
                trafficNo: 'trafficNo123',
                flexiKey: 'flexiKey123',
            });
            expect(result.current.limitData).toBeUndefined();
            expect(result.current.isLoading).toBe(false);
        });
    });
});
