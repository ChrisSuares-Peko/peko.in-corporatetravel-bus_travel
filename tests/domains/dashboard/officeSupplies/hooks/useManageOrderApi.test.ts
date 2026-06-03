import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import {
    cancelOrderApi,
    downloadInvoiceApi,
    productReturnApi,
} from '@domains/dashboard/officeSupplies/api/orderHistory';
import { useManageOrderApi } from '@domains/dashboard/officeSupplies/hooks/useManageOrderApi';
import { setOrderDetails } from '@domains/dashboard/officeSupplies/slices/orderDetailsSlice';
import {
    DownloadInvoiceRequestResponse,
    ProductReturnRequestResponse,
} from '@domains/dashboard/officeSupplies/types/orderHistory';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { store } from '@store/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));
vi.mock('@store/store', () => ({
    store: {
        dispatch: vi.fn(),
    },
}));
vi.mock('@domains/dashboard/officeSupplies/api/orderHistory', () => ({
    cancelOrderApi: vi.fn(),
    downloadInvoiceApi: vi.fn(),
    productReturnApi: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/slices/orderDetailsSlice', () => ({
    setOrderDetails: vi.fn(),
}));
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('useManageOrderApi', () => {
    const mockDispatch = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123', refresh: false });
    });

    it('should handle order cancellation successfully', async () => {
        const mockResponse: any = { status: true, data: [1] };
        (cancelOrderApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useManageOrderApi());

        await act(async () => {
            const success = await result.current.cancelOrder(
                1,
                'Description',
                'Reason',
                'otp',
                'scope'
            );
            expect(success).toBe(true);
        });

        expect(cancelOrderApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            description: 'Description',
            reason: 'Reason',
            orderId: 1,
            otp: 'otp',
            scope: 'scope',
        });
        expect(mockDispatch).toHaveBeenCalledWith(setOrderDetails({ refresh: true }));
        expect(store.dispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Order cancellation request raised successfully',
                variant: 'success',
            })
        );
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle product return successfully', async () => {
        const mockResponse: ProductReturnRequestResponse = { data: [1] };
        (productReturnApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useManageOrderApi());

        await act(async () => {
            await result.current.productReturn(1, 'Description', 'Reason', 2);
        });

        expect(productReturnApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            description: 'Description',
            reason: 'Reason',
            orderId: 1,
            productId: 2,
        });
        expect(mockDispatch).toHaveBeenCalledWith(setOrderDetails({ refresh: true }));
        expect(store.dispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Product return requested successfully',
                variant: 'success',
            })
        );
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle invoice download successfully', async () => {
        const mockResponse: DownloadInvoiceRequestResponse = {
            data: {
                invoiceUrl: 'http://example.com/invoice.pdf',
            },
        };
        (downloadInvoiceApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useManageOrderApi());

        await act(async () => {
            const data = await result.current.downloadInvoice(1);
            expect(data).toEqual(mockResponse);
        });

        expect(downloadInvoiceApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            orderId: 1,
        });
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API failures gracefully', async () => {
        (cancelOrderApi as any).mockResolvedValueOnce(false);
        (productReturnApi as any).mockResolvedValueOnce(false);
        (downloadInvoiceApi as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useManageOrderApi());

        await act(async () => {
            const cancelSuccess = await result.current.cancelOrder(
                1,
                'Description',
                'Reason',
                'otp',
                'scope'
            );
            expect(cancelSuccess).toBe(false);

            await result.current.productReturn(1, 'Description', 'Reason', 2);
            expect(result.current.isLoading).toBe(false);

            const invoiceData = await result.current.downloadInvoice(1);
            expect(invoiceData).toBe(false);
        });

        expect(result.current.isLoading).toBe(false);
    });
});
