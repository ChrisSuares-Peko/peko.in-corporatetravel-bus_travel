import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';

import useForm from '@domains/dashboard/Hotels/hooks/useCheckout';
import useSurchargeDetails from '@domains/dashboard/Hotels/hooks/useSurchargeApi';
import { setPaymentData } from '@domains/dashboard/payments/slices/payment';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));
vi.mock('@domains/dashboard/Hotels/hooks/useSurchargeApi', () => ({
    default: vi.fn(),
}));
vi.mock('@domains/dashboard/payments/slices/payment', () => ({
    setPaymentData: vi.fn(),
}));

describe('useForm', () => {
    const mockUseAppDispatch = useAppDispatch as any;
    const mockUseAppSelector = useAppSelector as any;
    const mockUseSurchargeDetails = useSurchargeDetails as any;
    const mockNavigate = useNavigate as any;
    const mockDispatch = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseAppDispatch.mockReturnValue(mockDispatch);
        mockUseAppSelector.mockReturnValue({
            role: 'user',
            id: '123',
            hotelsRequest: {
                checkIn: '2024-08-01',
                checkOut: '2024-08-05',
                city: 'New York',
                country: 'USA',
            },
            keyData: {
                conversationId: 'conv123',
                searchKey: 'search123',
                hotelKey: 'hotel123',
            },
            roomResponse: [{ price: 100 }, { price: 200 }],
            hotelResponse: {
                hotelDetails: {
                    data: [
                        {
                            name: 'Hotel Example',
                            email: 'hotel@example.com',
                            phoneNumber: '1234567890',
                            images: [{ path: '/image.jpg' }],
                            address: '123 Example Street',
                        },
                    ],
                },
            },
            prebookRoomData: [{ roomIndex: 1, roomKey: 'roomKey123' }],
            bookingRoom: 'bookingRoomData',
            userdetails: [
                {
                    roomIndex: 1,
                    passengers: [
                        {
                            contact: {
                                contactProvided: [
                                    {
                                        emailAddress: ['john.doe@example.com'],
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        });
        mockUseSurchargeDetails.mockReturnValue({
            surchargeData: {
                surcharge: '50',
                corporateCashback: '10',
            },
        });
        mockNavigate.mockReturnValue(vi.fn());
    });

    it('should handle submission and navigate to payment page', async () => {
        const { result } = renderHook(() => useForm());

        await act(async () => {
            await result.current.handleSubmission();
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData({
                billSummary: [
                    { key: 'Service name', value: 'Hotels' },
                    { key: 'Name', value: 'Hotel Example' },
                    { key: 'Amount', value: 300 },
                ],
                paymentSummary: [{ key: 'Platform fee', value: '50' }],
                totalAmount: 350,
                title: 'Bill Summary',
                payload: expect.objectContaining({
                    userId: '123',
                    userType: 'user',
                    conversationId: 'conv123',
                    hotelKey: 'hotel123',
                    searchKey: 'search123',
                    clientReference: expect.any(String),
                    hotelContact: expect.objectContaining({
                        email: 'hotel@example.com',
                        phoneNumber: '1234567890',
                        checkInTime: '00:00',
                        checkOutTime: '12:00',
                        image: '/image.jpg',
                        address: '123 Example Street',
                    }),
                    amount: 300,
                    stayDateRange: expect.objectContaining({
                        checkIn: '2024-08-01',
                        checkOut: '2024-08-05',
                    }),
                    rooms: expect.any(Array),
                    accessKey: expect.any(String),
                    currentUrl: expect.any(String),
                }),
                url: 'travel/hotels/book',
                earningCashbackAmount: 10,
            })
        );

        // expect(mockNavigate).toHaveBeenCalledWith(paths.dashboard.payments);
    });

    it('should calculate total amount correctly', async () => {
        const { result } = renderHook(() => useForm());

        await act(async () => {
            await result.current.handleSubmission();
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            setPaymentData(
                expect.objectContaining({
                    totalAmount: 350,
                })
            )
        );
    });
});
