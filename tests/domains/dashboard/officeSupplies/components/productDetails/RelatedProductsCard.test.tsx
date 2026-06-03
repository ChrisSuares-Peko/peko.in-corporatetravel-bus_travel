import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import RelatedProductsCard from '@domains/dashboard/officeSupplies/components/productDetails/RelatedProductsCard';
import { formatNumberWithLocalString } from '@utils/priceFormat';

// Mock the navigate function from react-router-dom
vi.mock('react-router-dom', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useNavigate: () => vi.fn(),
    };
});

describe('RelatedProductsCard Component', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.mocked(mockNavigate).mockClear();
    });

    const defaultProps = {
        image: 'https://example.com/product-image.jpg',
        name: 'Product Name',
        price: '100.00',
        actualPrice: '150.00',
        category: 'Product Category',
        id: 1,
    };

    const setup = (props = {}) => {
        const setupProps = { ...defaultProps, ...props };
        return render(
            <Router>
                <RelatedProductsCard savePrice="" {...setupProps} />
            </Router>
        );
    };

    it('should display the product name, category, and price', () => {
        setup();
        expect(screen.getByText('Product Name')).toBeInTheDocument();
        expect(screen.getByText('Product Category')).toBeInTheDocument();
        expect(screen.getByText(formatNumberWithLocalString('100.00'))).toBeInTheDocument();
    });

    it('should display the actual price if different from the sale price', () => {
        setup();
        expect(screen.getByText(formatNumberWithLocalString('150.00'))).toBeInTheDocument();
    });

    it('should display the save amount if there is a discount', () => {
        setup();
        expect(screen.getByText('Save 50.00')).toBeInTheDocument();
    });

    // it('should navigate to the product details page when the card is clicked', () => {
    //     setup();
    //     const card = screen.getByRole('img', { name: /product/i }).closest('div');
    //     fireEvent.click(card!);

    //     expect(mockNavigate).toHaveBeenCalledWith(`/officeSupplies/productDetails/1`);
    // });

    it('should not display the save amount if there is no discount', () => {
        setup({ price: '150.00' });
        expect(screen.queryByText(/Save/)).not.toBeInTheDocument();
    });
});
