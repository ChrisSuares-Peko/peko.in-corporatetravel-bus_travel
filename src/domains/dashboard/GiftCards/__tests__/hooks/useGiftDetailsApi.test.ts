import { renderHook, act, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, Mock, test, vi } from 'vitest';

import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { getGiftDetails } from '../../api/index';
import GetGiftDetails from '../../hooks/useGiftDetailsApi';
import { GiftCardDetailResponse } from '../../types/types';

// Mock modules
const mockNavigate = vi.fn();
const mockDispatch = vi.fn();

vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: () => mockDispatch,
    useAppSelector: vi.fn(),
}));

vi.mock('../../api/index', () => ({
    getGiftDetails: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

describe('GetSingleSubscriptionDetails', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock implementation for useAppSelector
        (useAppSelector as Mock).mockImplementation(callback =>
            callback({
                reducer: {
                    auth: { role: 'user', id: '123' },
                },
            })
        );
    });
    afterEach(() => {
        cleanup();
    });
    test('should fetch and set subscription details correctly', async () => {
        const mockResponse: GiftCardDetailResponse = {
            mainGiftCard: {
                id: 1,
                name: 'Test Subscription',
                description: 'A test subscription',
                image: '',
                product_id: '',
                brand_code: '',
                minDenomination: '',
                maxDenomination: '',
                priceType: '',
                denominations: [],
                activation_fee: null,
                currency: '',
                redemption_instructions: '',
                status: 0,
                createdAt: '',
                updatedAt: '',
                serviceOperatorId: 0,
                serviceOperator: { accessKey: '' },
            },
            relatedGiftCards: [],
        };
        (getGiftDetails as Mock).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => GetGiftDetails('sub1'));

        // Wait for hook to finish loading
        await act(async () => {
            await result.current.isLoading;
        });

        expect(result.current.data).toEqual(mockResponse);
        expect(result.current.isLoading).toBe(false);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalled();
    });

    test('should navigate and show toast on failure', async () => {
        (getGiftDetails as Mock).mockResolvedValue(false);

        const { result } = renderHook(() => GetGiftDetails('sub1'));

        // Wait for hook to finish loading
        await act(async () => {
            await result.current.isLoading;
        });

        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(false);
        expect(mockNavigate).toHaveBeenCalledWith('/gift-cards');
        expect(mockDispatch).toHaveBeenCalledWith(
            showToast({
                description: 'Product not found',
                variant: 'error',
            })
        );
    });

    test('should initialize with loading state', () => {
        const { result } = renderHook(() => GetGiftDetails('sub1'));

        expect(result.current.data).toBeUndefined();
        expect(result.current.isLoading).toBe(true);
    });
});
