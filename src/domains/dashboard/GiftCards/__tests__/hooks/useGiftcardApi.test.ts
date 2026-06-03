import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi, Mock, afterEach } from 'vitest';

import { useAppSelector } from '@src/hooks/store';

import { getAllGiftcards } from '../../api/index';
import useGiftcardApi from '../../hooks/useGiftcardApi';

// Mock the API and selector hooks
vi.mock('../../api/index', () => ({
    getAllGiftcards: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('useGiftcardApi Hook', () => {
    const mockAuthState = { role: 'admin', id: '123' };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppSelector as Mock).mockReturnValue(mockAuthState); // Mock store selector
    });
    afterEach(() => {
        cleanup();
    });

    it('should initialize with default state values', () => {
        const { result } = renderHook(() => useGiftcardApi('', 1, 10, '', 0));

        expect(result.current.data).toEqual([]);
        expect(result.current.isLoading).toBe(true);
        expect(result.current.count).toBeUndefined();
        expect(result.current.rowCount).toBeUndefined();
    });

    it('should call getAllGiftcards API with correct parameters', async () => {
        (getAllGiftcards as Mock).mockResolvedValueOnce({
            rows: [],
            count: 0,
        });

        const { result } = renderHook(() => useGiftcardApi('search text', 2, 5, 'category', 10));

        await waitFor(() => {
            expect(getAllGiftcards).toHaveBeenCalledWith({
                userId: '123',
                userType: 'admin',
                accessKeys: ['quickcilver', 'youGotAGift'],
                searchText: 'search text',
                limit: 5,
                page: 2,
                category: 'category',
                offset: 10,
            });
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('should handle successful data fetching and set state correctly', async () => {
        (getAllGiftcards as Mock).mockResolvedValueOnce({
            rows: [
                {
                    name: 'Gift Card 1',
                    description: 'Description 1',
                    image: 'image1.png',
                    id: '1',
                },
                {
                    name: 'Gift Card 2',
                    description: 'Description 2',
                    image: 'image2.png',
                    id: '2',
                },
            ],
            count: 2,
        });

        const { result } = renderHook(() => useGiftcardApi('', 1, 10, '', 0));

        await waitFor(() => {
            expect(result.current.data).toEqual([
                {
                    name: 'Gift Card 1',
                    description: 'Description 1',
                    image: 'image1.png',
                    id: '1',
                },
                {
                    name: 'Gift Card 2',
                    description: 'Description 2',
                    image: 'image2.png',
                    id: '2',
                },
            ]);
        });

        expect(result.current.count).toBe(2);
        expect(result.current.rowCount).toBe(2);
        expect(result.current.isLoading).toBe(false);
    });

    it('should handle API call failure and set loading to false', async () => {
        (getAllGiftcards as Mock).mockResolvedValueOnce(false);

        const { result } = renderHook(() => useGiftcardApi('', 1, 10, '', 0));

        await waitFor(() => {
            expect(result.current.data).toEqual([]);
            expect(result.current.count).toBeUndefined();
            expect(result.current.rowCount).toBeUndefined();
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('should refetch data when dependencies change', async () => {
        (getAllGiftcards as Mock).mockResolvedValueOnce({
            rows: [],
            count: 0,
        });

        const { rerender } = renderHook(
            ({ searchText }) => useGiftcardApi(searchText, 1, 10, '', 0),
            {
                initialProps: { searchText: '' },
            }
        );

        expect(getAllGiftcards).toHaveBeenCalledTimes(1);

        rerender({ searchText: 'new search' });

        expect(getAllGiftcards).toHaveBeenCalledTimes(2);
        expect(getAllGiftcards).toHaveBeenLastCalledWith({
            userId: '123',
            userType: 'admin',
            accessKeys: ['quickcilver', 'youGotAGift'],
            searchText: 'new search',
            limit: 10,
            page: 1,
            category: '',
            offset: 0,
        });
    });
});
