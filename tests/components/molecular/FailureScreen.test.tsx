import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, vi, it, expect, beforeEach, afterEach } from 'vitest';

import FailureScreen from '@components/molecular/failure/FailureScreen';

describe('FailureScreen', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });
    it('renders with default props', () => {
        render(
            <MemoryRouter>
                <FailureScreen />
            </MemoryRouter>
        );
        expect(screen.getByText('Your transaction has failed')).toBeInTheDocument();
        expect(
            screen.getByText(
                /We regret to inform you that your attempt to payment was unsuccessful/i
            )
        ).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
    it('renders with custom title and message', () => {
        render(
            <MemoryRouter>
                <FailureScreen
                    title="Payment Failed"
                    message="Please check your payment details and try again."
                />
            </MemoryRouter>
        );
        expect(screen.getByText('Payment Failed')).toBeInTheDocument();
        expect(
            screen.getByText('Please check your payment details and try again.')
        ).toBeInTheDocument();
    });

    it('renders with a button that navigates to the correct route', () => {
        render(
            <MemoryRouter>
                <FailureScreen buttonRoute="retry" />
            </MemoryRouter>
        );
        const button = screen.getByText('Try Again');
        expect(button.closest('a')).toHaveAttribute('href', '/retry');
    });

    it('should render the Lottie animation inside the SVG', () => {
        const { container } = render(
            <MemoryRouter>
                <FailureScreen buttonRoute="retry" />
            </MemoryRouter>
        );

        const svgElement = container.querySelector('svg');

        expect(svgElement).toBeInTheDocument();

        if (svgElement) {
            const clippathElement = svgElement.querySelector('clipPath');
            expect(clippathElement).toBeInTheDocument();
            expect(clippathElement).toHaveAttribute('id', '__lottie_element_188');

            const gElement = svgElement.querySelector('g');
            expect(gElement).toBeInTheDocument();
            expect(gElement).toHaveAttribute('clip-path', 'url(#__lottie_element_188)');
        }
    });

    it('renders the button with correct style and behavior', () => {
        render(
            <MemoryRouter>
                <FailureScreen buttonRoute="retry" />
            </MemoryRouter>
        );
        const button = screen.getByText('Try Again');
        expect(button.parentElement).toHaveStyle('background-color: rgb(22, 119, 255)');
        expect(button.parentElement).toHaveStyle('color: white'); // Update to match actual color
    });
});
