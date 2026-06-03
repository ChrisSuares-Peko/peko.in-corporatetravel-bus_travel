import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import useForm from '@domains/dashboard/officeSupplies/hooks/useForm';
import useBasicInfoApi from '@domains/dashboard/officeSupplies/hooks/useGetBasicInfo';
import useSurchargeDetails from '@domains/dashboard/officeSupplies/hooks/useSurchargeApi';
import { AddressField } from '@domains/dashboard/officeSupplies/types/address';
import { setPaymentData } from '@domains/dashboard/payments/slices/payment';
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
vi.mock('@domains/dashboard/officeSupplies/hooks/useGetBasicInfo', () => ({
    default: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/hooks/useSurchargeApi', () => ({
    default: vi.fn(),
}));
vi.mock('@domains/dashboard/payments/slices/payment', () => ({
    setPaymentData: vi.fn(),
}));

describe('useForm', () => {
    const mockNavigate = vi.fn();
    const mockDispatch = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useAppDispatch as any).mockReturnValue(mockDispatch);
    });

    it('should handle form submission and navigate to payments', async () => {
        const mockBasicInfo = { name: 'Test User', email: 'testuser@example.com' };
        const mockSurchargeData = { surcharge: '10.00', corporateCashback: '5.00' };
        const mockCart = {
            totalVat: 5.0,
            grandTotal: 100.0,
            cartId: 'cart123',
            itemsTotalAmount: 95.0,
            shippingCharge: 5.0,
        };

        (useBasicInfoApi as any).mockReturnValue({ data: mockBasicInfo });
        (useSurchargeDetails as any).mockReturnValue({ surchargeData: mockSurchargeData });
        mockUseAppSelector.mockReturnValue(mockCart);

        const { result } = renderHook(() => useForm());

        const mockAddressField: AddressField = {
            address: '123 Test St',
            phoneNumber: '1234567890',
            remarks: 'Test remarks',
        };

        await act(async () => {
            result.current.handleSubmission(mockAddressField);
        });

        // Adjust the expected call arguments
        expect(setPaymentData).toHaveBeenCalledWith({
            billSummary: [
                { key: 'Service name', value: 'Office Supplies' },
                { key: 'Company Name', value: 'Test User' },
                { key: 'Amount', value: '100.00' },
            ],
            paymentSummary: [
                { key: 'Sub Total', value: 'AED 90.00' }, // itemsTotalAmount - totalVat
                { key: 'VAT', value: 'AED 5.00' },
                { key: 'Shipping Fee', value: 'AED 5.00' },
                { key: 'Platform Fee', value: 'AED 10.00' }, // surchargeData.surcharge
            ],
            totalAmount: 110.0, // grandTotal + surcharge
            title: 'Bill Summary',
            payload: {
                cartId: 'cart123',
                amount: 100.0,
                transactionId: expect.any(Number), // Adjusted to expect any number
                userEmail: 'testuser@example.com',
                address: mockAddressField,
                accessKey: expect.stringMatching(/ecommerce|OFFICE_SUPPLIES_ACCESS_KEY/), // Match either key
                currentUrl: window.location.href,
            },
            url: 'purchase/ecommerce/payment',
            earningCashbackAmount: 5.0, // corporateCashback
        });

        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });

    it('should handle submission without surcharge data', async () => {
        const mockBasicInfo = { name: 'Test User', email: 'testuser@example.com' };
        const mockCart = {
            totalVat: 5.0,
            grandTotal: 100.0,
            cartId: 'cart123',
            itemsTotalAmount: 95.0,
            shippingCharge: 5.0,
        };

        (useBasicInfoApi as any).mockReturnValue({ data: mockBasicInfo });
        (useSurchargeDetails as any).mockReturnValue({ surchargeData: undefined });
        mockUseAppSelector.mockReturnValue(mockCart);

        const { result } = renderHook(() => useForm());

        const mockAddressField: AddressField = {
            address: '123 Test St',
            phoneNumber: '1234567890',
            remarks: 'Test remarks',
        };

        await act(async () => {
            result.current.handleSubmission(mockAddressField);
        });

        expect(setPaymentData).toHaveBeenCalledWith({
            billSummary: [
                { key: 'Service name', value: 'Office Supplies' },
                { key: 'Company Name', value: 'Test User' },
                { key: 'Amount', value: '100.00' },
            ],
            paymentSummary: [
                { key: 'Sub Total', value: 'AED 90.00' },
                { key: 'VAT', value: 'AED 5.00' },
                { key: 'Shipping Fee', value: 'AED 5.00' },
                { key: 'Platform Fee', value: 'AED undefined' },
            ],
            totalAmount: 100.0, // grandTotal without surcharge
            title: 'Bill Summary',
            payload: {
                cartId: 'cart123',
                amount: 100.0,
                transactionId: expect.any(Number), // Adjusted to expect any number
                userEmail: 'testuser@example.com',
                address: mockAddressField,
                accessKey: expect.stringMatching(/ecommerce|OFFICE_SUPPLIES_ACCESS_KEY/), // Match either key
                currentUrl: window.location.href,
            },
            url: 'purchase/ecommerce/payment',
            earningCashbackAmount: 0, // no cashback since surchargeData is undefined
        });

        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });
});
