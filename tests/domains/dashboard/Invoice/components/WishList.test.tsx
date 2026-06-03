import React from 'react';

import { render, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { describe, it, expect, vi } from 'vitest';

import WishList from '@domains/dashboard/Invoice/components/WishList';
import { ProductDetail } from '@domains/dashboard/Invoice/types';

describe('WishList Component', () => {
    const mockInitialValues: ProductDetail[] = [
        {
            item: 'Item 1',
            quantity: '1',
            price: '100',
            vat: '5',
            discount: '10',
            amount: '90',
        },
    ];

    const renderComponent = (initialValues = mockInitialValues) =>
        render(
            <Formik
                initialValues={{ items: initialValues, charge: '0', amountPaid: '0' }}
                onSubmit={vi.fn()}
            >
                <Form>
                    <WishList values={initialValues} charge="0" amountPaid="0" />
                </Form>
            </Formik>
        );

    it('renders the component correctly', () => {
        renderComponent();

        expect(screen.getByText('Enter the items you wish to bill:')).toBeInTheDocument();

        // Using getAllByText and selecting the first element
        const totalElements = screen.getAllByText('Total');
        expect(totalElements.length).toBeGreaterThan(0);
        expect(totalElements[0]).toBeInTheDocument();

        expect(screen.getByText('SubTotal')).toBeInTheDocument();
        expect(screen.getByText('VAT')).toBeInTheDocument();
        expect(screen.getByText('Discount')).toBeInTheDocument();
        expect(screen.getByText('Shipping')).toBeInTheDocument();
        expect(screen.getByText('Amount Paid')).toBeInTheDocument();
        expect(screen.getByText('Amount Due')).toBeInTheDocument();
    });

    // it('allows adding a new item', async () => {
    //     renderComponent();

    //     const addButton = screen.getByText('Add New Item');
    //     expect(addButton).toBeInTheDocument();

    //     fireEvent.click(addButton);

    //     await waitFor(() => {
    //         const itemInputs = screen.getAllByPlaceholderText('Description');
    //         expect(itemInputs.length).toBe(mockInitialValues.length + 1);
    //     });
    // });

    // it('allows removing an item', () => {
    //     renderComponent();

    //     // Assuming the delete button was rendered
    //     const removeButton = screen.getByTestId('delete-item-0');
    //     fireEvent.click(removeButton);

    //     // After removing, check if the item was removed
    //     expect(screen.queryByPlaceholderText('Description')).not.toBeInTheDocument();
    //   });

    it('disables the Total, VAT, and Discount fields', () => {
        renderComponent();

        const totalFields = screen.getAllByDisplayValue('AED 90.00');
        totalFields.forEach(field => {
            expect(field).toBeDisabled();
        });
    });

    // it('calculates the correct Amount Due based on inputs', () => {
    //     renderComponent();

    //     const amountDueField = screen.getByTestId('amount-due-field');
    //     expect(amountDueField).toBeInTheDocument();
    // });
});
