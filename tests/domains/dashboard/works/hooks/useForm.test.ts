import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { setPaymentData } from '@src/domains/dashboard/payments/slices/payment';
import useForm from '@src/domains/dashboard/works/hooks/useForm';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { getSurcharge } from '@src/services/surcharge';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/services/surcharge', () => ({
    getSurcharge: vi.fn(),
}));

vi.mock('@src/domains/dashboard/payments/slices/payment', () => ({
    setPaymentData: vi.fn(),
}));

describe('useForm Hook', () => {
    const mockNavigate = vi.fn();
    const mockDispatch = vi.fn();
    const mockGetSurcharge = getSurcharge as any;

    beforeEach(() => {
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockReturnValue({ role: 'user', id: '123' });
        mockNavigate.mockClear();
        mockDispatch.mockClear();
        mockGetSurcharge.mockClear();
    });

    it('should handle successful form submission', async () => {
        const mockSurchargeResponse = {
            surcharge: '50',
            corporateCashback: '10',
        };

        mockGetSurcharge.mockResolvedValue(mockSurchargeResponse);

        const { result } = renderHook(() => useForm());

        const mockFormData = {
            pocName: 'John Doe',
            email: 'john@example.com',
            requirement: 'Sample requirement',
            planId: 'plan-123',
            workId: 1,
            planName: 'Basic Plan',
            price: '100',
        };

        await act(async () => {
            await result.current.handleSubmission(mockFormData);
        });

        expect(mockGetSurcharge).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            amount: 100,
            accessKey: 'peko_works', // Make sure this matches the correct value from your environment or context
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: [
                    { key: 'Service name', value: 'Peko Works' },
                    { key: 'Plan Name', value: 'Basic Plan' },
                    { key: 'Amount', value: '100' },
                ],
                paymentSummary: [{ key: 'Platform fee', value: '50' }],
                totalAmount: 150, // 100 amount + 50 surcharge
                title: 'Bill Summary',
                payload: {
                    planId: 'plan-123',
                    amount: '100',
                    pocName: 'John Doe',
                    email: 'john@example.com',
                    requirement: 'Sample requirement',
                    workId: 1,
                    accessKey: 'pekoWorks',
                    currentUrl: window.location.href,
                },
                url: 'officeAndBusiness/works/payment',
                earningCashbackAmount: 10, // from mockSurchargeResponse
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });

    it('should not navigate or dispatch if API call fails', async () => {
        mockGetSurcharge.mockResolvedValue(false);

        const { result } = renderHook(() => useForm());

        const mockFormData = {
            pocName: 'John Doe',
            email: 'john@example.com',
            requirement: 'Sample requirement',
            planId: 'plan-123',
            workId: 1,
            planName: 'Basic Plan',
            price: '100',
        };

        await act(async () => {
            await result.current.handleSubmission(mockFormData);
        });

        expect(mockGetSurcharge).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            amount: 100,
            accessKey: 'peko_works',
        });

        expect(mockDispatch).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
