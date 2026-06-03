import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { getInvoice } from '@domains/dashboard/Invoice/api';
import useTrackDetails from '@domains/dashboard/Invoice/hooks/useTrackDetails';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    getInvoice: vi.fn(),
}));

describe('useTrackDetails', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({ id: '123', role: 'admin' });
        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    it('should fetch and parse invoice details successfully', async () => {
        const mockInvoiceResponse = {
            id: 1,
            recipientDetails: JSON.stringify({ customerName: 'John Doe' }),
            invoiceDetails: JSON.stringify({ invoiceNo: 'INV12345' }),
            productDetails: JSON.stringify([
                { item: 'Product 1', quantity: 2, price: 100 },
                { item: 'Product 2', quantity: 1, price: 50 },
            ]),
            paymentDetails: JSON.stringify({ subTotal: '200', total: '250' }),
            comments: 'Thank you for your business',
            termsConditions: 'Payment due in 30 days',
            updatedAt: '2024-01-01',
            createdAt: '2024-01-01',
            invoiceId: 'INV12345',
            paymentMode: 'Credit Card',
            status: 'Paid',
            dueDate: '2024-01-31',
            amount: '250',
            paymentLink: 'https://payment.link',
        };

        (getInvoice as any).mockResolvedValueOnce(mockInvoiceResponse);

        const { result } = renderHook(() => useTrackDetails(1));

        await act(async () => {});

        expect(getInvoice).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            invoiceId: 1,
        });

        expect(result.current.trackerData).toEqual({
            id: 1,
            recipientDetails: { customerName: 'John Doe' },
            invoiceDetails: { invoiceNo: 'INV12345' },
            productDetails: [
                { item: 'Product 1', quantity: 2, price: 100 },
                { item: 'Product 2', quantity: 1, price: 50 },
            ],
            paymentDetails: { subTotal: '200', total: '250' },
            comments: 'Thank you for your business',
            termsConditions: 'Payment due in 30 days',
            updatedAt: '2024-01-01',
            createdAt: '2024-01-01',
            invoiceId: 'INV12345',
            paymentMode: 'Credit Card',
            status: 'Paid',
            dueDate: '2024-01-31',
            amount: '250',
            paymentLink: 'https://payment.link',
        });

        expect(result.current.dataSource).toEqual([
            {
                key: '0',
                name: { firstRow: 'Product 1', secondRow: '' },
                quantity: 2,
                price: 100,
                amount: 200,
            },
            {
                key: '1',
                name: { firstRow: 'Product 2', secondRow: '' },
                quantity: 1,
                price: 50,
                amount: 50,
            },
        ]);

        expect(result.current.Loading).toBe(false);
    });

    it('should handle API failure gracefully', async () => {
        (getInvoice as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useTrackDetails(1));

        await act(async () => {});

        expect(getInvoice).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            invoiceId: 1,
        });

        expect(result.current.trackerData).toBeUndefined();
        expect(result.current.dataSource).toEqual([]);
        expect(result.current.Loading).toBe(false);
    });
});
