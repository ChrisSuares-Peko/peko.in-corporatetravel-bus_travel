import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, afterEach, it, expect } from 'vitest';

import GiftCardSmall from '../../components/GiftCardSmall';

describe('GiftCardSmall Component', () => {
    const defaultProps = {
        id: 1,
        image: 'http://example.com/image.jpg',
        name: 'Gift Card Name',
        description: 'Gift Card Description',
    };

    const renderComponent = (props = {}) =>
        render(
            <MemoryRouter>
                <GiftCardSmall {...defaultProps} {...props} />
            </MemoryRouter>
        );

    afterEach(() => {
        cleanup();
    });

    it('should render the component with the provided props', () => {
        renderComponent();

        expect(screen.getByRole('link')).toHaveAttribute('href', '/gift-cards/details/1');
        expect(screen.getByRole('img')).toHaveAttribute('src', 'http://example.com/image.jpg');
        expect(screen.getByText('Gift Card Name')).toBeInTheDocument();
        expect(screen.getByText('Gift Card Description')).toBeInTheDocument();
    });

    it('should render with default props when none are provided', () => {
        renderComponent({ id: 1 });

        expect(screen.getByRole('link')).toHaveAttribute('href', '/gift-cards/details/1');
        expect(screen.getByText('Gift Card Name')).toBeInTheDocument();
        expect(screen.getByText('Gift Card Description')).toBeInTheDocument();
    });

    it('should render without image if image prop is not provided', () => {
        renderComponent({ image: undefined });

        expect(screen.queryByAltText('Gift Card')).toBeNull();
    });
});
