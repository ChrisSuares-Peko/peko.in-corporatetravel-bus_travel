import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import VoucherIdForm from '../../../components/forms/VoucherIdForm';
import { useGetBillApi } from '../../../hooks/useGetBillApi';

// Mock the useGetBillApi hook
vi.mock('../../../hooks/useGetBillApi', () => ({
    useGetBillApi: vi.fn(),
}));

describe('VoucherIdForm', () => {
    const mockGetBalance = vi.fn();
    const mockIsLoading = false;

    beforeEach(() => {
        (useGetBillApi as any).mockReturnValue({
            getBalance: mockGetBalance,
            isLoading: mockIsLoading,
        });
    });

    it('should render the form with the required fields', () => {
        render(<VoucherIdForm />);

        expect(screen.getByText('Voucher ID')).toBeInTheDocument();
        expect(screen.getByText('Get details')).toBeInTheDocument();
    });

    it('should call getBalance with the voucher ID when the form is submitted', async () => {
        render(<VoucherIdForm />);

        fireEvent.change(screen.getByPlaceholderText('Voucher ID'), {
            target: { value: '123456' },
        });
        fireEvent.click(screen.getByRole('button', { name: /get details/i }));

        await waitFor(() => {
            expect(mockGetBalance).toHaveBeenCalled();
        });
    });

    it('should validate form fields according to the validation schema', async () => {
        render(<VoucherIdForm />);

        fireEvent.click(screen.getByRole('button', { name: /get details/i }));

        // Adjust the error text to match your validation messages
        expect(await screen.findByText(/Please enter the voucher ID/i)).toBeInTheDocument();
    });
});
