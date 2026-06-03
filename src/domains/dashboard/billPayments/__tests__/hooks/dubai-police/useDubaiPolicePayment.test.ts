import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, vi, Mock } from 'vitest';

import { useAppDispatch } from '@src/hooks/store';

import { setPaymentData } from '../../../../payments/slices/payment';
import useDubaiPolicePayment from '../../../hooks/dubai-police/useDubaiPolicePayment';
import GetSurcharge from '../../../hooks/useSurcharge';

// Mock the necessary modules and hooks
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
}));

vi.mock('../../../hooks/useSurcharge', () => ({
    __esModule: true,
    default: vi.fn(() => ({
        getSurchargeData: vi.fn(),
    })),
}));

vi.mock('../../../../payments/slices/payment', () => ({
    setPaymentData: vi.fn(),
}));

describe('useDubaiPolicePayment', () => {
    it('should handle submission and dispatch payment data correctly', async () => {
        // Setup mocks
        const mockNavigate = vi.fn();
        const mockDispatch = vi.fn();
        const mockGetSurchargeData = vi.fn().mockResolvedValue({ surcharge: '50' });

        // Mock implementations
        (useNavigate as unknown as Mock).mockImplementation(() => mockNavigate);
        (useAppDispatch as unknown as Mock).mockImplementation(() => mockDispatch);
        (GetSurcharge as unknown as Mock).mockImplementation(() => ({
            getSurchargeData: mockGetSurchargeData,
        }));

        const { result } = renderHook(() => useDubaiPolicePayment());

        const mockValues = {
            account: '12345',
            amount: 100,
            flexiKey: 'flexiKey123',
            typeKey: 1234,
            optionals: {
                searchType: '',
                FineSource: 'Traffic Department',
                FineSourceCode: 'TRF123',
                TicketNo: 'ABC12345',
                TicketId: 'TICKET12345',
                ticketDateField: '2023-08-28',
                TicketFine: '150',
                ticketTimeField: '10:30',
                TrafficFileNo: 67890,
                amount: 150,
                isPedestrianFine: false,
                ticketDatats: 2345,

                ticketData: [
                    {
                        FineSource: 'Traffic Department',
                        FineSourceCode: 'TRF123',
                        CalculatedFineAmount: 150,
                        TicketNo: 'ABC12345',
                        TicketId: 'TICKET12345',
                        TicketFine: '150',
                        ticketTimeField: '10:30',
                    },
                ],
            },
            transactionId: 'transactionId',
        };

        await act(async () => {
            await result.current.handleSubmission(mockValues);
        });

        expect(mockGetSurchargeData).toHaveBeenCalledWith(100, 'dubaipolice');
        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: [
                    { key: 'Service name', value: 'Bill Payments' },
                    { key: 'Name', value: 'Dubai Police' },
                    { key: 'Amount', value: 100, isInput: false },
                ],
                paymentSummary: [
                    {
                        key: 'Platform fee',
                        value: '50',
                    },
                ],
                totalAmount: 150,
                title: 'Bill Summary',
                payload: {
                    account: '12345',
                    amount: 150,
                    transactionId: expect.any(String),
                    payCashback: false,
                    flexiKey: 'flexiKey123',
                    typeKey: 'typeKey123',
                    optionals: {
                        searchType: '',
                    },
                    accessKey: 'dubaiPolice',
                    currentUrl: window.location.href,
                },
                url: `payment/dubaiPolice/payment`,
            })
        );

        expect(mockNavigate).toHaveBeenCalledWith('/payments');
    });
});
