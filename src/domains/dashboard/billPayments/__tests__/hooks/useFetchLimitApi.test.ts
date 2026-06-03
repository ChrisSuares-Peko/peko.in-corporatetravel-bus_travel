import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { getLimit } from '../../api';
import { useFetchLimitApi } from '../../hooks/useFetchLimitApi';
import { GetLimitResponse } from '../../types';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('../../api', () => ({
    getLimit: vi.fn(),
}));

describe('useFetchLimitApi', () => {
    const navigate = vi.fn();
    const mockLimitData: GetLimitResponse = {
        minDenomination: 50,
        maxDenomination: 150,
        flexiKey: 'flexiKeyValue',
        typeKey: 1,
        accessKey: 'accessKeyValue',
        serviceProvider: 'serviceProviderValue',
        surcharge: 'surchargeValue',
    };

    beforeEach(() => {
        (useNavigate as Mock).mockReturnValue(navigate);
        (useAppSelector as Mock).mockImplementation(callback =>
            callback({
                reducer: {
                    auth: { role: 'user', id: '123' },
                },
            })
        );
    });

    it('should fetch limit data and set it correctly', async () => {
        (getLimit as Mock).mockResolvedValue(mockLimitData);

        const { result } = renderHook(() => useFetchLimitApi('some/path'));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0)); // wait for all updates
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.limitData).toEqual(mockLimitData);
        expect(navigate).not.toHaveBeenCalled(); // Ensure navigate is not called
    });

    it('should handle service not available and navigate to the correct path', async () => {
        (getLimit as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => useFetchLimitApi('some/path'));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0)); // wait for all updates
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.limitData).toBeUndefined();
        expect(navigate).toHaveBeenCalledWith(paths.dashboard.serviceNotAvailable);
    });
});
