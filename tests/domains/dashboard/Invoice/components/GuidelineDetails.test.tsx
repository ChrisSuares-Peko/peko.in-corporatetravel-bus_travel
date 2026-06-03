import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { describe, it, vi, expect, beforeEach } from 'vitest';

import GuidelineDetails from '@domains/dashboard/Invoice/forms/GuidelineDetails';
import useGetPaymentlink from '@domains/dashboard/Invoice/hooks/useGetPaymentlinkApi';
import useGuidelines from '@domains/dashboard/Invoice/hooks/useGuidelines';

// Mock hooks
vi.mock('@domains/dashboard/Invoice/hooks/useGuidelines');
vi.mock('@domains/dashboard/Invoice/hooks/useGetPaymentlinkApi');

// Prepare mock store
const mockStore = configureStore([]);
const store = mockStore({
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

describe('GuidelineDetails Component', () => {
    const mockGeneratePaymentLink = vi.fn();
    const mockGetPaymentLink = vi.fn();
    const mockPush = vi.fn();
    const mockRemove = vi.fn();

    beforeEach(() => {
        (useGuidelines as any).mockReturnValue({
            generatePaymentLink: mockGeneratePaymentLink,
            data: [],
            isLoading: false,
        });

        (useGetPaymentlink as any).mockReturnValue({
            getPaymentLink: mockGetPaymentLink,
        });

        mockPush.mockClear();
        mockRemove.mockClear();
    });

    const renderComponent = (values = []) => {
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <Formik initialValues={{ data: values }} onSubmit={vi.fn()}>
                        <GuidelineDetails values={values} data={[]} isLoading={false} />
                    </Formik>
                </MemoryRouter>
            </Provider>
        );
    };

    it('renders the component correctly', () => {
        renderComponent();
        expect(screen.getByText('Invoice Guidelines')).toBeInTheDocument();
        expect(screen.getByText('Add another condition')).toBeInTheDocument();
    });

    it('calls the getPaymentLink function when "Skip and Generate Link" is clicked', () => {
        renderComponent();

        const skipButton = screen.getByText('Skip and Generate Link');
        fireEvent.click(skipButton);

        expect(mockGetPaymentLink).toHaveBeenCalled();
    });

    it('renders the correct number of AddGuideline components based on values', () => {
        const mockValues: any = [{}, {}, {}]; // 3 items in values
        renderComponent(mockValues);

        const addGuidelineComponents = screen.getAllByText('Add another condition');
        expect(addGuidelineComponents.length).toBe(1);
    });

    it('displays "Add Guideline" button when paymentMode is not "payment link"', () => {
        const customStore = mockStore({
            reducer: {
                invoices: {
                    Details: {
                        id: 1,
                        paymentMode: 'direct',
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

        render(
            <Provider store={customStore}>
                <MemoryRouter>
                    <Formik initialValues={{ data: [] }} onSubmit={vi.fn()}>
                        <GuidelineDetails values={[]} data={[]} isLoading={false} />
                    </Formik>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('Add Guideline')).toBeInTheDocument();
    });
});
