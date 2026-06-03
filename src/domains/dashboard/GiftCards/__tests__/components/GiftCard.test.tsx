import React from 'react';

import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';

import giftCardDefault from '@domains/dashboard/GiftCards/assets/images/giftCardDefault.png';

import GiftCard from '../../components/GiftCard';

describe('GiftCard Component', () => {
    beforeEach(() => {
        cleanup();
    });
    afterEach(() => {
        vi.clearAllMocks();
    });

    test('renders GiftCard component with default props', () => {
        render(
            <MemoryRouter>
                <GiftCard />
            </MemoryRouter>
        );

        expect(screen.getByText('No Preview Available')).toBeInTheDocument();
    });

    test('renders image when provided', () => {
        render(
            <MemoryRouter>
                <GiftCard id={1} image="https://example.com/image.png" loaded />
            </MemoryRouter>
        );

        const image = screen.getByRole('img');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image.png');
    });

    test('renders default image on error', () => {
        render(
            <MemoryRouter>
                <GiftCard id={1} image="https://invalid-url.com/image.png" loaded />
            </MemoryRouter>
        );

        const image = screen.getByRole('img');
        fireEvent.error(image);
        expect(image).toHaveAttribute('src', giftCardDefault);
    });

    test('applies hover effect on mouse enter and remove on mouse leave', () => {
        render(
            <MemoryRouter>
                <GiftCard id={1} image="https://example.com/image.png" loaded />
            </MemoryRouter>
        );

        const card = screen.getByRole('link').firstChild;
        expect(card).not.toHaveClass('transform scale-105');
        fireEvent.mouseEnter(card!);
        expect(card).toHaveClass('transform scale-105');
        fireEvent.mouseLeave(card!);
        expect(card).not.toHaveClass('transform scale-105');
    });

    test('renders loading skeleton when loading', () => {
        const { container } = render(
            <MemoryRouter>
                <GiftCard id={1} image="https://example.com/image.png" loaded />
            </MemoryRouter>
        );

        const skeleton = container.querySelector('.ant-skeleton-active');

        expect(skeleton).toBeInTheDocument();
    });

    test('renders empty state when no image provided', () => {
        render(
            <MemoryRouter>
                <GiftCard id={1} image="" loaded />
            </MemoryRouter>
        );
        expect(screen.getByText('No Preview Available')).toBeInTheDocument();
    });

    test('renders name and description correctly', () => {
        render(
            <MemoryRouter>
                <GiftCard
                    id={1}
                    name="Gift Card Name"
                    description="This is a gift card description."
                    loaded
                />
            </MemoryRouter>
        );

        expect(screen.getByText('Gift Card Name')).toBeInTheDocument();
        expect(screen.getByText('This is a gift card description.')).toBeInTheDocument();
    });

    test('navigates to correct path on click', () => {
        render(
            <MemoryRouter>
                <GiftCard id={1} name="Gift Card Name" description="Description" loaded />
            </MemoryRouter>
        );

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/gift-cards/details/1'); // Ensure the link is formed correctly
    });
});
