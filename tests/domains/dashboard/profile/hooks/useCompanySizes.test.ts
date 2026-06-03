import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { DropDown } from '@customtypes/general';
import { getCompanySizes } from '@src/domains/dashboard/profile/api/general';
import useCompanySizes from '@src/domains/dashboard/profile/hooks/useCompanySizes';

vi.mock('@src/domains/dashboard/profile/api/general', () => ({
    getCompanySizes: vi.fn(),
}));

describe('useCompanySizes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch company sizes and set the companySizesList state', async () => {
        const mockCompanySizes: DropDown = [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
        ];

        (getCompanySizes as any).mockResolvedValue({ companySize: mockCompanySizes });

        const { result } = renderHook(() => useCompanySizes());

        await waitFor(() => {
            expect(getCompanySizes).toHaveBeenCalled();
            expect(result.current.companySizesList).toEqual(mockCompanySizes);
        });
    });

    it('should handle the case when getCompanySizes returns false', async () => {
        (getCompanySizes as any).mockResolvedValue(false);

        const { result } = renderHook(() => useCompanySizes());
        await waitFor(() => {
            expect(getCompanySizes).toHaveBeenCalled();
            expect(result.current.companySizesList).toEqual([]);
        });
    });
});
