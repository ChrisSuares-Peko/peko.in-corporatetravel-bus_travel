import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import ShoppingCartIcon from '@domains/dashboard/officeSupplies/components/ShoppingCartIcon';

import '@testing-library/jest-dom';

vi.mock('@domains/dashboard/officeSupplies/assets/icons/cart-icon.png', () => ({
    default: 'mock-cart-icon.png',
}));

describe('ShoppingCartIcon Component', () => {
    it('should render the cart icon and text', () => {
        render(<ShoppingCartIcon />);

        const cartImage = screen.getByRole('img');
        expect(cartImage).toHaveAttribute('src', 'mock-cart-icon.png');

        const cartText = screen.getByText(/Cart/i);
        expect(cartText).toBeInTheDocument();
    });

    it('should apply the correct styles', () => {
        render(<ShoppingCartIcon />);

        const cartImage = screen.getByRole('img');
        expect(cartImage).toHaveClass('xs:hidden md:flex hover:fill-red');

        const cartText = screen.getByText(/Cart/i);
        expect(cartText).toHaveStyle({
            marginLeft: '5px',
            fontSize: '16px',
            fontWeight: 'bold',
        });
    });
});
