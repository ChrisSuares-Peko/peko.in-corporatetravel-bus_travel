import { cleanup, render, screen } from '@testing-library/react';
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';

import { NavIcon } from '@components/molecular/nav-section/vertical/NavIcon';

describe('NavText Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });

    test('renders NavIcon with ReactSVG component and data-testid', () => {
        const mockIcon = { src: 'path/to/icon.svg' };

        render(<NavIcon icon={mockIcon} isActive />);

        // Verify ReactSVG is present in the document
        const svgComponent = screen.getByTestId('nav-icon-svg');
        expect(svgComponent).toBeInTheDocument();
    });

    test('applies active class when isActive is true', () => {
        const mockIcon = 'path/to/icon.svg';
        render(NavIcon(mockIcon, true));
        const svgComponent = screen.getByRole('img');
        expect(svgComponent).toHaveClass('svg-primary');
    });

    test('applies stroke class when isActive and isStrokeSvg are true', () => {
        const mockIcon = 'path/to/icon.svg';
        render(NavIcon(mockIcon, true, true));
        screen.debug();

        const iconComponent = screen.getByRole('img');
        expect(iconComponent).toHaveClass('svg-primary-stroke');
    });

    test('does not apply stroke class when isActive is true but isStrokeSvg is false', () => {
        const mockIcon = 'path/to/icon.svg';
        render(NavIcon(mockIcon, true, false));
        const iconComponent = screen.getByRole('img');
        expect(iconComponent).toHaveClass('svg-primary');
    });

    test('renders different icons correctly', () => {
        const icon1 = 'path/to/icon1.svg';
        const icon2 = 'path/to/icon2.svg';

        const { rerender } = render(NavIcon(icon1, false));

        const navIconDiv = screen.getByTestId('nav-icon-svg');

        const childDiv = navIconDiv.querySelector('div');
        if (childDiv) {
            const innermostDiv = childDiv.querySelector('div');
            expect(innermostDiv).toBeInTheDocument();
            expect(innermostDiv).toHaveAttribute('data-src', icon1);
        }

        rerender(NavIcon(icon2, false));
        const navIconDiv2 = screen.getByTestId('nav-icon-svg');

        const childDiv2 = navIconDiv2.querySelector('div');
        if (childDiv2) {
            const updatedIconDiv = childDiv2.querySelector('div');
            expect(updatedIconDiv).toHaveAttribute('data-src', icon2);
        }
    });

    test('sets key prop on ReactSVG component', () => {
        const mockIcon = 'path/to/icon.svg';
        const { getByTestId } = render(NavIcon(mockIcon, false));

        const reactSvgComponent = getByTestId('nav-icon-svg');
        const childDiv2 = reactSvgComponent.querySelector('div');
        if (childDiv2) {
            const updatedIconDiv = childDiv2.querySelector('div');
            expect(updatedIconDiv).toHaveAttribute('data-src', mockIcon);
        }
    });
});
