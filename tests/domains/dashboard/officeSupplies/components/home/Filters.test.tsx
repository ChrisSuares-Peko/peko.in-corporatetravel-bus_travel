import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import Filters from '@domains/dashboard/officeSupplies/components/home/Filters';

vi.mock('@domains/dashboard/officeSupplies/utils/data', () => {
    const mockFilterOptions = [
        { label: 'Price: Low to High', value: 'price_asc' },
        { label: 'Price: High to Low', value: 'price_desc' },
        { label: 'Best Sellers', value: 'best_sellers' },
    ];

    return {
        officeSuppliesFilterOptions: mockFilterOptions,
    };
});

describe('Filters Component', () => {
    const setFilter = vi.fn();
    const setSearchText = vi.fn();
    const setCurrentPage = vi.fn();

    const defaultProps = {
        filter: 'price_asc',
        setFilter,
        selectedCategoryName: 'All Categories',
        searchText: '',
        setSearchText,
        setCurrentPage,
    };

    it('should render category name correctly', () => {
        render(<Filters {...defaultProps} />);

        expect(screen.getByText('All Categories')).toBeInTheDocument();
    });

    it('should render filter options correctly', () => {
        render(<Filters {...defaultProps} />);

        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();

        fireEvent.mouseDown(select);

        const mockFilterOptions = [
            { label: 'Price: Low to High', value: 'price_asc' },
            { label: 'Price: High to Low', value: 'price_desc' },
            { label: 'Best Sellers', value: 'best_sellers' },
        ];

        // Use getAllByText to get all occurrences
        mockFilterOptions.forEach(option => {
            const options = screen.getAllByText(option.label);
            expect(options.length).toBeGreaterThan(0);
        });
    });

    it('should call setFilter and setCurrentPage when a filter is selected', async () => {
        render(<Filters {...defaultProps} />);

        const select = screen.getByRole('combobox');
        fireEvent.mouseDown(select);

        const option = screen.getByText('Price: High to Low');
        fireEvent.click(option);

        expect(setFilter).toHaveBeenCalledWith('price_desc');
        expect(setCurrentPage).toHaveBeenCalledWith(1);
    });
    it('should call setSearchText when search text is entered and search icon is clicked', () => {
        render(<Filters {...defaultProps} />);

        const searchInput = screen.getAllByPlaceholderText('Search for products')[0];
        const searchIcon = screen.getAllByRole('img', { name: /search/i })[0];

        fireEvent.change(searchInput, { target: { value: 'notebook' } });
        fireEvent.click(searchIcon);

        expect(setSearchText).toHaveBeenCalledWith('notebook');
    });

    it('should render search input correctly on small screens', () => {
        render(<Filters {...defaultProps} />);

        const searchInput = screen.getAllByPlaceholderText('Search for products')[1];

        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toHaveValue('');
    });
});
