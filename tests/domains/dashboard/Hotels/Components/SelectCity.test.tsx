import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import SelectCity from '@src/domains/dashboard/Hotels/Components/AutoComplete/SelectCity'; // Adjust the import path accordingly

const mockOnSelect = vi.fn();
const mockSetSearchKey = vi.fn();

const cities = [
    { id: 1, cityName: 'Dubai', countryName: 'United Arab Emirates' },
    { id: 2, cityName: 'London', countryName: 'United Kingdom' },
    { id: 3, cityName: 'New York', countryName: 'United States' },
];

describe('SelectCity Component', () => {
    afterEach(() => {
        cleanup(); // Clean up the DOM after each test
        vi.clearAllMocks(); // Reset all mocks after each test
    });

    it('renders correctly with default value', () => {
        render(
            <SelectCity
                options={cities}
                onSelect={mockOnSelect}
                searchKey=""
                setSearchKey={mockSetSearchKey}
                defaultvalue="Dubai, United Arab Emirates"
                textSize="text-lg"
            />
        );

        expect(screen.getByPlaceholderText('Enter location')).toHaveValue(
            'Dubai, United Arab Emirates'
        );
    });

    it('updates input value when typing', () => {
        render(
            <SelectCity
                options={cities}
                onSelect={mockOnSelect}
                searchKey=""
                setSearchKey={mockSetSearchKey}
                defaultvalue=""
                textSize="text-lg"
            />
        );

        const input = screen.getByPlaceholderText('Enter location');
        fireEvent.change(input, { target: { value: 'New York' } });

        expect(input).toHaveValue('New York');
        expect(mockSetSearchKey).toHaveBeenCalledWith('New York');
    });

    it('displays filtered options when input is clicked', () => {
        render(
            <SelectCity
                options={cities}
                onSelect={mockOnSelect}
                searchKey=""
                setSearchKey={mockSetSearchKey}
                defaultvalue=""
                textSize="text-lg"
            />
        );

        const input = screen.getByPlaceholderText('Enter location');
        fireEvent.click(input);

        const option = screen.getByText('Dubai');
        expect(option).toBeInTheDocument();
    });

    it('calls onSelect with the correct value when an option is clicked', () => {
        render(
            <SelectCity
                options={cities}
                onSelect={mockOnSelect}
                searchKey=""
                setSearchKey={mockSetSearchKey}
                defaultvalue=""
                textSize="text-lg"
            />
        );

        const input = screen.getByPlaceholderText('Enter location');
        fireEvent.click(input);

        const option = screen.getByText('Dubai');
        fireEvent.click(option);

        expect(mockOnSelect).toHaveBeenCalledWith('Dubai, United Arab Emirates');
        expect(input).toHaveValue('Dubai, United Arab Emirates');
    });

    it('hides the options list when input loses focus', async () => {
        render(
            <SelectCity
                options={cities}
                onSelect={mockOnSelect}
                searchKey=""
                setSearchKey={mockSetSearchKey}
                defaultvalue=""
                textSize="text-lg"
            />
        );

        const input = screen.getByPlaceholderText('Enter location');
        fireEvent.click(input);
        fireEvent.blur(input);

        await waitFor(() => {
            expect(screen.queryByText('Dubai')).not.toBeInTheDocument();
        });
    });
});
