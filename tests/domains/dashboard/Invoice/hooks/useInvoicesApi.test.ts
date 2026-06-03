import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { invoice } from '@domains/dashboard/Invoice/api';
import useInvoiceApi from '@domains/dashboard/Invoice/hooks/useInvoicesApi';
import { resetState, setInvoiceResponse } from '@domains/dashboard/Invoice/slices/InvoicesSlices';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

// Mock dependencies
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    invoice: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/slices/InvoicesSlices', () => ({
    setInvoiceResponse: vi.fn(),
    resetState: vi.fn(),
}));

describe('useInvoiceApi', () => {
    const mockNavigate = vi.fn();
    const mockDispatch = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
    });

    it('should handle invoice submission, navigate, and reset form on success', async () => {
        const mockResponse = { success: true };
        (invoice as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useInvoiceApi());

        const mockPayload: any = {
            invoiceId: 1,
            resetForm: vi.fn(),
            recipientDetails: {
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerAddress: '123 Test St',
                customerPhone: '1234567890',
            },
            invoiceDetails: {
                invoiceDate: '2024-01-01',
                dueDate: '2024-02-01',
                comments: 'Test comment',
                termsConditions: 'Test terms',
            },
            productDetails: [],
            paymentDetails: {
                subTotal: '100.00',
                vat: '5.00',
                discount: '0.00',
                shipping: '10.00',
                total: '115.00',
                amountDue: '115.00',
            },
            paymentMode: 'card',
        };

        await act(async () => result.current.handleInvoice(mockPayload));

        expect(invoice).toHaveBeenCalledWith({
            ...mockPayload,
            userId: '123',
            userType: 'admin',
        });

        expect(mockDispatch).toHaveBeenCalledWith(setInvoiceResponse(mockResponse));
        expect(mockNavigate).toHaveBeenCalledWith(paths.invoice.invoicedetails);
        expect(mockPayload.resetForm).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(resetState());
        expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state correctly during the API call', async () => {
        const mockResponse = { success: true };
        (invoice as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() => useInvoiceApi());

        const mockPayload: any = {
            invoiceId: 1,
            resetForm: vi.fn(),
            recipientDetails: {
                customerName: 'John Doe',
                customerEmail: 'john@example.com',
                customerAddress: '123 Test St',
                customerPhone: '1234567890',
            },
            invoiceDetails: {
                invoiceDate: '2024-01-01',
                dueDate: '2024-02-01',
                comments: 'Test comment',
                termsConditions: 'Test terms',
            },
            productDetails: [],
            paymentDetails: {
                subTotal: '100.00',
                vat: '5.00',
                discount: '0.00',
                shipping: '10.00',
                total: '115.00',
                amountDue: '115.00',
            },
            paymentMode: 'card',
        };

        act(() => {
            result.current.handleInvoice(mockPayload);
        });

        expect(result.current.isLoading).toBe(true);

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(result.current.isLoading).toBe(false);
    });
});
