import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, beforeEach, it, expect } from 'vitest';

import { getActivities } from '@src/domains/dashboard/profile/api/general';
import useActivities from '@src/domains/dashboard/profile/hooks/useActivities';

vi.mock('@src/domains/dashboard/profile/api/general', () => ({
    getActivities: vi.fn(),
}));

describe('useActivities', () => {
    const mockActivities = {
        companyActivity: [
            { id: '1', name: 'Activity 1' },
            { id: '2', name: 'Activity 2' },
        ],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch activities and update state', async () => {
        (getActivities as any).mockResolvedValue(mockActivities);

        const { result } = renderHook(() => useActivities());

        await waitFor(() => {
            expect(result.current.activityList).toEqual(mockActivities.companyActivity);
        });

        expect(getActivities).toHaveBeenCalledTimes(1);
    });

    it('should handle the case when getActivities returns false', async () => {
        (getActivities as any).mockResolvedValue(false);

        const { result } = renderHook(() => useActivities());

        await waitFor(() => {
            expect(result.current.activityList).toBeUndefined();
        });

        expect(getActivities).toHaveBeenCalledTimes(1);
    });
});
