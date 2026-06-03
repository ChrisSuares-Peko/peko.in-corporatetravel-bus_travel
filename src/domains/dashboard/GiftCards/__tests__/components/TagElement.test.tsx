import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import TagElement from '../../components/TagElement'; // Adjust import path as needed

describe('TagElement Component', () => {
    const defaultProps = {
        count: 10,
        category: 'All',
        setCategory: vi.fn(),
        searchText: '',
        setSearchText: vi.fn(),
        setCurrentPage: vi.fn(),
    };

    it('should render Input and Select components with correct initial values', () => {
        render(<TagElement {...defaultProps} />);
        expect(screen.getByPlaceholderText('Search for gift cards')).toBeInTheDocument();
        expect(screen.getByTitle('All')).toBeInTheDocument();
    });

    it('should call setSearchText and setCurrentPage when input value changes', () => {
        render(<TagElement {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText('Search for gift cards'), {
            target: { value: 'New search text' },
        });

        expect(defaultProps.setSearchText).toHaveBeenCalledWith('New search text');
        expect(defaultProps.setCurrentPage).toHaveBeenCalledWith(1);
    });

    it('should call setCategory and setCurrentPage when a new category is selected', async () => {
        render(<TagElement {...defaultProps} />);

        fireEvent.mouseDown(screen.getByRole('combobox'));

        fireEvent.click(screen.getByText('Name'));

        await waitFor(() => {
            expect(defaultProps.setCategory).toHaveBeenCalledWith('name');
            expect(defaultProps.setCurrentPage).toHaveBeenCalledWith(1);
        });
    });
});
