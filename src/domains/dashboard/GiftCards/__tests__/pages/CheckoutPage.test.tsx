import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import * as usePaymentModule from '../../hooks/usePayment';
import CheckoutPage from '../../pages/CheckoutPage';
import { GiftCardOrderTypes } from '../../types/employee';

const mockNavigate = vi.fn();

// Mock hooks
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

// vi.mock('../../components/CheckoutForm', () => ({
//     default: () => <div>CheckoutForm</div>,
// }));
vi.mock('../../components/CheckoutTable', () => ({
    default: () => <div>CheckoutTable</div>,
}));

describe('CheckoutPage', () => {
    const handleSubmissionMock = vi.fn();

    beforeEach(() => {
        const mockDispatch = vi.fn();

        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockImplementation((selector: any) =>
            selector({
                reducer: {
                    auth: {
                        role: 'user',
                        id: 12,
                    },
                    giftcardCheckout: {
                        productDetails: { product_image: 'example.png' },
                        formDetails: {
                            orderType: GiftCardOrderTypes.BUYFOROTHER,
                            quantity: '',
                            amount: '',
                            product: '',
                        },
                    },
                    subscriptions: {
                        services: {
                            userAccessibleServices: ['peko_payroll'],
                        },
                    },
                },
            })
        );
    });

    it('should render correctly', () => {
        render(<CheckoutPage />);

        // expect(screen.getByText('CheckoutForm')).toBeInTheDocument();

        const subTotalContainer = screen.getByText('Subtotal').closest('div');
        expect(
            within(subTotalContainer as HTMLElement).getByText(/AED\s*0.00/i)
        ).toBeInTheDocument();

        const totalContainer = screen.getByText('Total').closest('div');
        expect(within(totalContainer as HTMLElement).getByText(/AED\s*0.00/i)).toBeInTheDocument();

        expect(screen.getByRole('button', { name: /Buy Now/i })).toBeInTheDocument();
    });

    it('should call handleSubmission with correct data on form submit', async () => {
        vi.spyOn(usePaymentModule, 'default').mockReturnValue({
            handleSubmission: handleSubmissionMock,
        });
        render(<CheckoutPage />);

        fireEvent.change(screen.getByPlaceholderText('Receiver Name'), {
            target: { value: 'John' },
        });
        fireEvent.change(screen.getByPlaceholderText('Receiver Email Address'), {
            target: { value: 'john@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Sender Name'), {
            target: { value: 'johny' },
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Buy Now/i }));

        await waitFor(() => {
            expect(handleSubmissionMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    receiverFirstName: 'John',
                    receiverEmail: 'john@example.com',
                    employee: [],
                    orderType: 'buyForOther',
                })
            );
        });
    });

    it('should display validation errors when fields are invalid', async () => {
        render(<CheckoutPage />);

        fireEvent.click(screen.getByRole('button', { name: /Buy Now/i }));

        await waitFor(() => {
            expect(screen.getByText(/Please enter the name of the recipient/i)).toBeInTheDocument();
            expect(
                screen.getByText(/Please enter the email id of the recipient/i)
            ).toBeInTheDocument();
        });
    });
    it('should update field values correctly', () => {
        render(<CheckoutPage />);

        const nameInput = screen.getByPlaceholderText(/Receiver Name/i) as HTMLInputElement;
        const emailInput = screen.getByPlaceholderText(
            /Receiver Email Address/i
        ) as HTMLInputElement;

        fireEvent.change(nameInput, {
            target: { value: 'Jane Doe' },
        });
        fireEvent.change(emailInput, {
            target: { value: 'jane@example.com' },
        });

        expect(nameInput.value).toBe('Jane Doe');
        expect(emailInput.value).toBe('jane@example.com');
    });
});
