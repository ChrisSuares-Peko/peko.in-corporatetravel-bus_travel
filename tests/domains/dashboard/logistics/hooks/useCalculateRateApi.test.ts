import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { calculateRate } from '@src/domains/dashboard/logistics/api';
import { useCalculateRateApi } from '@src/domains/dashboard/logistics/hooks/useCalculateRateApi';
import { useAppSelector } from '@src/hooks/store';

// Mock dependencies
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/logistics/api', () => ({
    calculateRate: vi.fn(),
}));

describe('useCalculateRateApi', () => {
    const mockUseAppSelector = useAppSelector as any;
    const mockCalculateRate = calculateRate as any;

    beforeEach(() => {
        mockUseAppSelector.mockImplementation((callback: any) =>
            callback({
                reducer: {
                    auth: {
                        role: 'user',
                        id: 1,
                    },
                    logistics: {
                        originAddress: {},
                        destinationAddress: {},
                    },
                },
            })
        );
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should set loading to true and fetch rate', async () => {
        // Arrange
        const { result } = renderHook(() => useCalculateRateApi());
        const mockResponse = {
            TotalAmountBeforeTax: '100',
            TaxAmount: 10,
            TotalAmount: 110,
            serviceType: 'Express',
        };
        mockCalculateRate.mockResolvedValue(mockResponse);

        // Act
        await act(async () => {
            await result.current.handleCalculateRate({
                actualWeight: '10',
                numberOfPieces: 2,
                productGroup: 'Group1',
                productType: 'Type1',
                customsValueAmount: 200,
                quantity: 5,
            });
        });

        // Assert
        expect(mockCalculateRate).toHaveBeenCalledWith({
            userId: 1,
            userType: 'user',
            originAddress: {},
            destinationAddress: {},
            actualWeight: '10',
            numberOfPieces: 2,
            productGroup: 'Group1',
            productType: 'Type1',
            customsValueAmount: 200,
            quantity: 5,
        });
        expect(result.current.data).toEqual({
            TaxAmount: 10,
            TotalAmount: 110,
            TotalAmountBeforeTax: '100',
            type: 'Express',
        });
        expect(result.current.isLoading).toBe(false);
    });

    it('should set loading to false and return false if API call fails', async () => {
        // Arrange
        const { result } = renderHook(() => useCalculateRateApi());
        mockCalculateRate.mockResolvedValue(false);

        // Act
        const response = await act(async () =>
            result.current.handleCalculateRate({
                actualWeight: '10',
                numberOfPieces: 2,
                productGroup: 'Group1',
                productType: 'Type1',
                customsValueAmount: 200,
                quantity: 5,
            })
        );

        // Assert
        expect(mockCalculateRate).toHaveBeenCalled();
        expect(result.current.data).toEqual({});
        expect(response).toBe(false);
        expect(result.current.isLoading).toBe(false);
    });

    it('should set loading to false and handle empty response gracefully', async () => {
        // Arrange
        const { result } = renderHook(() => useCalculateRateApi());
        mockCalculateRate.mockResolvedValue(null);

        // Act
        const response = await act(async () =>
            result.current.handleCalculateRate({
                actualWeight: '10',
                numberOfPieces: 2,
                productGroup: 'Group1',
                productType: 'Type1',
                customsValueAmount: 200,
                quantity: 5,
            })
        );

        // Assert
        expect(mockCalculateRate).toHaveBeenCalled();
        expect(result.current.data).toEqual({});
        expect(response).toBe(false);
        expect(result.current.isLoading).toBe(false);
    });
});
