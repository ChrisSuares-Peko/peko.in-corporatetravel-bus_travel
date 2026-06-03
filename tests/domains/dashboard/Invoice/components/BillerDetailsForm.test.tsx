import React from 'react';

import { render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import { describe, it, expect } from 'vitest';

import BillerDetailsForm from '@domains/dashboard/Invoice/forms/BillerDetailsForm';

describe('BillerDetailsForm Component', () => {
    const renderComponent = () =>
        render(
            <Formik
                initialValues={{
                    billerName: '',
                    billerEmail: '',
                    billerCompanyAddress: '',
                    billerPhone: '',
                }}
                onSubmit={() => {}}
            >
                <BillerDetailsForm />
            </Formik>
        );

    it('renders the component correctly', () => {
        renderComponent();

        // Check if the "Biller Details" title is rendered
        expect(screen.getByText('Biller Details:')).toBeInTheDocument();

        // Check if the form fields are rendered correctly
        expect(screen.getByPlaceholderText('Biller Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Biller Email ID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Company Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
    });

    it('renders the placeholders correctly', () => {
        renderComponent();

        // Check if the placeholders are rendered correctly
        expect(screen.getByPlaceholderText('Biller Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Biller Email ID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Company Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
    });

    it('has a max length of 50 for the Biller Name field', () => {
        renderComponent();

        const billerNameInput = screen.getByPlaceholderText('Biller Name');
        expect(billerNameInput).toHaveAttribute('maxLength', '50');
    });

    it('has a max length of 50 for the Biller Email ID field', () => {
        renderComponent();

        const billerEmailInput = screen.getByPlaceholderText('Biller Email ID');
        expect(billerEmailInput).toHaveAttribute('maxLength', '50');
    });

    it('has a max length of 50 for the Company Address field', () => {
        renderComponent();

        const companyAddressInput = screen.getByPlaceholderText('Company Address');
        expect(companyAddressInput).toHaveAttribute('maxLength', '50');
    });

    it('has a max length of 10 for the Mobile Number field', () => {
        renderComponent();

        const mobileNumberInput = screen.getByPlaceholderText('Mobile Number');
        expect(mobileNumberInput).toHaveAttribute('maxLength', '10');
    });
});
