import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import { getTransactionDetailsApi } from '@domains/dashboard/officeSupplies/api/orderHistory';
import { useOrderDetailsApi } from '@domains/dashboard/officeSupplies/hooks/useOrderDetailsApi';
import { setOrderDetails } from '@domains/dashboard/officeSupplies/slices/orderDetailsSlice';
import { TransactionDetailsResponse } from '@domains/dashboard/officeSupplies/types/orderHistory';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/api/orderHistory', () => ({
    getTransactionDetailsApi: vi.fn(),
}));
vi.mock('@domains/dashboard/officeSupplies/slices/orderDetailsSlice', () => ({
    setOrderDetails: vi.fn(),
}));

describe('useOrderDetailsApi', () => {
    const mockDispatch = vi.fn();
    const mockNavigate = vi.fn();
    const mockUseAppSelector = useAppSelector as any;

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useNavigate as any).mockReturnValue(mockNavigate);
        mockUseAppSelector.mockReturnValue({ role: 'user', id: '123' });
    });

    it('should fetch order details and update state on success', async () => {
        const mockResponse: TransactionDetailsResponse = {
            id: 1,
            corporateTxnId: 'TXN123',
            operatorId: 'OP123',
            providerId: null,
            transactionDate: '2024-08-29T12:00:00Z',
            accountNo: '1234567890',
            amountInAed: '100.00',
            baseAmount: '90.00',
            paymentMode: 'Credit Card',
            orderResponse: {
                products: [
                    {
                        productName: 'Product 1',
                        productId: 1,
                        productQuantity: 1,
                        totalPrice: 100,
                        totalVat: 5,
                        image: '',
                    },
                ],
                trackingDetails: {
                    trackingWebsite: 'http://tracking.com',
                    trackingNumber: 'TRACK123',
                    deliveryPartner: 'DHL',
                },
            },
            paymentModeResponse: {},
            surcharge: '10.00',
            baseCurrency: 'AED',
            exchangeRate: '1.00',
            status: 'Completed',
            message: 'Success',
            ecomOrderStatus: 'Delivered',
            workspaceOrderStatus: 'Completed',
            shipmentStatus: null,
            createdAt: '2024-08-29T12:00:00Z',
            updatedAt: '2024-08-29T12:00:00Z',
            serviceOperatorId: 1,
            credentialId: 1,
        };
        (getTransactionDetailsApi as any).mockResolvedValueOnce(mockResponse);

        const { result } = renderHook(() => useOrderDetailsApi('12345'));

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(getTransactionDetailsApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            orderId: '12345',
        });
        expect(mockDispatch).toHaveBeenCalledWith(
            setOrderDetails({
                orderDetails: mockResponse,
                orderedProducts: mockResponse.orderResponse.products,
                trackingDetails: mockResponse.orderResponse.trackingDetails,
            })
        );
        expect(result.current.isLoading).toBe(false);
    });

    it('should navigate to the office supplies index on failure', async () => {
        (getTransactionDetailsApi as any).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useOrderDetailsApi('12345'));

        await act(async () => {
            // Wait for the useEffect to execute
        });

        expect(getTransactionDetailsApi).toHaveBeenCalledWith({
            userId: '123',
            userType: 'user',
            orderId: '12345',
        });
        expect(mockNavigate).toHaveBeenCalledWith(`/${paths.officeSupplies.index}`);
        expect(result.current.isLoading).toBe(false);
    });
});
