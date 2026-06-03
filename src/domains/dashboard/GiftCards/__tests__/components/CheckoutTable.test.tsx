import { cleanup, render, screen } from '@testing-library/react';
import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest';

import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import CheckoutTable from '../../components/CheckoutTable';

// Mock the useAppSelector hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('CheckoutTable Component', () => {
    beforeEach(() => {
        // Mock the Redux state returned by useAppSelector
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    giftcardCheckout: {
                        productDetails: {
                            product_image: 'https://example.com/product-image.jpg',
                            product_name: 'Gift Card Name',
                        },
                        formDetails: {
                            amount: 100,
                            quantity: 2,
                            product: 200,
                        },
                    },
                },
            })
        );
        cleanup();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('renders CheckoutTable component', () => {
        render(<CheckoutTable />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    test('displays product details correctly', () => {
        render(<CheckoutTable />);
        expect(screen.getByText('Gift Card Name')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute(
            'src',
            'https://example.com/product-image.jpg'
        );
        expect(screen.getByText(`AED ${formatNumberWithLocalString(200)}`)).toBeInTheDocument();
    });

    test('conditionally renders product image', () => {
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    giftcardCheckout: {
                        productDetails: {
                            product_image: '',
                            product_name: 'Gift Card Name',
                        },
                        formDetails: {
                            amount: 100,
                            quantity: 2,
                            product: 200,
                        },
                    },
                },
            })
        );

        render(<CheckoutTable />);
        expect(screen.queryByRole('img')).toBeNull();
    });

    test('renders data rows with correct values', () => {
        render(<CheckoutTable />);
        expect(screen.getByText(`AED ${formatNumberWithLocalString(200)}`)).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    test('sub-total calculation is formatted correctly', () => {
        render(<CheckoutTable />);
        expect(screen.getByText(`AED ${formatNumberWithLocalString(200)}`)).toBeInTheDocument();
    });
});
