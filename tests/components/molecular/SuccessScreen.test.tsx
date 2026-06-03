import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';

import SuccessScreen from '@components/molecular/success/SuccessScreen';

describe('SuccessScreen', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });

    test('renders component with default title and message', () => {
        render(<SuccessScreen />);
        expect(screen.getByText('Your payment has been successful!')).toBeInTheDocument();
        expect(
            screen.getByText(
                'You will receive a confirmation email once the process is completed. Thank you for using Peko.'
            )
        ).toBeInTheDocument();
    });

    test('renders component with custom title and message', () => {
        render(<SuccessScreen title="Custom Title" message="Custom message." />);
        expect(screen.getByText('Custom Title')).toBeInTheDocument();
        expect(screen.getByText('Custom message.')).toBeInTheDocument();
    });

    test('renders default payment success screen with correct icon size, title, and message', () => {
        const { container } = render(<SuccessScreen />);

        const svgElement = container.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
        if (svgElement) {
            expect(svgElement).toHaveAttribute('width', '200');
            expect(svgElement).toHaveAttribute('height', '200');
        }

        expect(screen.getByText('Your payment has been successful!')).toBeInTheDocument();
        expect(
            screen.getByText(
                'You will receive a confirmation email once the process is completed. Thank you for using Peko.'
            )
        ).toBeInTheDocument();
    });

    test('renders other success screen with correct icon size, title, and message', () => {
        const { container } = render(<SuccessScreen isOtherSuccess />);

        const svgElement = container.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
        if (svgElement) {
            expect(svgElement).toHaveAttribute('width', '100');
            expect(svgElement).toHaveAttribute('height', '100');
        }

        expect(screen.getByText('Your payment has been successful!')).toBeInTheDocument();
        expect(
            screen.getByText(
                'You will receive a confirmation email once the process is completed. Thank you for using Peko.'
            )
        ).toBeInTheDocument();
    });

    test('renders first button with correct text and link', () => {
        render(
            <MemoryRouter>
                <SuccessScreen firstButtonTxt="Go Home" firstBtnLink="home" />
            </MemoryRouter>
        );
        const button = screen.getByText('Go Home');
        expect(button).toBeInTheDocument();
        expect(button.closest('a')).toHaveAttribute('href', '/home');
    });

    test('renders children correctly', () => {
        render(
            <SuccessScreen>
                <div data-testid="child-element">Child Element</div>
            </SuccessScreen>
        );
        expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });

    test('does not render first button if text or link is missing', () => {
        render(<SuccessScreen />);
        const button = screen.queryByText('Go to dashboard');
        expect(button).not.toBeInTheDocument();
    });
});
