import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import BackNavigation from '@components/molecular/backButtons/BackNavigation';

describe('BackNavigation', () => {
    it('renders the "Go Back" text and image', () => {
        render(<BackNavigation />);
        expect(screen.getByText('Go Back')).toBeInTheDocument();

        const backImage = screen.getByAltText('goback');
        expect(backImage).toBeInTheDocument();
        expect(backImage).toHaveAttribute('src', '/src/assets/svg/grayBack.svg');
    });

    it('calls window.history.back() when clicked', () => {
        const goBackSpy = vi.spyOn(window.history, 'back');
        render(<BackNavigation />);

        const backNavigation = screen.getByText('Go Back');
        fireEvent.click(backNavigation);

        expect(goBackSpy).toHaveBeenCalledTimes(1);
    });

    it('renders with the provided className', () => {
        const customClass = 'custom-class';
        render(<BackNavigation className={customClass} />);

        const backNavigation = screen.getByText('Go Back').parentElement;
        expect(backNavigation).toHaveClass(customClass);
    });
});
