import { renderHook, act } from '@testing-library/react';
import { Dayjs } from 'dayjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import useFilter from '@src/domains/dashboard/carbonFootprint/hooks/useFilter'; // Update the import path as needed
import {
    InitialValues,
    filtersState,
} from '@src/domains/dashboard/carbonFootprint/types/dashboard';

describe('useFilter', () => {
    const setFilters = vi.fn();
    const initialValues: InitialValues = {
        searchQuery: '',
        category: '',
        filter: '',
        itemsPerPage: 10,
        page: 1,
        sort: 'DESC',
        from: '2023-01-01',
        to: '2023-12-31',
    };

    beforeEach(() => {
        setFilters.mockClear();
    });

    it('should handle search input correctly', () => {
        const { result } = renderHook(() =>
            useFilter({ setFilters, initaialValues: initialValues })
        );

        const mockEvent = { target: { value: 'test query' } };

        act(() => {
            result.current.handleSearch(mockEvent);
        });

        expect(setFilters).toHaveBeenCalledWith(expect.any(Function));

        act(() => {
            setFilters.mock.calls[0][0]((prevState: filtersState) => {
                expect(prevState.searchQuery).toBe('test query');
                expect(prevState.page).toBe(1);
            });
        });
    });

    it('should handle page change correctly', () => {
        const { result } = renderHook(() =>
            useFilter({ setFilters, initaialValues: initialValues })
        );

        act(() => {
            result.current.handlePageChange(2, 0);
        });

        expect(setFilters).toHaveBeenCalledWith(expect.any(Function));

        act(() => {
            setFilters.mock.calls[0][0]((prevState: filtersState) => {
                expect(prevState.page).toBe(2);
            });
        });
    });

    it('should handle filter correctly', () => {
        const { result } = renderHook(() =>
            useFilter({ setFilters, initaialValues: initialValues })
        );

        act(() => {
            result.current.handleFilter(['someFilter']);
        });

        expect(setFilters).toHaveBeenCalledWith(expect.any(Function));

        act(() => {
            setFilters.mock.calls[0][0]((prevState: filtersState) => {
                expect(prevState.filter).toBe('someFilter');
                expect(prevState.page).toBe(1);
            });
        });
    });

    it('should handle sort correctly', () => {
        const { result } = renderHook(() =>
            useFilter({ setFilters, initaialValues: initialValues })
        );

        act(() => {
            result.current.handleSort('asc');
        });

        expect(setFilters).toHaveBeenCalledWith(expect.any(Function));

        act(() => {
            setFilters.mock.calls[0][0]((prevState: filtersState) => {
                expect(prevState.sort).toBe('asc');
            });
        });
    });

    it('should handle date change correctly', () => {
        const { result } = renderHook(() =>
            useFilter({ setFilters, initaialValues: initialValues })
        );

        const mockDates: [Dayjs, Dayjs] = [
            { format: () => '2023-01-01' } as Dayjs,
            { format: () => '2023-12-31' } as Dayjs,
        ];

        const mockDateStrings: [string, string] = ['2023-01-01', '2023-12-31'];

        act(() => {
            result.current.handleDateChange(mockDates, mockDateStrings);
        });

        expect(setFilters).toHaveBeenCalledWith(expect.any(Function));

        act(() => {
            setFilters.mock.calls[0][0]((prevState: filtersState) => {
                expect(prevState.from).toBe('2023-01-01');
                expect(prevState.to).toBe('2023-12-31');
                expect(prevState.page).toBe(1);
            });
        });
    });

    it('should handle date change reset correctly when dates are null', () => {
        const { result } = renderHook(() =>
            useFilter({ setFilters, initaialValues: initialValues })
        );

        // Using type assertion to avoid TypeScript error
        const nullDates = null as unknown as [Dayjs, Dayjs];

        act(() => {
            result.current.handleDateChange(nullDates, ['', '']);
        });

        expect(setFilters).toHaveBeenCalledWith(expect.any(Function));

        act(() => {
            setFilters.mock.calls[0][0]((prevState: filtersState) => {
                expect(prevState.from).toBe(initialValues.from);
                expect(prevState.to).toBe(initialValues.to);
                expect(prevState.page).toBe(1);
            });
        });
    });
});
