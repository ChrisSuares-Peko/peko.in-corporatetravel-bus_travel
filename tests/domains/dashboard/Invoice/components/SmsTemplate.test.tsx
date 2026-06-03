import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import { vi, describe, it, expect } from 'vitest';

import SmsTemplate from '@domains/dashboard/Invoice//components/SmsTemplate';

// Mock useAppSelector
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn().mockReturnValue({
        Details: {
            recipientDetails: {
                customerPhone: '1234567890',
                customerName: 'John Doe',
            },
            invoiceDetails: {
                dueDate: '2024-12-31',
                invoiceNo: 'INV-1234',
            },
            paymentDetails: {
                amountDue: '1000.00',
            },
        },
        trackerData: {},
    }),
}));

describe('SmsTemplate Component', () => {
    const handleCancel = vi.fn();
    const templateData = [
        {
            type: 'sms',
            body: 'Dear [Customer Name], your invoice [Invoice Number] of [Amount] is due on [Due Date].',
        },
        {
            type: 'sms',
            body: 'Reminder: Invoice [Invoice Number] for [Amount] is due on [Due Date].',
        },
    ];

    const renderComponent = () =>
        render(
            <Formik initialValues={{ data: [{ templet: { sms: {} } }] }} onSubmit={vi.fn()}>
                <SmsTemplate index={0} handleCancel={handleCancel} templateData={templateData} />
            </Formik>
        );

    it('renders the component with template options', () => {
        renderComponent();

        expect(screen.getByText('Body')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter sms body')).toBeInTheDocument();
        expect(screen.getByText('Template 1')).toBeInTheDocument();
        expect(screen.getByText('Template 2')).toBeInTheDocument();
        expect(screen.getByText('Custom')).toBeInTheDocument();
    });

    it('selects a template and updates the SMS body', () => {
        renderComponent();

        const templateButton = screen.getByText('Template 2');
        fireEvent.click(templateButton);

        const smsBodyTextarea = screen.getByPlaceholderText('Enter sms body');

        expect(smsBodyTextarea).toBeInTheDocument();
        expect(smsBodyTextarea).toHaveValue(
            'Reminder: Invoice INV-1234 for 1000.00 is due on 2024-12-31.'
        );
    });

    it('selects custom and clears the SMS body', () => {
        renderComponent();

        const customButton = screen.getByText('Custom');
        fireEvent.click(customButton);

        expect(screen.getByPlaceholderText('Enter sms body')).toHaveValue('');
    });

    // it('displays error when submitting without SMS body', () => {
    //     renderComponent();

    //     const customButton = screen.getByText('Custom');
    //     fireEvent.click(customButton);

    //     const submitButton = screen.getByText('Submit');
    //     fireEvent.click(submitButton);

    //     expect(screen.getByText('SMS body is required')).toBeInTheDocument();
    // });

    it('submits form with selected template', () => {
        renderComponent();

        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);

        expect(handleCancel).toHaveBeenCalled();
    });
});
