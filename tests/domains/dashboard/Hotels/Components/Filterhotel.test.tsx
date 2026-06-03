import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';
import Filterhotel from '@src/domains/dashboard/Hotels/Components/HotelListing/Filterhotel';

describe('Filterhotel Component', () => {
    afterEach(() => {
        cleanup();
    });

    const setPriceRange = vi.fn();
    const setSearchQuery = vi.fn();
    const setRange = vi.fn();
    const range = [200, 5000];
    const searchQuery = 'Test Hotel';

    it('renders correctly', () => {
        render(
            <Filterhotel
                setPriceRange={setPriceRange}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                range={range}
                setRange={setRange}
            />
        );

        // Check that the price labels and slider are rendered
        expect(screen.getByText('Price')).toBeInTheDocument();
        expect(screen.getByText('Min price')).toBeInTheDocument();
        expect(screen.getByText('Max price')).toBeInTheDocument();
        expect(screen.getByText('AED 200')).toBeInTheDocument();
        expect(screen.getByText('AED 5000')).toBeInTheDocument();

        // Check that the search input is rendered
        expect(screen.getByPlaceholderText('Search by property name')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Hotel')).toBeInTheDocument();
    });

    it('handles search input change correctly', () => {
        render(
            <Filterhotel
                setPriceRange={setPriceRange}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                range={range}
                setRange={setRange}
            />
        );

        const input = screen.getByPlaceholderText('Search by property name');
        fireEvent.change(input, { target: { value: 'New Hotel' } });

        expect(setSearchQuery).toHaveBeenCalledWith('New Hotel');
    });

    it('handles clearing the search input', () => {
        render(
            <Filterhotel
                setPriceRange={setPriceRange}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                range={range}
                setRange={setRange}
            />
        );

        const input = screen.getByPlaceholderText('Search by property name');

        // Find the clear button by its aria-label "close-circle"
        const clearButton = screen.getByLabelText('close-circle');

        fireEvent.click(clearButton);

        expect(setSearchQuery).toHaveBeenCalledWith('');
    });
});
