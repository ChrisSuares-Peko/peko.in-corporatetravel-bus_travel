import React from 'react';

import { render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { describe, it, expect } from 'vitest';

import CustomerDetailsForm from '@domains/dashboard/Invoice/forms/CustomerDetailsForm';

const mockStore = configureStore([]);

describe('CustomerDetailsForm Component', () => {
    const renderComponent = (isMobile = false) => {
        const store = mockStore({
            // Add any necessary initial state for your test
        });

        return render(
            <Provider store={store}>
                <Formik
                    initialValues={{
                        customerName: '',
                        customerEmail: '',
                        customerAddress: '',
                        customerPhone: '',
                    }}
                    onSubmit={() => {}}
                >
                    <CustomerDetailsForm />
                </Formik>
            </Provider>,
            {
                wrapper: ({ children }) => (
                    <div className={isMobile ? 'mobile-view' : ''}>{children}</div>
                ),
            }
        );
    };

    it('renders the component correctly', () => {
        renderComponent();

        // Check if the "Customer Details" title is rendered
        expect(screen.getByText('Customer Details:')).toBeInTheDocument();

        // Check if the form fields are rendered correctly
        expect(screen.getByPlaceholderText('Customer Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Customer Email ID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Customer Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
    });

    it('renders the placeholders correctly', () => {
        renderComponent();

        // Check if the placeholders are rendered correctly
        expect(screen.getByPlaceholderText('Customer Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Customer Email ID')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Customer Address')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
    });

    it('has the correct max length for each field', () => {
        renderComponent();

        expect(screen.getByPlaceholderText('Customer Name')).toHaveAttribute('maxLength', '50');
        expect(screen.getByPlaceholderText('Customer Email ID')).toHaveAttribute('maxLength', '50');
        expect(screen.getByPlaceholderText('Customer Address')).toHaveAttribute('maxLength', '50');
        expect(screen.getByPlaceholderText('Mobile Number')).toHaveAttribute('maxLength', '10');
    });

    it('does not render MobileViewUploadImage component on non-mobile screens', () => {
        renderComponent(false);

        // Check that MobileViewUploadImage is not rendered when on non-mobile view
        expect(screen.queryByText(/upload image/i)).not.toBeInTheDocument();
    });
});
