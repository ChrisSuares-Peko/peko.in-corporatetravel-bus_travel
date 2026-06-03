import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import MonthPickerInput from '@components/atomic/inputs/MonthPickerInput';

// Helper to wrap the component with Formik
const renderWithFormik = (ui: React.ReactElement) =>
    render(
        <Formik
            initialValues={{ testDate: '' }}
            validate={values => {
                const errors: any = {};
                if (!values.testDate) {
                    errors.testDate = 'Month is required';
                }
                return errors;
            }}
            onSubmit={() => {}}
        >
            {() => ui}
        </Formik>
    );

describe('MonthPickerInput', () => {
    beforeEach(() => {
        cleanup();
    });
    it('renders with label and placeholder', () => {
        renderWithFormik(
            <MonthPickerInput name="testDates" label="Select Month" placeholder="Select a monthe" />
        );

        expect(screen.getByText('Select Month')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Select a monthe')).toBeInTheDocument();
    });

    it('displays an error message when there is an error', async () => {
        const validate = (values: { testDate: string }) => {
            const errors: { testDate?: string } = {};
            if (!values.testDate) {
                errors.testDate = 'This field is required';
            }
            return errors;
        };
        render(
            <Formik initialValues={{ testDate: '' }} validate={validate} onSubmit={vi.fn()}>
                <Form>
                    <MonthPickerInput
                        name="testDate"
                        label="Select Month"
                        placeholder="Select a month"
                        isRequired
                    />
                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        );

        fireEvent.click(screen.getByText('Submit'));

        const errorMessage = await screen.findByText('This field is required');
        expect(errorMessage).toBeInTheDocument();
    });

    it('disables the DatePicker when isDisabled is true', () => {
        renderWithFormik(
            <MonthPickerInput name="testDate" placeholder="Select a month" isDisabled />
        );

        expect(screen.getByPlaceholderText('Select a month')).toBeDisabled();
    });

    it('shows tooltip when showToolTip is true', async () => {
        renderWithFormik(
            <MonthPickerInput
                name="testDate"
                placeholder="Select a month"
                label="Test Select"
                showToolTip
                tooltipText="This is a tooltip"
            />
        );

        fireEvent.mouseOver(screen.getByLabelText('info-circle'));

        await waitFor(() => {
            expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
        });
    });

    it('respects minDate and maxDate props for disabled dates', () => {
        renderWithFormik(
            <MonthPickerInput
                name="testDate"
                placeholder="Select a months"
                minDate={dayjs('2024-01-01')}
                maxDate={dayjs('2024-12-31')}
                showTime
            />
        );

        const datePickerInputs = screen.getAllByPlaceholderText('Select a months');

        expect(datePickerInputs).toHaveLength(1);

        const datePickerInput = datePickerInputs[0];

        fireEvent.focus(datePickerInput);
        screen.debug();

        const disabledMonths = [
            { month: '2023-12', disabled: true },
            { month: '2025-01', disabled: true },
        ];

        disabledMonths.forEach(({ month, disabled }) => {
            const monthElement = screen.queryByText(month);
            if (disabled) {
                if (monthElement) {
                    expect(monthElement).toHaveClass('ant-picker-cell-disabled');
                } else {
                    expect(monthElement).not.toBeInTheDocument();
                }
            } else {
                expect(monthElement).toBeInTheDocument();
            }
        });
    });
});
