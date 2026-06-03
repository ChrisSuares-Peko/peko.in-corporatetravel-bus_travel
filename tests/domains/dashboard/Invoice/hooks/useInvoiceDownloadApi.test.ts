import { renderHook, act } from '@testing-library/react';
import { saveAs } from 'file-saver';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { downloadInvoice } from '@domains/dashboard/Invoice/api';
import DownloadInvoiceData from '@domains/dashboard/Invoice/hooks/useInvoiceDownloadApi';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('file-saver', () => ({
    saveAs: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@domains/dashboard/Invoice/api', () => ({
    downloadInvoice: vi.fn(),
}));

describe('DownloadInvoiceData', () => {
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppSelector.mockReturnValue({
            id: '123',
            role: 'admin',
        });
    });

    it('should download the invoice and save it as a PDF', async () => {
        const mockPdfData = new Uint8Array([10, 20, 30]);
        const mockResponse: any = {
            pdfBuffer: {
                type: 'Buffer',
                data: Array.from(mockPdfData),
            },
        };

        (downloadInvoice as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => DownloadInvoiceData());

        await act(async () => {
            await result.current.getInvoiceDetails('invoice123');
        });

        expect(downloadInvoice).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            invoiceId: 'invoice123',
        });

        expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'Invoice.pdf');

        expect(result.current.loader).toBe(false);
    });

    it('should handle API failure gracefully', async () => {
        (downloadInvoice as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => DownloadInvoiceData());

        await act(async () => {
            await result.current.getInvoiceDetails('invoice123');
        });

        expect(downloadInvoice).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            invoiceId: 'invoice123',
        });

        expect(saveAs).not.toHaveBeenCalled();
        expect(result.current.loader).toBe(false);
    });

    it('should set loading state correctly during data fetch', async () => {
        const mockPdfData = new Uint8Array([10, 20, 30]);
        const mockResponse: any = {
            pdfBuffer: {
                type: 'Buffer',
                data: Array.from(mockPdfData),
            },
        };

        (downloadInvoice as any).mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );

        const { result } = renderHook(() => DownloadInvoiceData());

        // Initially, loader should be true
        expect(result.current.loader).toBe(false);

        // Trigger the function and expect the loader to be true while loading
        act(() => {
            result.current.getInvoiceDetails('invoice123');
        });

        expect(result.current.loader).toBe(true);

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 110));
        });

        expect(downloadInvoice).toHaveBeenCalledWith({
            userId: '123',
            userType: 'admin',
            invoiceId: 'invoice123',
        });

        expect(result.current.loader).toBe(false);
    });
});
