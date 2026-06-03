import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';

import Footer from '@components/molecular/footer/index';

describe('Footer Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });
    test('renders Footer component without crashing', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
        // The footer should render
        expect(
            screen.getByText('© 2024 Peko Payment Services LLC. All Rights Reserved.')
        ).toBeInTheDocument();
    });

    test('renders all links with correct text and URLs', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
        // Check that each link is in the document
        expect(screen.getByText('Peko Platform Agreement')).toBeInTheDocument();
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
        expect(screen.getByText('Refund Policy')).toBeInTheDocument();
        expect(screen.getByText('Cookie Policy')).toBeInTheDocument();

        // Check the URLs
        expect(screen.getByText('Peko Platform Agreement').closest('a')).toHaveAttribute(
            'href',
            'https://peko.one/ae/platform-agreement'
        );
        expect(screen.getByText('Privacy Policy').closest('a')).toHaveAttribute(
            'href',
            'https://peko.one/ae/privacy-policy'
        );
        expect(screen.getByText('Refund Policy').closest('a')).toHaveAttribute(
            'href',
            'https://peko.one/ae/refund-policy'
        );
        expect(screen.getByText('Cookie Policy').closest('a')).toHaveAttribute(
            'href',
            'https://peko.one/ae/cookie-policy'
        );
    });

    test('applies correct styles to the footer', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
        // Check styles of footer
        const footerElement = screen
            .getByText('© 2024 Peko Payment Services LLC. All Rights Reserved.')
            .closest('footer');
        expect(footerElement).toHaveStyle('padding-inline: 0');
        expect(footerElement).toHaveStyle('padding-bottom: 0');
        expect(footerElement).toHaveClass('hidden pt-4 bg-white mt-14 md:block');
    });

    test('renders correct text color and size', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
        // Check text color and size
        expect(
            screen.getByText('© 2024 Peko Payment Services LLC. All Rights Reserved.')
        ).toHaveClass('text-sm text-textBlack');
        expect(screen.getByText('Peko Platform Agreement')).toHaveClass('text-sm text-textBlack');
        expect(screen.getByText('Privacy Policy')).toHaveClass('text-sm text-textBlack');
        expect(screen.getByText('Refund Policy')).toHaveClass('text-sm text-textBlack');
        expect(screen.getByText('Cookie Policy')).toHaveClass('text-sm text-textBlack');
    });

    test('renders divider between links', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );
        // Check that dividers are rendered correctly
        expect(screen.getAllByText('|')).toHaveLength(3);
    });
});
