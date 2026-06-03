import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import { vi, describe, it, expect } from 'vitest';

import WishListForm from '@domains/dashboard/Invoice/forms/WishListForm';

describe('WishListForm Component', () => {
    const initialValues = {
        items: [
            {
                item: '',
                quantity: 0,
                price: 0,
                vat: 0,
                discount: 0,
                amount: 0,
            },
        ],
    };

    it('renders the component correctly', () => {
        render(
            <Formik initialValues={initialValues} onSubmit={vi.fn()}>
                <WishListForm index={0} />
            </Formik>
        );

        expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Quantity')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Price')).toBeInTheDocument();
        // Change to match the actual placeholder or remove trailing spaces
        expect(screen.getByPlaceholderText('VAT')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Discount')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('')).toBeInTheDocument(); // Placeholder for the total amount field
    });

    it('calculates the total value correctly', async () => {
        render(
            <Formik initialValues={initialValues} onSubmit={vi.fn()}>
                <WishListForm index={0} />
            </Formik>
        );

        fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '2' } });
        fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '50' } });
        fireEvent.change(screen.getByPlaceholderText('VAT'), { target: { value: '10' } }); // Adjusted this line
        fireEvent.change(screen.getByPlaceholderText('Discount'), { target: { value: '5' } });

        const totalValue = screen.getByPlaceholderText('');
        expect(totalValue).toHaveValue('105.00');
    });

    it('disables the total input field', () => {
        render(
            <Formik initialValues={initialValues} onSubmit={vi.fn()}>
                <WishListForm index={0} />
            </Formik>
        );

        const totalValue = screen.getByPlaceholderText('');
        expect(totalValue).toBeDisabled();
    });
});
