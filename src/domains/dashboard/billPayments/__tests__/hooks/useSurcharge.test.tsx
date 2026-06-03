import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MockStoreEnhanced } from 'redux-mock-store';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getSurcharge } from '@src/services/surcharge';
import { createTestStore } from '@store/store';

import GetSurcharge from '../../hooks/useSurcharge';

// Mock dependencies
vi.mock('@src/services/surcharge', () => ({
    getSurcharge: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: () => ({
        role: 'userRole',
        id: 'userId',
    }),
}));

describe('GetSurcharge', () => {
    let mockStore: MockStoreEnhanced<unknown, {}>;

    beforeEach(() => {
        mockStore = createTestStore();
        vi.clearAllMocks();
    });

    it('should initialize with default states', () => {
        const { result } = renderHook(() => GetSurcharge(), {
            wrapper: ({ children }: { children: any }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        expect(result.current.surchargeData).toBeUndefined();
        expect(result.current.isLoading).toBe(true);
    });

    it('should set isLoading to false and update surchargeData on successful API call', async () => {
        const mockResponse = {
            data: 'mockData',
        };
        (getSurcharge as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => GetSurcharge(), {
            wrapper: ({ children }: { children: any }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        await act(async () => {
            await result.current.getSurchargeData(100, 'accessKey');
        });

        expect(result.current.surchargeData).toEqual(mockResponse);
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failure and keep isLoading as true', async () => {
        (getSurcharge as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => GetSurcharge(), {
            wrapper: ({ children }: { children: any }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        await act(async () => {
            await result.current.getSurchargeData(100, 'accessKey');
        });

        expect(result.current.surchargeData).toBeUndefined();
        expect(result.current.isLoading).toBe(true);
    });

    it('should correctly call getSurcharge with the right arguments', async () => {
        const mockResponse = {
            data: 'mockData',
        };
        (getSurcharge as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => GetSurcharge(), {
            wrapper: ({ children }: { children: any }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        await act(async () => {
            await result.current.getSurchargeData(100, 'accessKey');
        });

        expect(getSurcharge).toHaveBeenCalledWith({
            userId: 'userId',
            userType: 'userRole',
            amount: 100,
            accessKey: 'accessKey',
        });
    });
});
