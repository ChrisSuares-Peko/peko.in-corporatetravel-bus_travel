import { renderHook, act } from '@testing-library/react';
import dayjs, { Dayjs } from 'dayjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import useTransactionFilter from '@src/domains/dashboard/carbonFootprint/hooks/useTransactionFilter';
import {
    filtersState,
    InitialValues,
} from '@src/domains/dashboard/carbonFootprint/types/dashboard';

describe('useTransactionFilter', () => {
    const initialFilters: filtersState = {
        searchQuery: '',
        sort: 'ASC',
        page: 1,
        itemsPerPage: 10,
        filter: '',
        from: '2024-01-01',
        to: '2024-12-31',
    };

    const initaialValues: InitialValues = {
        searchQuery: '',
        category: '',
        sort: 'ASC',
        page: 1,
        itemsPerPage: 10,
        filter: '',
        from: '2024-01-01',
        to: '2024-12-31',
    };

    const setFilters = vi.fn();

    const { result } = renderHook(() => useTransactionFilter({ setFilters, initaialValues }));

    beforeEach(() => {
        vi.clearAllMocks();
    });

    function runSetFiltersWithMockState(mockState: filtersState) {
        // Check if setFilters was called with a function
        expect(setFilters).toHaveBeenCalledWith(expect.any(Function));

        // Extract the first function passed to setFilters
        const updateFunction = setFilters.mock.calls[0][0];

        // Run the function with the mock state
        return updateFunction(mockState);
    }

    it('should update filters on handleSearch', () => {
        const event = { target: { value: 'test search' } };

        act(() => {
            result.current.handleSearch(event);
        });

        const newState = runSetFiltersWithMockState(initialFilters);

        expect(newState).toEqual({
            ...initialFilters,
            searchQuery: 'test search',
            page: 1,
        });
    });

    it('should update page on handlePageChange', () => {
        act(() => {
            result.current.handlePageChange(2, 0);
        });

        const newState = runSetFiltersWithMockState(initialFilters);

        expect(newState).toEqual({
            ...initialFilters,
            page: 2,
        });
    });

    it('should update filter on handleFilter', () => {
        act(() => {
            result.current.handleFilter(['new filter']);
        });

        const newState = runSetFiltersWithMockState(initialFilters);

        expect(newState).toEqual({
            ...initialFilters,
            filter: 'new filter',
            page: 1,
        });
    });

    it('should update sort on handleSort', () => {
        act(() => {
            result.current.handleSort('DESC');
        });

        const newState = runSetFiltersWithMockState(initialFilters);

        expect(newState).toEqual({
            ...initialFilters,
            sort: 'DESC',
        });
    });

    it('should update date range on handleDateChange', () => {
        const mockDates: [Dayjs, Dayjs] = [
            { format: () => '2024-01-01' } as Dayjs,
            { format: () => '2024-12-31' } as Dayjs,
        ];

        const mockDateStrings: [string, string] = ['2024-01-01', '2024-12-31'];
        act(() => {
            result.current.handleDateChange(mockDates, mockDateStrings);
        });

        const newState = runSetFiltersWithMockState(initialFilters);

        expect(newState).toEqual({
            ...initialFilters,
            from: '2024-01-01',
            to: '2024-12-31',
            page: 1,
        });
    });

    it('should update date range on handleDateChange', () => {
        const mockDates: [Dayjs, Dayjs] = [
            { format: () => '2024-06-01' } as Dayjs,
            { format: () => '2024-06-30' } as Dayjs,
        ];

        const mockDateStrings: [string, string] = ['2024-06-01', '2024-06-30'];
        act(() => {
            result.current.handleDateChange(mockDates, mockDateStrings);
        });

        const newState = runSetFiltersWithMockState(initialFilters);

        expect(newState).toEqual({
            ...initialFilters,
            from: '2024-06-01',
            to: '2024-06-30',
            page: 1,
        });
    });

    it('should reset from date to initial value on handleFromChange when null', () => {
        const date = null as unknown as Dayjs;
        act(() => {
            result.current.handleFromChange(date, '');
        });

        const newState = runSetFiltersWithMockState(initialFilters);

        expect(newState).toEqual({
            ...initialFilters,
            from: '2024-01-01',
            page: 1,
        });
    });

    it('should update from date on handleFromChange', () => {
        const newDate: Dayjs = dayjs('2024-06-01');
        const newDateString = '2024-06-01';

        act(() => {
            result.current.handleFromChange(newDate, newDateString);
        });

        const newState = runSetFiltersWithMockState(initialFilters);

        expect(newState).toEqual({
            ...initialFilters,
            from: '2024-06-01',
            page: 1,
        });
    });

    it('should reset to date to initial value on handleToChange when null', () => {
        const date = null as unknown as Dayjs;
        act(() => {
            result.current.handleToChange(date, '');
        });

        const newState = runSetFiltersWithMockState(initialFilters);

        expect(newState).toEqual({
            ...initialFilters,
            to: '2024-12-31',
            page: 1,
        });
    });

    it('should update to date on handleToChange', () => {
        const newDate: Dayjs = dayjs('2024-06-30');
        const newDateString = '2024-06-30';

        act(() => {
            result.current.handleToChange(newDate, newDateString);
        });

        const newState = runSetFiltersWithMockState(initialFilters);

        expect(newState).toEqual({
            ...initialFilters,
            to: '2024-06-30',
            page: 1,
        });
    });
});
