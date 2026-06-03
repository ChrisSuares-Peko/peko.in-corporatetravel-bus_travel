import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';

import EmailTemplate from '@domains/dashboard/Invoice/components/EmailTemplate';
import { useAppSelector } from '@src/hooks/store';

vi.mock('@src/hooks/store');

const mockUseAppSelector = useAppSelector as any;

const setup = (overrides = {}) => {
    const handleCancel = vi.fn();
    const onHandleTemplate = vi.fn();
    const templateData = [
        {
            type: 'email',
            subject: '[Invoice Number]',
            body: 'Dear [Customer Name], your due date is [Due Date] for the amount of [Amount]',
        },
    ];

    const defaultProps = {
        index: 0,
        handleCancel,
        templateData,
        onHandleTemplate,
        ...overrides,
    };

    return render(
        <Formik
            initialValues={{
                data: [
                    {
                        templet: {
                            email: {
                                emailId: '',
                                subject: '',
                                body: '',
                            },
                        },
                        sms: false,
                    },
                ],
            }}
            onSubmit={() => {}}
        >
            <EmailTemplate {...defaultProps} />
        </Formik>
    );
};

describe('EmailTemplate Component', () => {
    beforeEach(() => {
        mockUseAppSelector.mockReturnValue({
            Details: {
                recipientDetails: {
                    customerEmail: 'customer@example.com',
                    customerName: 'John Doe',
                },
                invoiceDetails: { dueDate: '2024-12-31', invoiceNo: 'INV12345' },
                paymentDetails: { amountDue: '1000' },
            },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders the EmailTemplate component', () => {
        setup();

        expect(screen.getByText('Subject')).toBeInTheDocument();
        expect(screen.getByText('Body')).toBeInTheDocument();
    });

    it('displays the initial email subject and body', () => {
        setup();

        expect(screen.getByPlaceholderText('Enter Subject')).toHaveValue('INV12345');
        expect(screen.getByPlaceholderText('Enter email body')).toHaveValue(
            'Dear John Doe, your due date is 2024-12-31 for the amount of 1000'
        );
    });

    it('allows selecting a different template', () => {
        setup();

        const templateButton = screen.getByText('Template 1');
        fireEvent.click(templateButton);

        expect(screen.getByPlaceholderText('Enter Subject')).toHaveValue('INV12345');
        expect(screen.getByPlaceholderText('Enter email body')).toHaveValue(
            'Dear John Doe, your due date is 2024-12-31 for the amount of 1000'
        );
    });

    it('displays custom fields when selecting "Custom"', () => {
        setup();

        const customButton = screen.getByText('Custom');
        fireEvent.click(customButton);

        expect(screen.getByPlaceholderText('Enter Subject')).toHaveValue('');
        expect(screen.getByPlaceholderText('Enter email body')).toHaveValue('');
    });

    it('calls handleCancel when clicking the Cancel button', () => {
        const handleCancel = vi.fn();
        setup({ handleCancel });

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(handleCancel).toHaveBeenCalled();
    });

    it('calls onHandleTemplate when submitting a valid form', () => {
        const onHandleTemplate = vi.fn();
        setup({ onHandleTemplate });

        fireEvent.change(screen.getByPlaceholderText('Enter Subject'), {
            target: { value: 'Test Subject' },
        });
        fireEvent.change(screen.getByPlaceholderText('Enter email body'), {
            target: { value: 'Test Body' },
        });

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        expect(onHandleTemplate).toHaveBeenCalled();
    });
});
