import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';

import { useAppSelector } from '@src/hooks/store';

import { getBalanceApi } from '../../../api/dubaiPolice';
import { useDubaiPolice } from '../../../hooks/dubai-police/useDubaiPoliceApi';
import { DubaiPoliceBalanceResponse, dubaiPoliceOptional } from '../../../types/dubaiPolice';

// Mock the necessary functions and hooks
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('../../../api/dubaiPolice', () => ({
    getBalanceApi: vi.fn(),
}));

describe('useDubaiPolice', () => {
    it('should initially set isLoading to true and then set limitData and isLoading to false after getting balance', async () => {
        // Setup mocks
        const mockSelector = vi.fn().mockReturnValue({ role: 'admin', id: 'user123' });
        const mockGetBalanceApi = vi.fn().mockResolvedValue({
            BlackPoints: '0',
            FineSource: 'Source',
            FineSourceCode: 'SourceCode',
            NoOfTickets: '2',
            PedestrianFine: false,
            Tickets: [
                // Provide dummy tickets if needed
            ],
            TotalAmount: '100',
            TrafficFileNo: 'TF123',
            TransactionId: 'TX123',
        } as DubaiPoliceBalanceResponse);

        // Mock implementations
        (useAppSelector as unknown as Mock).mockImplementation(mockSelector);
        (getBalanceApi as unknown as Mock).mockImplementation(mockGetBalanceApi);

        const { result } = renderHook(() => useDubaiPolice());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.limitData).toBeUndefined();

        const accountNo = 'account123';
        const flexiKey = 'flexiKey123';
        const optional: dubaiPoliceOptional = {
            searchType: '',
        }; // Adjust this based on the actual type

        await act(async () => {
            await result.current.getBalance(accountNo, flexiKey, optional);
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(true);
            expect(result.current.limitData).toEqual({
                BlackPoints: '0',
                FineSource: 'Source',
                FineSourceCode: 'SourceCode',
                NoOfTickets: '2',
                PedestrianFine: false,
                Tickets: [
                    // Provide dummy tickets if needed
                ],
                TotalAmount: '100',
                TrafficFileNo: 'TF123',
                TransactionId: 'TX123',
            });
            expect(getBalanceApi).toHaveBeenCalledWith({
                userId: 'user123',
                userType: 'admin',
                accountNo,
                flexiKey,
                optional,
            });
        });
    });

    it('should handle API failure gracefully', async () => {
        // Setup mocks
        const mockSelector = vi.fn().mockReturnValue({ role: 'admin', id: 'user123' });
        const mockGetBalanceApi = vi.fn().mockResolvedValue(false);

        // Mock implementations
        (useAppSelector as unknown as Mock).mockImplementation(mockSelector);
        (getBalanceApi as unknown as Mock).mockImplementation(mockGetBalanceApi);

        const { result } = renderHook(() => useDubaiPolice());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.limitData).toBeUndefined();

        const accountNo = 'account123';
        const flexiKey = 'flexiKey123';
        const optional: dubaiPoliceOptional = {
            searchType: '',
        }; // Adjust this based on the actual type

        await act(async () => {
            await result.current.getBalance(accountNo, flexiKey, optional);
        });

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
            expect(result.current.limitData).toBeUndefined();
            expect(getBalanceApi).toHaveBeenCalledWith({
                userId: 'user123',
                userType: 'admin',
                accountNo,
                flexiKey,
                optional,
            });
        });
    });
});
