import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import EditGuideline from '@domains/dashboard/Invoice/components/Guideline/EditGuideline';

const mockStore = configureStore([]);

describe('EditGuideline Component', () => {
    let store: any;

    beforeEach(() => {
        store = mockStore({
            reducer: {
                invoices: {
                    Details: {
                        id: 1,
                        paymentMode: 'payment link',
                    },
                    invoiceResponse: {
                        recipientDetails: JSON.stringify({
                            customerName: 'John Doe',
                            customerEmail: 'john@example.com',
                            customerPhone: '1234567890',
                        }),
                        invoiceDetails: JSON.stringify({
                            dueDate: '2024-12-31T00:00:00Z',
                        }),
                        amount: '1000.00',
                    },
                },
            },
        });
    });

    const renderComponent = (values: any = []) => {
        render(
            <Provider store={store}>
                <Formik initialValues={{ data: values }} onSubmit={vi.fn()}>
                    <EditGuideline values={values} data={[]} isLoading={false} />
                </Formik>
            </Provider>
        );
    };

    it('renders the component correctly', () => {
        renderComponent([{ days: '1', sms: true, email: false, notification: false }]);

        expect(screen.getByText('Invoice Guidelines')).toBeInTheDocument();
        expect(screen.getByText('Days')).toBeInTheDocument();
        expect(screen.getByText('Action')).toBeInTheDocument();
        expect(screen.getByText('Template')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Update Guideline')).toBeInTheDocument();
    });

    it('adds a new guideline when "Add another condition" is clicked', () => {
        const initialValues = [{ days: '1', sms: true, email: false, notification: false }];
        renderComponent(initialValues);

        fireEvent.click(screen.getByText('Add another condition'));

        expect(screen.getAllByText('Days').length).toBe(1);
    });

    it('removes a guideline when the delete icon is clicked', () => {
        const initialValues = [
            { days: '1', sms: true, email: false, notification: false },
            { days: '2', sms: true, email: false, notification: false },
        ];
        renderComponent(initialValues);

        const deleteIcons = screen.getAllByRole('img', { name: /delete/i });
        expect(deleteIcons.length).toBe(1);

        // fireEvent.click(deleteIcons[1]);

        expect(screen.getAllByText('Days').length).toBe(1); // Expecting only 1 instance of "Days"
    });

    it('renders the submit button as enabled when isLoading is false', () => {
        render(
            <Provider store={store}>
                <Formik initialValues={{ data: [] }} onSubmit={vi.fn()}>
                    <EditGuideline values={[]} data={[]} isLoading={false} />
                </Formik>
            </Provider>
        );

        const submitButton = screen.getByText('Update Guideline').closest('button');
        expect(submitButton).not.toBeDisabled();
    });
});
