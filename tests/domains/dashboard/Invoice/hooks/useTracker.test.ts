import { renderHook, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { statusUpdate } from '@domains/dashboard/Invoice/api';
import useTracker from '@domains/dashboard/Invoice/hooks/useTracker';
import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock dependencies
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    statusUpdate: vi.fn(),
}));
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useTracker', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockUseDispatch = useDispatch as any;
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
        mockUseDispatch.mockReturnValue(vi.fn());
        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    it('should update status and show success toast', async () => {
        (statusUpdate as any).mockResolvedValueOnce(true);

        const { result } = renderHook(() => useTracker());

        const response = await act(async () => result.current.updateStatus('Completed', 1));

        expect(statusUpdate).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            status: 'Completed',
            id: 1,
        });

        expect(showToast).toHaveBeenCalledWith({
            description: 'Status updated successfully',
            variant: 'success',
        });

        expect(response).toBe(true);
    });

    it('should handle status update failure', async () => {
        (statusUpdate as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useTracker());

        const response = await act(async () => result.current.updateStatus('Completed', 1));

        expect(statusUpdate).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            status: 'Completed',
            id: 1,
        });

        expect(showToast).not.toHaveBeenCalled();

        expect(response).toBe(false);
    });
});
