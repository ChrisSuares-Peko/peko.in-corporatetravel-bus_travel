import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { serviceTypeListing } from '@src/domains/dashboard/logistics/api';
import { useLogisticsServiceLisitingApi } from '@src/domains/dashboard/logistics/hooks/useServiceTypeListingApi';
import { useAppSelector } from '@src/hooks/store';

vi.mock('@src/domains/dashboard/logistics/api', () => ({
    serviceTypeListing: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('useServiceTypeListingApi', () => {
    beforeEach(() => {
        (useAppSelector as any).mockReturnValue({ role: 'admin', id: 1 });
    });

    it('should fetch service types correctly', async () => {
        (serviceTypeListing as any).mockResolvedValueOnce({
            serviceType: [{ code: 'EXP', name: 'Express' }],
        });

        const { result } = renderHook(() => useLogisticsServiceLisitingApi('parcel', 'documents'));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual([{ value: 'EXP', label: 'Express' }]);
        });
    });

    it('should handle errors and set isLoading to false', async () => {
        (serviceTypeListing as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useLogisticsServiceLisitingApi('parcel', 'documents'));

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.data).toEqual([]);
        });
    });
});
