import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, vi, it, expect, beforeEach, afterEach } from 'vitest';

import CorporateTravelCard from '@components/molecular/corporate-travel-card/CorporateTravelCard';

describe('CorporateTravelCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });

    it('renders the CorporateTravelCard with all options', () => {
        render(<CorporateTravelCard selectedType="1" handleChange={() => {}} />);
        expect(screen.getByTestId('flight-svg')).toBeInTheDocument();
        expect(screen.getByTestId('hotel-svg')).toBeInTheDocument();
        expect(screen.getByTestId('esim-svg')).toBeInTheDocument();
        expect(screen.getByText('Air Ticket')).toBeInTheDocument();
        expect(screen.getByText('Hotel Booking')).toBeInTheDocument();
        expect(screen.getByText('Travel eSIM')).toBeInTheDocument();
    });

    it('highlights the selected type correctly', () => {
        const { rerender } = render(
            <CorporateTravelCard selectedType="1" handleChange={() => {}} />
        );
        expect(screen.getByTestId('flight-svg')).toHaveClass('selected-svg');
        expect(screen.getByText('Air Ticket')).toHaveClass('text-red-500');
        expect(screen.getByTestId('hotel-svg')).not.toHaveClass('selected-svg');
        expect(screen.getByTestId('esim-svg')).not.toHaveClass('selected-svg');

        rerender(<CorporateTravelCard selectedType="2" handleChange={() => {}} />);
        expect(screen.getByTestId('hotel-svg')).toHaveClass('selected-svg');
        expect(screen.getByText('Hotel Booking')).toHaveClass('text-red-500');
    });

    it('calls handleChange with correct argument when type is clicked', () => {
        const handleChangeMock = vi.fn();
        render(<CorporateTravelCard selectedType="1" handleChange={handleChangeMock} />);

        fireEvent.click(screen.getByText('Hotel Booking'));
        expect(handleChangeMock).toHaveBeenCalledWith('2');

        fireEvent.click(screen.getByText('Travel eSIM'));
        expect(handleChangeMock).toHaveBeenCalledWith('3');
    });

    it('does not throw error when selectedType is empty or invalid', () => {
        render(<CorporateTravelCard selectedType="" handleChange={() => {}} />);

        expect(screen.queryAllByText(/Air Ticket/i)).toHaveLength(1);
        expect(screen.queryAllByText(/Hotel Booking/i)).toHaveLength(1);
        expect(screen.queryAllByText(/Travel eSIM/i)).toHaveLength(1);
    });
});
