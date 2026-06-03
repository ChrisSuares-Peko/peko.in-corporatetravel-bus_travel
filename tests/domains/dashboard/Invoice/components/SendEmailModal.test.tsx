import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { SendEmailModal } from '@domains/dashboard/Invoice/components/SendEmailModal';
import useSendMail from '@domains/dashboard/Invoice/hooks/useSendMail';
import useSentEmail from '@domains/dashboard/Invoice/hooks/useSentEmail';

// Mock the hooks
vi.mock('@domains/dashboard/Invoice/hooks/useSendMail', () => ({
    default: vi.fn(() => ({
        sendMail: vi.fn(),
        loading: false,
    })),
}));

vi.mock('@domains/dashboard/Invoice/hooks/useSentEmail', () => ({
    default: vi.fn(() => ({
        sendEmail: vi.fn(),
        loader: false,
    })),
}));

describe('SendEmailModal Component', () => {
    const renderComponent = (props: any = {}) =>
        render(
            <SendEmailModal
                open
                handleCancel={vi.fn()}
                invoiceId={1}
                invoiceOnly={false}
                amount="100.00"
                link="http://example.com"
                {...props}
            />
        );

    it('renders the modal and handles input correctly', () => {
        renderComponent();

        // Check if the modal is rendered with the title
        expect(screen.getByText('Send Email')).toBeInTheDocument();

        // Check if the input is rendered
        const input = screen.getByPlaceholderText('Enter Email Address');
        expect(input).toBeInTheDocument();

        // Simulate typing an email
        fireEvent.change(input, { target: { value: 'test@example.com' } });
        expect(input).toHaveValue('test@example.com');
    });

    it('shows an error for invalid email format', async () => {
        renderComponent();

        // Simulate typing an invalid email
        const input = screen.getByPlaceholderText('Enter Email Address');
        fireEvent.change(input, { target: { value: 'invalid-email' } });

        // Simulate blur event to trigger validation
        fireEvent.blur(input);

        // Check if the error message is displayed
        await waitFor(() => {
            expect(screen.getByText('Invalid email format')).toBeInTheDocument();
        });
    });

    it('calls sendMail when form is submitted and invoiceOnly is false', async () => {
        const mockSendMail = vi.fn();
        (useSendMail as any).mockReturnValue({
            sendMail: mockSendMail,
            loading: false,
        });

        renderComponent({ invoiceOnly: false });

        // Simulate typing a valid email
        const input = screen.getByPlaceholderText('Enter Email Address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        // Simulate form submission
        fireEvent.click(screen.getByText('OK'));

        // Check if sendMail was called with correct payload
        await waitFor(() => {
            expect(mockSendMail).toHaveBeenCalledWith({
                email: 'test@example.com',
                amount: '100.00',
                link: 'http://example.com',
            });
        });
    });

    it('calls sendEmail when form is submitted and invoiceOnly is true', async () => {
        const mockSendEmail = vi.fn();
        (useSentEmail as any).mockReturnValue({
            sendEmail: mockSendEmail,
            loader: false,
        });

        renderComponent({ invoiceOnly: true });

        // Simulate typing a valid email
        const input = screen.getByPlaceholderText('Enter Email Address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        // Simulate form submission
        fireEvent.click(screen.getByText('OK'));

        // Check if sendEmail was called with correct payload
        await waitFor(() => {
            expect(mockSendEmail).toHaveBeenCalledWith({
                invoiceId: 1,
                email: 'test@example.com',
                invoiceOnly: true,
            });
        });
    });

    it('clears input and closes modal on cancel', () => {
        const mockHandleCancel = vi.fn();

        renderComponent({ handleCancel: mockHandleCancel });

        // Simulate typing a valid email
        const input = screen.getByPlaceholderText('Enter Email Address');
        fireEvent.change(input, { target: { value: 'test@example.com' } });

        // Simulate cancel button click
        fireEvent.click(screen.getByText('Cancel'));

        // Check if the handleCancel function was called
        expect(mockHandleCancel).toHaveBeenCalled();

        // Check if the input is cleared
        expect(input).toHaveValue('');
    });
});
