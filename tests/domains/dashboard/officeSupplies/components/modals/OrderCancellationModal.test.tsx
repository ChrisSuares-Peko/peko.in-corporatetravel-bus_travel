import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getOtpOrderCancel } from '@domains/dashboard/officeSupplies/api/orderHistory';
import OrderCancellationModal from '@domains/dashboard/officeSupplies/components/modals/OrderCancellationModal';
import { orderCancellationReasons } from '@domains/dashboard/officeSupplies/utils/data';

// Mock the API call
vi.mock('@domains/dashboard/officeSupplies/api/orderHistory', () => ({
    getOtpOrderCancel: vi.fn(),
}));

describe('OrderCancellationModal Component', () => {
    const mockStore = configureStore([]);
    const store = mockStore({
        reducer: {
            auth: { id: '123', role: 'USER' },
        },
    });

    const mockOnCancel = vi.fn();
    const mockOnSubmit = vi.fn();

    const defaultProps = {
        visible: true,
        isLoading: false,
        onCancel: mockOnCancel,
        onSubmit: mockOnSubmit,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const setup = (props = {}) => {
        const setupProps = { ...defaultProps, ...props };
        return render(
            <Provider store={store}>
                <OrderCancellationModal {...setupProps} />
            </Provider>
        );
    };

    it('should render the modal with the correct title and description', () => {
        setup();
        expect(screen.getByText('Order Cancellation')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to cancel your order?')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Please Note: If your payment method is a bank account, please ensure that you have updated your bank account information in your profile.'
            )
        ).toBeInTheDocument();
    });

    it('should call getOtpOrderCancel and open OTP modal when form is submitted', async () => {
        (getOtpOrderCancel as any).mockResolvedValue(true);
        setup();

        const select = screen.getByRole('combobox');
        fireEvent.mouseDown(select);
        fireEvent.click(
            screen.getByText(orderCancellationReasons[0], {
                selector: '.ant-select-item-option-content',
            })
        );

        const descriptionInput = screen.getByRole('textbox');
        fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        await waitFor(() => {
            expect(getOtpOrderCancel).toHaveBeenCalledWith({
                userId: '123',
                userType: 'USER',
                scope: 'email',
            });
        });

        expect(screen.getByText('Confirmation')).toBeInTheDocument();
    });

    it('should show validation errors when trying to submit empty form', async () => {
        setup();

        fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

        expect(await screen.findByText('Please select a reason')).toBeInTheDocument();
        expect(await screen.findByText('Please provide a description')).toBeInTheDocument();
    });

    it('should call onCancel when the Cancel button is clicked', () => {
        setup();
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(mockOnCancel).toHaveBeenCalled();
    });
});
