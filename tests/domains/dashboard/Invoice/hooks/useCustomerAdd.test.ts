import { renderHook, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { addCustomer, deleteCustomer, updateCustomer } from '@domains/dashboard/Invoice/api';
import { useCustomerAdd } from '@domains/dashboard/Invoice/hooks/useCustomerAdd';
import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock dependencies
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
}));
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    addCustomer: vi.fn(),
    deleteCustomer: vi.fn(),
    updateCustomer: vi.fn(),
}));

describe('useCustomerAdd', () => {
    const mockDispatch = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useDispatch as any).mockReturnValue(mockDispatch);
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should add a customer and show success toast', async () => {
        const mockResponse = { success: true };
        (addCustomer as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCustomerAdd());

        const mockPayload: any = { name: 'Test Customer', email: 'test@example.com' };

        await act(async () => {
            const success = await result.current.customerAdd(mockPayload);
            expect(success).toBe(true);
        });

        expect(addCustomer).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            ...mockPayload,
        });
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Customer added successfully',
                variant: 'success',
            })
        );
    });

    it('should handle add customer failure', async () => {
        (addCustomer as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useCustomerAdd());

        const mockPayload: any = { name: 'Test Customer', email: 'test@example.com' };

        await act(async () => {
            const success = await result.current.customerAdd(mockPayload);
            expect(success).toBe(false);
        });

        expect(addCustomer).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            ...mockPayload,
        });
        expect(mockDispatch).not.toHaveBeenCalledWith(
            showToast({
                description: 'Customer added successfully',
                variant: 'success',
            })
        );
        // expect(result.current.isLoading).toBe(false);
        // expect(result.current.setRefresh).toBeFalsy();
    });

    it('should update a customer and show success toast', async () => {
        const mockResponse = { success: true };
        (updateCustomer as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCustomerAdd());

        const mockPayload: any = {
            id: '1',
            name: 'Updated Customer',
            email: 'updated@example.com',
        };

        await act(async () => {
            const success = await result.current.customerUpdate(mockPayload);
            expect(success).toBe(true);
        });

        expect(updateCustomer).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            ...mockPayload,
        });
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Customer updated successfully',
                variant: 'success',
            })
        );
        // expect(result.current.isLoading).toBe(false);
        // expect(result.current.setRefresh).toBeTruthy();
    });

    it('should handle update customer failure', async () => {
        (updateCustomer as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useCustomerAdd());

        const mockPayload: any = {
            id: '1',
            name: 'Updated Customer',
            email: 'updated@example.com',
        };

        await act(async () => {
            const success = await result.current.customerUpdate(mockPayload);
            expect(success).toBe(false);
        });

        expect(updateCustomer).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            ...mockPayload,
        });
        expect(mockDispatch).not.toHaveBeenCalledWith(
            showToast({
                description: 'Customer updated successfully',
                variant: 'success',
            })
        );
        // expect(result.current.isLoading).toBe(false);
        // expect(result.current.setRefresh).toBeFalsy();
    });

    it('should delete a customer and show success toast', async () => {
        const mockResponse = { success: true };
        (deleteCustomer as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useCustomerAdd());

        await act(async () => {
            const success = await result.current.customerDelete(1);
            expect(success).toBe(true);
        });

        expect(deleteCustomer).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            id: 1,
        });
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Customer deleted successfully',
                variant: 'success',
            })
        );
        // expect(result.current.isLoading).toBe(false);
        // expect(result.current.setRefresh).toBeTruthy();
    });

    it('should handle delete customer failure', async () => {
        (deleteCustomer as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useCustomerAdd());

        await act(async () => {
            const success = await result.current.customerDelete(1);
            expect(success).toBe(false);
        });

        expect(deleteCustomer).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            id: 1,
        });
        expect(mockDispatch).not.toHaveBeenCalledWith(
            showToast({
                description: 'Customer deleted successfully',
                variant: 'success',
            })
        );
        // expect(result.current.isLoading).toBe(false);
        // expect(result.current.setRefresh).toBeFalsy();
    });
});
