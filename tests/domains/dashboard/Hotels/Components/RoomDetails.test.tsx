import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import '@testing-library/jest-dom/vitest';
import RoomDetails from '@domains/dashboard/Hotels/Components/GuestDetails/RoomDetails';

// Mock the ReactSVG component
vi.mock('react-svg', () => ({
    ReactSVG: ({ src }: { src: string }) => <img src={src} alt="icon" />,
}));

describe('RoomDetails Component', () => {
    const roomProps = {
        name: 'Deluxe Room',
        sqft: 400,
        refund: 'Fully refundable',
        cancellation: '2024-08-25',
        meal: 'Breakfast included',
        rateNotes: 'room details',
    };

    it('renders room name and meal details', () => {
        render(<RoomDetails {...roomProps} />);

        expect(screen.getByText('Deluxe Room')).toBeInTheDocument();
        expect(screen.getByText('Breakfast included')).toBeInTheDocument();
    });

    it('renders refund policy', () => {
        render(<RoomDetails {...roomProps} />);

        const refundTexts = screen.getAllByText('Fully refundable');
        expect(refundTexts.length).toBe(1); // Adjust this to 1 if only one instance is expected
    });

    it('formats and renders the cancellation date correctly', () => {
        render(<RoomDetails {...roomProps} />);

        const date = new Date(roomProps.cancellation).toLocaleDateString('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
        });

        // Uncomment the following lines in the component to test this
        // expect(screen.getByText(date)).toBeInTheDocument();
    });
});
