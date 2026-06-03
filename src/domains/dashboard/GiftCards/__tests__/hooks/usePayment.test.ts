import { renderHook, act } from '@testing-library/react';
import { describe, beforeEach, afterEach, it, expect, vi, Mock } from 'vitest';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { setPaymentData } from '../../../payments/slices/payment';
import usePayment from '../../hooks/usePayment';
import useSurchargeDetails from '../../hooks/useSurchargeApi';

// Initialize mock variables
const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

// Mock hooks
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: () => mockDispatch,
}));

vi.mock('../../hooks/useSurchargeApi');

describe('usePayment Hook', () => {
    beforeEach(() => {
        // Mock useSurchargeDetails
        (useSurchargeDetails as Mock).mockReturnValue({
            surchargeData: { surcharge: '10', corporateCashback: '5' },
        });

        // Mock useAppSelector to return specific values
        (useAppSelector as Mock).mockImplementation(selector => {
            const mockState = {
                reducer: {
                    giftcardCheckout: {
                        productDetails: { id: 'giftCardId', product_name: 'Test Gift Card' },
                        formDetails: { amount: '100', quantity: 2, product: '100' },
                    },
                },
            };

            return selector(mockState);
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize and return handleSubmission function', () => {
        const { result } = renderHook(() => usePayment());
        expect(result.current.handleSubmission).toBeInstanceOf(Function);
    });

    it('should calculate total amount correctly', () => {
        const { result } = renderHook(() => usePayment());

        act(() => {
            result.current.handleSubmission({
                receiverFirstName: 'John',
                receiverEmail: 'john@example.com',
                senderName: 'Alice',
                employee: 'E123',
                orderType: 'Gift',
                message: 'Happy Birthday!',
            });
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({
                    billSummary: [
                        { key: 'Service name', value: 'Gift Cards' },
                        { key: 'Gift Card Name', value: 'Test Gift Card' },
                        { key: 'Quantity', value: 2 },
                        { key: 'Amount', value: '100' },
                    ],
                    earningCashbackAmount: 5,
                    payload: {
                        accessKey: 'gift_cards_combined',
                        amount: '100',
                        currentUrl: 'http://localhost:3000/',
                        email: 'john@example.com',
                        employee: 'E123',
                        first_name: 'John',
                        giftCardId: 'giftCardId',
                        load_amount: '100',
                        message: 'Happy Birthday!',
                        number_of_items: 2,
                        orderType: 'Gift',
                        senderName: 'Alice',
                    },
                    paymentSummary: [{ key: 'Platform fee', value: '10' }],
                    title: 'Bill Summary',
                    totalAmount: 110,
                    url: 'purchase/giftcards/payment',
                }),
                type: 'payment/setPaymentData',
            })
        );
    });

    it('should dispatch setPaymentData with correct payload', () => {
        const { result } = renderHook(() => usePayment());

        act(() => {
            result.current.handleSubmission({
                receiverFirstName: 'John',
                receiverEmail: 'john@example.com',
                senderName: 'Alice',
                employee: 'E123',
                orderType: 'Gift',
                message: 'Happy Birthday!',
            });
        });

        // Check the dispatched payload
        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: [
                    { key: 'Service name', value: 'Gift Cards' },
                    { key: 'Gift Card Name', value: 'Test Gift Card' },
                    { key: 'Quantity', value: 2 },
                    { key: 'Amount', value: '100' },
                ],
                earningCashbackAmount: 5,
                payload: {
                    accessKey: 'gift_cards_combined',
                    amount: '100',
                    currentUrl: 'http://localhost:3000/',
                    email: 'john@example.com',
                    employee: 'E123',
                    first_name: 'John',
                    giftCardId: 'giftCardId',
                    load_amount: '100',
                    message: 'Happy Birthday!',
                    number_of_items: 2,
                    orderType: 'Gift',
                    senderName: 'Alice',
                },
                paymentSummary: [{ key: 'Platform fee', value: '10' }],
                title: 'Bill Summary',
                totalAmount: 110,
                url: 'purchase/giftcards/payment',
            })
        );
    });

    it('should navigate to the payments path after submission', () => {
        const { result } = renderHook(() => usePayment());

        act(() => {
            result.current.handleSubmission({
                receiverFirstName: 'John',
                receiverEmail: 'john@example.com',
                senderName: 'Alice',
                employee: 'E123',
                orderType: 'Gift',
                message: 'Happy Birthday!',
            });
        });

        expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });

    it('should handle missing data gracefully', () => {
        const { result } = renderHook(() => usePayment());

        act(() => {
            result.current.handleSubmission({});
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData(
                expect.objectContaining({
                    payload: expect.objectContaining({
                        first_name: undefined,
                        email: undefined,
                    }),
                })
            )
        );
    });
});
