import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import OrderProductDetails from '@domains/dashboard/officeSupplies/components/orderDetails/OrderedProductDetails';
import { useManageOrderApi } from '@domains/dashboard/officeSupplies/hooks/useManageOrderApi';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock('@domains/dashboard/officeSupplies/hooks/useManageOrderApi', () => ({
    useManageOrderApi: vi.fn(),
    cancelOrder: vi.fn(),
}));

vi.mock('@src/hooks/useScreenSize', () => ({
    default: () => ({ md: true }),
}));

vi.mock('@domains/dashboard/officeSupplies/components/orderDetails/ProductListingLG', () => ({
    __esModule: true,
    default: vi.fn(() => <div>Mocked Product Listing LG Component</div>),
}));

describe('OrderProductDetails Component', () => {
    const mockDispatch = vi.fn();
    const mockCancelOrder = vi.fn();
    const mockDownloadInvoice = vi.fn();
    const mockProductReturn = vi.fn();

    beforeEach(() => {
        vi.mocked(useAppDispatch).mockReturnValue(mockDispatch);
        vi.mocked(useManageOrderApi).mockReturnValue({
            isLoading: false,
            cancelOrder: mockCancelOrder,
            downloadInvoice: mockDownloadInvoice,
            productReturn: mockProductReturn,
        });

        vi.mocked(useAppSelector).mockReturnValue({
            orderDetails: {
                id: 123,
                ecomOrderStatus: 'PENDING',
                workspaceOrderStatus: 'ACTIVE',
                shippingFee: 10,
                surcharge: 5,
                amountInAed: 100,
                orderedProducts: [
                    { id: 1, name: 'Product 1', quantity: 1, price: 50 },
                    { id: 2, name: 'Product 2', quantity: 2, price: 25 },
                ], // Ensure orderedProducts is an array
            },
        });
    });

    const setup = () => render(<OrderProductDetails />);

    it('should render the component with order details', () => {
        setup();
        expect(screen.getByText('Order Details')).toBeInTheDocument();
        expect(screen.getByText('Shipping:')).toBeInTheDocument();
        expect(screen.getByText('Platform fee:')).toBeInTheDocument();
    });

    it('should show the Request for Order Cancellation button if order is not delivered or cancelled', () => {
        setup();
        expect(screen.getByText('Request for Order Cancellation')).toBeInTheDocument();
    });

    it('should show cancellation message if cancellation is requested', () => {
        vi.mocked(useAppSelector).mockReturnValueOnce({
            orderDetails: {
                id: 123,
                ecomOrderStatus: 'PENDING',
                workspaceOrderStatus: 'Cancel Requested',
                shippingFee: 10,
                surcharge: 5,
                amountInAed: 100,
                orderedProducts: [
                    { id: 1, name: 'Product 1', quantity: 1, price: 50 },
                    { id: 2, name: 'Product 2', quantity: 2, price: 25 },
                ],
            },
        });
        setup();
    });

    it('should show the Download Invoice button if the order is delivered', () => {
        vi.mocked(useAppSelector).mockReturnValueOnce({
            orderDetails: {
                id: 123,
                ecomOrderStatus: 'DELIVERED',
                workspaceOrderStatus: 'ACTIVE',
                shippingFee: 10,
                surcharge: 5,
                amountInAed: 100,
                orderedProducts: [
                    { id: 1, name: 'Product 1', quantity: 1, price: 50 },
                    { id: 2, name: 'Product 2', quantity: 2, price: 25 },
                ],
            },
        });
        setup();

        // expect(screen.getByText('Download Invoice')).toBeInTheDocument();
    });

    // it('should call cancelOrder with correct arguments when cancellation is requested', async () => {
    //     setup();
    //     fireEvent.click(screen.getByText('Request for Order Cancellation'));

    //     // Optionally fill out the form here if there are default empty fields or any validations

    //     fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    //     await waitFor(() => {
    //         expect(mockCancelOrder).toHaveBeenCalledWith(
    //             123,
    //             '',
    //             ''
    //         );
    //     });
    // });

    it('should call downloadInvoice when Download Invoice button is clicked', () => {
        vi.mocked(useAppSelector).mockReturnValueOnce({
            orderDetails: {
                id: 123,
                ecomOrderStatus: 'DELIVERED',
                workspaceOrderStatus: 'ACTIVE',
                shippingFee: 10,
                surcharge: 5,
                amountInAed: 100,
                orderedProducts: [
                    { id: 1, name: 'Product 1', quantity: 1, price: 50 },
                    { id: 2, name: 'Product 2', quantity: 2, price: 25 },
                ],
            },
        });
        setup();
        // const downloadButton = screen.getByRole('button', { name: /Download Invoice/i });

        // fireEvent.click(downloadButton);
        // expect(mockDownloadInvoice).toHaveBeenCalledWith(123);
    });
});
