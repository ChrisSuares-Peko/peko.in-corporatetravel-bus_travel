import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ProductReturnModal from '@domains/dashboard/officeSupplies/components/modals/ProductReturnModal';
import { productReturnReasons } from '@domains/dashboard/officeSupplies/utils/data';

// Mock the `useManageOrderApi` hook
vi.mock('@domains/dashboard/officeSupplies/hooks/useManageOrderApi', () => ({
    useManageOrderApi: vi.fn(() => ({
        isLoading: false,
        productReturn: vi.fn(),
    })),
}));

// Mock the `productReturnReasons` data
vi.mock('@domains/dashboard/officeSupplies/utils/data', () => ({
    productReturnReasons: ['Damaged item', 'Wrong item delivered', 'Other'],
}));

describe('ProductReturnModal Component', () => {
    const mockOnCancel = vi.fn();
    const mockProductReturn = vi.fn();

    beforeEach(() => {
        // vi.mocked(useManageOrderApi).mockReturnValue({
        //     isLoading: false,
        //     productReturn: mockProductReturn,
        //     // cancelOrder: undefined,
        //     // downloadInvoice: undefined
        // });
    });

    const defaultProps = {
        visible: true,
        productId: 123,
        orderId: 456,
        onCancel: mockOnCancel,
    };

    const setup = (props = {}) => {
        const setupProps = { ...defaultProps, ...props };
        return render(<ProductReturnModal {...setupProps} />);
    };

    it('should render the modal with the correct title and description', () => {
        setup();
        expect(screen.getByText('Order Return')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to return your order?')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Please Note: If your payment method is a bank account, please ensure that you have updated your bank account information in your profile.'
            )
        ).toBeInTheDocument();
    });

    it('should render the Select with the correct options', () => {
        setup();
        const select = screen.getByRole('combobox'); // Query by role
        fireEvent.mouseDown(select); // Open the dropdown

        productReturnReasons.forEach(reason => {
            const dropdownItems = screen.getAllByText(reason); // Get all elements with the text
            // Check if one of the dropdown items contains the reason text
            expect(
                dropdownItems.some(item => item.closest('.ant-select-item-option-content'))
            ).toBe(true);
        });
    });

    it('should call onCancel when the Cancel button is clicked', () => {
        setup();
        fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
        expect(mockOnCancel).toHaveBeenCalled();
    });
});
