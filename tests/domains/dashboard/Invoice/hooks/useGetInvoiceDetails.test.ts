import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getInvoice } from '@domains/dashboard/Invoice/api';
import useGetInvoiceDetails from '@domains/dashboard/Invoice/hooks/useGetInvoiceDetails';
import { InvoiceResponse } from '@domains/dashboard/Invoice/types';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    getInvoice: vi.fn(),
}));

describe('useGetInvoiceDetails', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockNavigate = useNavigate as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
    });

    it('should fetch invoice details and update state on success', async () => {
        const mockResponse: InvoiceResponse = {
            id: 1,
            recipientDetails: JSON.stringify({ name: 'John Doe', address: '123 Main St' }),
            invoiceDetails: JSON.stringify({ invoiceNumber: 'INV-001', date: '2023-01-01' }),
            productDetails: JSON.stringify([{ item: 'Product 1', quantity: 2, price: 50 }]),
            paymentDetails: JSON.stringify({ total: 100, paid: 50 }),
            paymentMode: 'Credit Card',
            comments: 'Thank you for your business',
            termsConditions: 'Payment due in 30 days',
            updatedAt: '2023-01-02',
            createdAt: '2023-01-01',
            invoiceId: 1001,
        };
        (getInvoice as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useGetInvoiceDetails('1001'));

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getInvoice).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            invoiceId: '1001',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual({
            id: mockResponse.id,
            recipientDetails: JSON.parse(mockResponse.recipientDetails),
            invoiceDetails: JSON.parse(mockResponse.invoiceDetails),
            productDetails: JSON.parse(mockResponse.productDetails),
            paymentDetails: JSON.parse(mockResponse.paymentDetails),
            paymentMode: mockResponse.paymentMode,
            comments: mockResponse.comments,
            termsConditions: mockResponse.termsConditions,
            updatedAt: mockResponse.updatedAt,
            createdAt: mockResponse.createdAt,
            invoiceId: mockResponse.invoiceId,
        });
        expect(result.current.dataSource).toEqual([
            {
                key: '0',
                name: {
                    firstRow: 'Product 1',
                    secondRow: '',
                },
                quantity: 2,
                price: 50,
                amount: 100,
            },
        ]);
    });

    it('should handle API failure gracefully', async () => {
        (getInvoice as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useGetInvoiceDetails('1001'));

        // Wait for useEffect to complete
        await act(async () => {});

        expect(getInvoice).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            invoiceId: '1001',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toBeUndefined(); // Ensure data remains undefined on failure
        expect(result.current.dataSource).toEqual([]); // Ensure dataSource remains empty on failure
    });

    it('should set loading state correctly during data fetch', async () => {
        const mockResponse: InvoiceResponse = {
            id: 1,
            recipientDetails: JSON.stringify({ name: 'John Doe', address: '123 Main St' }),
            invoiceDetails: JSON.stringify({ invoiceNumber: 'INV-001', date: '2023-01-01' }),
            productDetails: JSON.stringify([{ item: 'Product 1', quantity: 2, price: 50 }]),
            paymentDetails: JSON.stringify({ total: 100, paid: 50 }),
            paymentMode: 'Credit Card',
            comments: 'Thank you for your business',
            termsConditions: 'Payment due in 30 days',
            updatedAt: '2023-01-02',
            createdAt: '2023-01-01',
            invoiceId: 1001,
        };
        (getInvoice as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() => useGetInvoiceDetails('1001'));

        // Initially, isLoading should be true
        expect(result.current.isLoading).toBe(true);

        // Wait for useEffect to complete
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(getInvoice).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            invoiceId: '1001',
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual({
            id: mockResponse.id,
            recipientDetails: JSON.parse(mockResponse.recipientDetails),
            invoiceDetails: JSON.parse(mockResponse.invoiceDetails),
            productDetails: JSON.parse(mockResponse.productDetails),
            paymentDetails: JSON.parse(mockResponse.paymentDetails),
            paymentMode: mockResponse.paymentMode,
            comments: mockResponse.comments,
            termsConditions: mockResponse.termsConditions,
            updatedAt: mockResponse.updatedAt,
            createdAt: mockResponse.createdAt,
            invoiceId: mockResponse.invoiceId,
        });
    });
});
