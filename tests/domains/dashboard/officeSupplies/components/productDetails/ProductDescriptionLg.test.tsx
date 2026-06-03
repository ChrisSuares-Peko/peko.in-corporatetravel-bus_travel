import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import ProductDescriptionLg from '@domains/dashboard/officeSupplies/components/productDetails/ProductDescriptionLg';

vi.mock('@utils/priceFormat', () => ({
    formatNumberWithLocalString: vi.fn(value => value.toString()),
}));

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('ProductDescriptionLg Component', () => {
    const defaultProps = {
        id: 1,
        price: '100.00',
        actualPrice: '120.00',
        quantity: 10,
        savePrice: '20.00',
        addToCartLoading: false,
        cartUpdateQuantity: 1,
        handleUpdateQuantity: vi.fn(),
        handleAddToCart: vi.fn(),
        buyProducts: vi.fn(),
    };

    const setup = (props = {}) =>
        render(
            <Router>
                <ProductDescriptionLg {...{ ...defaultProps, ...props }} />
            </Router>
        );

    it('renders the component correctly', () => {
        setup();

        expect(screen.getByText('AED 100.00')).toBeInTheDocument();
        expect(screen.getByText('Real price')).toBeInTheDocument();
        expect(screen.getByText('AED 120.00')).toBeInTheDocument();
        expect(screen.getByText('Inclusive of VAT')).toBeInTheDocument();
        expect(
            screen.getByText(
                'This item will be delivered within 2 to 4 working days with standard delivery charge.'
            )
        ).toBeInTheDocument();
    });

    it('handles add to cart functionality', async () => {
        setup();

        const addToCartButton = screen.getByText('Add to Cart');
        fireEvent.click(addToCartButton);

        await waitFor(() => {
            expect(defaultProps.handleAddToCart).toHaveBeenCalledWith(1);
        });
    });

    it('hide Buy Now button when quantity is less than 1', () => {
        setup({ quantity: 0 });

        const buyNowButton = screen.queryByRole('button', { name: 'Buy Now' });

        expect(buyNowButton).not.toBeInTheDocument();
    });

    it('updates the quantity when InputNumber changes', () => {
        setup();

        const inputNumber = screen.getByRole('spinbutton');
        fireEvent.change(inputNumber, { target: { value: 2 } });

        expect(defaultProps.handleUpdateQuantity).toHaveBeenCalledWith(2);
    });

    it('shows Save amount if the product is discounted', () => {
        setup();

        expect(screen.getByText('Save AED 20.00')).toBeInTheDocument();
    });
});
