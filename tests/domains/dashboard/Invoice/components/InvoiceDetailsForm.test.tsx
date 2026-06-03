import React from 'react';

import { render, screen } from '@testing-library/react';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { describe, it, expect, vi } from 'vitest';

import InvoiceDetailsForm from '@domains/dashboard/Invoice/forms/InvoiceDetailsForm';

// Mock the `TextInput` and `SampleDatePicker` components
vi.mock('@components/atomic/inputs/TextInput', () => ({
    __esModule: true,
    default: vi.fn(({ placeholder }) => (
        <input data-testid="text-input" placeholder={placeholder} />
    )),
}));

vi.mock('@domains/dashboard/Invoice/components/SampleDatePicker', () => ({
    __esModule: true,
    default: vi.fn(({ name, placeholder, minDate, isDisabled }) => (
        <input
            data-testid={`datepicker-${name}`}
            placeholder={placeholder}
            min={minDate ? minDate.format('YYYY-MM-DD') : undefined}
            disabled={isDisabled} // Apply the disabled attribute based on the prop
        />
    )),
}));

describe('InvoiceDetailsForm Component', () => {
    const renderComponent = (startdate: any = null) =>
        render(
            <Formik
                initialValues={{ invoiceNo: '', invoiceDate: '', dueDate: '' }}
                onSubmit={vi.fn()}
            >
                <InvoiceDetailsForm startdate={startdate} />
            </Formik>
        );

    it('renders the component correctly', () => {
        renderComponent();

        expect(screen.getByText('Invoice Details:')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Invoice Number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Invoice Date')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Due Date')).toBeInTheDocument();
    });

    it('disables the Due Date picker when startdate is not provided', () => {
        renderComponent();

        const dueDatePicker = screen.getByPlaceholderText('Due Date');
        expect(dueDatePicker).toBeDisabled();
    });

    it('enables the Due Date picker when startdate is provided', () => {
        renderComponent(dayjs().toISOString());

        const dueDatePicker = screen.getByPlaceholderText('Due Date');
        expect(dueDatePicker).not.toBeDisabled();
    });

    it('sets the minDate correctly for the Due Date picker when startdate is in the past', () => {
        const pastDate = dayjs().subtract(5, 'days').toISOString();
        renderComponent(pastDate);

        const dueDatePicker = screen.getByTestId('datepicker-dueDate');
        const minDueDate = dayjs().add(1, 'day');

        expect(dueDatePicker).toHaveAttribute('min', minDueDate.format('YYYY-MM-DD'));
    });

    it('sets the minDate correctly for the Due Date picker when startdate is today or in the future', () => {
        const futureDate = dayjs().add(5, 'days').toISOString();
        renderComponent(futureDate);

        const dueDatePicker = screen.getByTestId('datepicker-dueDate');
        const minDueDate = dayjs(futureDate).add(1, 'day');

        expect(dueDatePicker).toHaveAttribute('min', minDueDate.format('YYYY-MM-DD'));
    });
});
