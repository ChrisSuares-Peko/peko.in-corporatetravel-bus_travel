import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

import CustomerDetails from '../../../components/forms/CustomerDetails';
import usePayment from '../../../hooks/usePayment';

vi.mock('../../../hooks/usePayment', () => ({
    default: vi.fn(),
}));

describe('CustomerDetails', () => {
    const mockHandleSubmission = vi.fn();

    beforeEach(() => {
        (usePayment as Mock).mockReturnValue({
            handleSubmission: mockHandleSubmission,
        });
    });

    it('should render the form with the required fields', () => {
        render(<CustomerDetails />);

        expect(screen.getByText('Customer Emirates ID')).toBeInTheDocument();
        expect(screen.getByText('Customer Name')).toBeInTheDocument();
        expect(screen.getByText('Pay Now')).toBeInTheDocument();
    });

    it('should call handleSubmission with form values when the form is submitted', async () => {
        render(<CustomerDetails />);

        fireEvent.change(screen.getByPlaceholderText(/Enter Emirates ID/i), {
            target: { value: '123456789012345' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter Name/i), {
            target: { value: 'John Doe' },
        });

        fireEvent.click(screen.getByRole('button', { name: /pay now/i }));

        await waitFor(() => {
            expect(mockHandleSubmission).toHaveBeenCalledWith({
                customerName: 'John Doe',
                emiratesId: '123456789012345',
            });
        });
    });

    it('should validate form fields according to the validation schema', async () => {
        render(<CustomerDetails />);

        fireEvent.click(screen.getByRole('button', { name: /pay now/i }));

        // Adjust this part based on how errors are displayed in your UI
        expect(
            await screen.findByText(/Please enter the customer Emirates ID/i)
        ).toBeInTheDocument();
        expect(await screen.findByText(/Please enter the customer name/i)).toBeInTheDocument();
    });
});
