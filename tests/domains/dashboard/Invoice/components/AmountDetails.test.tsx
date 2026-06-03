import React from 'react';

import { render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import { expect, describe, it } from 'vitest';

import AmountDetails from '@domains/dashboard/Invoice/components/AmountDetails';

describe('AmountDetails Component', () => {
    const initialValues = {
        shipping: '',
        amountPaid: '',
        paymentMode: '',
        bankAccount: '',
    };

    const setup = () =>
        render(
            <Formik initialValues={initialValues} onSubmit={() => {}}>
                <AmountDetails />
            </Formik>
        );

    it('renders SubTotal input', () => {
        setup();
        expect(screen.getByText('SubTotal')).toBeInTheDocument();
    });

    it('renders VAT input', () => {
        setup();
        expect(screen.getByText('VAT')).toBeInTheDocument();
    });

    it('renders Discount input', () => {
        setup();
        expect(screen.getByText('Discount')).toBeInTheDocument();
    });

    it('renders Shipping input', () => {
        setup();

        const amountInputs = screen.getAllByPlaceholderText('Enter Amount');

        const shippingInput = amountInputs[0];
        expect(shippingInput).toBeInTheDocument();

        const amountPaidInput = amountInputs[1];
        expect(amountPaidInput).toBeInTheDocument();
    });

    it('renders Amount Paid input', () => {
        setup();

        const amountInputs = screen.getAllByPlaceholderText('Enter Amount');

        const shippingInput = amountInputs[0];
        expect(shippingInput).toBeInTheDocument();

        const amountPaidInput = amountInputs[1];
        expect(amountPaidInput).toBeInTheDocument();
    });

    it('renders Amount Due input', () => {
        setup();
        expect(screen.getByText('Amount Due')).toBeInTheDocument();
    });
});
