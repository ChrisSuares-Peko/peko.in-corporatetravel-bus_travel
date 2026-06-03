import React from 'react';

import { render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import { describe, it, expect } from 'vitest';

import AdditionalDetailsForm from '@domains/dashboard/Invoice/forms/AdditionalDetailsForm';

describe('AdditionalDetailsForm Component', () => {
    const renderComponent = () =>
        render(
            <Formik initialValues={{ comments: '', termsConditions: '' }} onSubmit={() => {}}>
                <AdditionalDetailsForm />
            </Formik>
        );

    it('renders the component correctly', () => {
        renderComponent();

        // Check if the "Additional Details" title is rendered
        expect(screen.getByText('Additional Details:')).toBeInTheDocument();

        // Check if the text areas with specific placeholders are rendered correctly
        expect(screen.getByPlaceholderText('Enter Notes')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Terms & Conditions')).toBeInTheDocument();
    });

    it('renders the placeholders correctly', () => {
        renderComponent();

        // Check if the placeholders are rendered correctly
        expect(screen.getByPlaceholderText('Enter Notes')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Terms & Conditions')).toBeInTheDocument();
    });

    it('has a max length of 200 for the Notes field', () => {
        renderComponent();

        const notesTextArea = screen.getByPlaceholderText('Enter Notes');
        expect(notesTextArea).toHaveAttribute('maxLength', '200');
    });

    it('has a max length of 100 for the Terms & Conditions field', () => {
        renderComponent();

        const termsTextArea = screen.getByPlaceholderText('Enter Terms & Conditions');
        expect(termsTextArea).toHaveAttribute('maxLength', '100');
    });
});
