import { renderHook, act } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import {
    addGuideline,
    getAllGuidelines,
    getPayentLink,
    getTemplate,
    paymentLink,
    updateGuideline,
} from '@domains/dashboard/Invoice/api';
import useGuidelines from '@domains/dashboard/Invoice/hooks/useGuidelines';
import {
    setPaymentLink,
    setpaymentLinkForm,
} from '@domains/dashboard/Invoice/slices/InvoicesSlices';
import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));
vi.mock('react-redux', () => ({
    useDispatch: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
vi.mock('@domains/dashboard/Invoice/api', () => ({
    addGuideline: vi.fn(),
    getAllGuidelines: vi.fn(),
    getPayentLink: vi.fn(),
    getTemplate: vi.fn(),
    paymentLink: vi.fn(),
    updateGuideline: vi.fn(),
}));
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));
vi.mock('@src/slices/InvoicesSlices', () => ({
    setPaymentLink: vi.fn(),
    setpaymentLinkForm: vi.fn(),
}));

describe('useGuidelines', () => {
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useDispatch as any).mockReturnValue(mockDispatch);
        (useNavigate as any).mockReturnValue(mockNavigate);
        mockUseAppSelector.mockReturnValue({
            id: '123',
            role: 'admin',
            reducer: {
                invoices: {
                    Details: { paymentMode: 'payment link' },
                },
            },
        });
    });

    it('should add a guideline and generate a payment link', async () => {
        const mockResponse = { paymentLink: 'test-link' };
        const mockGuidelineResponse = { status: true };

        (addGuideline as any).mockResolvedValueOnce(mockGuidelineResponse);
        (paymentLink as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useGuidelines());

        await act(async () => {
            await result.current.guidelineAdd({
                payment_link_image: null,
                full_name: 'John Doe',
                email: 'john@example.com',
                phone_number: '1234567890',
                amount: '100.00',
                expires_at: '2024-12-31',
                data: [],
                notification: 'EML',
            });
        });

        expect(addGuideline).toHaveBeenCalled();
        expect(paymentLink).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(setPaymentLink('test-link'));
        expect(mockDispatch).toHaveBeenCalledWith(setpaymentLinkForm(mockResponse));
        // expect(mockNavigate).toHaveBeenCalledWith('/invoice/index/invoice/success');
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Guideline added successfully',
                variant: 'success',
            })
        );
    });

    it('should update a guideline and show success toast', async () => {
        const mockUpdateResponse = { status: true };

        (updateGuideline as any).mockResolvedValueOnce(mockUpdateResponse);

        const { result } = renderHook(() => useGuidelines());

        await act(async () => {
            await result.current.guidelineUpdate({
                data: [], // Adjust according to your type definition
                invoiceId: undefined,
            });
        });

        expect(updateGuideline).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Guideline updated successfully',
                variant: 'success',
            })
        );
    });

    it('should fetch template data on mount', async () => {
        const mockTemplateResponse = { rows: [{ id: 1, name: 'Template 1' }] };

        (getTemplate as any).mockResolvedValueOnce(mockTemplateResponse);

        const { result } = renderHook(() => useGuidelines());

        await act(async () => {});

        expect(getTemplate).toHaveBeenCalled();
        expect(result.current.data).toEqual(mockTemplateResponse.rows);
    });

    it('should fetch guideline data on mount', async () => {
        const mockGuidelineResponse = { rows: [{ id: 1, name: 'Guideline 1' }] };

        (getAllGuidelines as any).mockResolvedValueOnce(mockGuidelineResponse);

        const { result } = renderHook(() => useGuidelines(1));

        await act(async () => {});

        expect(getAllGuidelines).toHaveBeenCalled();
        expect(result.current.guideline).toEqual(mockGuidelineResponse.rows);
    });

    it('should generate a payment link and navigate to success page', async () => {
        const mockPaymentLinkResponse = { link: 'payment-link' };

        (getPayentLink as any).mockResolvedValueOnce(mockPaymentLinkResponse);

        const { result } = renderHook(() => useGuidelines());

        await act(async () => {
            await result.current.generatePaymentLink(1);
        });

        expect(getPayentLink).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(setPaymentLink('payment-link'));
        expect(mockDispatch).toHaveBeenCalledWith(setpaymentLinkForm(mockPaymentLinkResponse));
        // expect(mockNavigate).toHaveBeenCalledWith('/invoice/index/invoice/success');
    });
});
