import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { checkBalance } from '@src/domains/dashboard/carbonFootprint/api';
import useForm from '@src/domains/dashboard/carbonFootprint/hooks/useForm';
import { setPaymentData } from '@src/domains/dashboard/payments/slices/payment';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { getSurcharge } from '@src/services/surcharge';

// Mock the dependencies
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

vi.mock('@src/domains/dashboard/carbonFootprint/api', () => ({
    checkBalance: vi.fn(),
}));

vi.mock('@src/domains/dashboard/payments/slices/payment', () => ({
    setPaymentData: vi.fn(),
}));

describe('useForm hook', () => {
    const mockNavigate = vi.fn();
    const mockDispatch = vi.fn();

    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();

        (useNavigate as unknown as any).mockReturnValue(mockNavigate);
        (useAppDispatch as unknown as any).mockReturnValue(mockDispatch);
        (useAppSelector as unknown as any).mockReturnValue({ role: 'user', id: '12345' });
    });

    it('should handle submission successfully and dispatch payment data', async () => {
        const mockPaymentData = {
            amount: '100',
            co2Offset: '5',
            selectedProject: { id: '1' },
            amountInAed: '370',
            projectName: 'Test Project',
            credits: '10',
            selectedPackage: { id: '1' },
        };

        const mockBalanceResponse = { status: 'success' };
        const mockSurchargeResponse = { surcharge: '20', corporateCashback: '5' };

        // Properly mock the resolved values
        (checkBalance as any).mockResolvedValue(mockBalanceResponse);
        (getSurcharge as any).mockResolvedValue(mockSurchargeResponse);

        const { result } = renderHook(() => useForm());

        await act(async () => {
            await result.current.handleSubmission(mockPaymentData);
        });

        expect(checkBalance).toHaveBeenCalledWith({
            userId: '12345',
            userType: 'user',
            amount: 370,
            credits: 5,
            projectId: 1,
        });

        expect(getSurcharge).toHaveBeenCalledWith({
            userId: '12345',
            userType: 'user',
            amount: 370,
            accessKey: 'carbon_footprint', // Update the expected value here
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: expect.any(Array),
                paymentSummary: expect.any(Array),
                totalAmount: 390,
                title: 'Bill Summary',
                payload: expect.objectContaining({
                    amount: '100',
                    co2Offset: '5',
                }),
                url: 'officeAndBusiness/carbonFootprint/payment',
                earningCashbackAmount: 5,
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });

    it('should handle failed balance check', async () => {
        (checkBalance as any).mockResolvedValue(false);

        const { result } = renderHook(() => useForm());

        await act(async () => {
            await result.current.handleSubmission({
                amount: '100',
                co2Offset: '5',
                selectedProject: { id: '1' },
                amountInAed: '370',
                projectName: 'Test Project',
                credits: '10',
                selectedPackage: { id: '1' },
            });
        });

        expect(mockDispatch).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should set loader state correctly', async () => {
        (checkBalance as any).mockResolvedValue(false);

        const { result } = renderHook(() => useForm());

        expect(result.current.loader).toBe(false);

        act(() => {
            result.current.handleSubmission({
                amount: '100',
                co2Offset: '5',
                selectedProject: { id: '1' },
                amountInAed: '370',
                projectName: 'Test Project',
                credits: '10',
                selectedPackage: { id: '1' },
            });
        });

        expect(result.current.loader).toBe(true);

        await act(async () => {
            await result.current.handleSubmission({
                amount: '100',
                co2Offset: '5',
                selectedProject: { id: '1' },
                amountInAed: '370',
                projectName: 'Test Project',
                credits: '10',
                selectedPackage: { id: '1' },
            });
        });

        expect(result.current.loader).toBe(false);
    });
});
