import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, vi, it, expect, beforeEach, afterEach } from 'vitest';

import IconCard from '@components/molecular/cards/IconCard';

describe('IconCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });
    const mockIcon = '/path/to/icon.svg';
    const mockTitle = 'Test Title';
    const mockOnClick = vi.fn();

    it('renders the icon and title correctly', () => {
        render(<IconCard icon={mockIcon} title={mockTitle} />);
        screen.debug();
        const iconElement = screen.getByTestId('icon-svg');
        expect(iconElement).toBeInTheDocument();
        const svgSrcDiv = iconElement.querySelector('div[data-src]');
        expect(svgSrcDiv).toHaveAttribute('data-src', mockIcon);

        const titleElement = screen.getByText(mockTitle);
        expect(titleElement).toBeInTheDocument();
    });

    it('calls the onClick handler when clicked', () => {
        render(<IconCard icon={mockIcon} title={mockTitle} onClick={mockOnClick} />);

        const iconCardElement = screen.getByRole('button');
        fireEvent.click(iconCardElement);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('does not throw an error if onClick is not provided', () => {
        render(<IconCard icon={mockIcon} title={mockTitle} />);

        const iconCardElement = screen.getByRole('button');
        expect(() => {
            fireEvent.click(iconCardElement);
        }).not.toThrow();
    });
});
