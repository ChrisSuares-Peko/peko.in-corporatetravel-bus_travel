import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { afterEach, describe, expect, it } from 'vitest';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';

const renderWithFormik = (ui: React.ReactElement) =>
    render(
        <Formik initialValues={{ testDate: '' }} onSubmit={() => {}}>
            {() => ui}
        </Formik>
    );

describe('DatePickerInput', () => {
    afterEach(() => {
        cleanup();
    });
    it('renders correctly with required props', () => {
        renderWithFormik(<DatePickerInput name="testDate" placeholder="Select a date" />);

        expect(screen.getByPlaceholderText('Select a date')).toBeInTheDocument();
    });

    it('renders with label', () => {
        renderWithFormik(<DatePickerInput name="date" label="Date" placeholder="Select Date" />);
        expect(screen.getByText('Date')).toBeInTheDocument();
    });

    it('shows tooltip when showToolTip is true', async () => {
        renderWithFormik(
            <DatePickerInput
                name="date"
                label="Date"
                placeholder="Select Date"
                isDisabled
                showToolTip
                tooltipText="This is a tooltip"
            />
        );
        fireEvent.mouseOver(screen.getByLabelText('info-circle'));

        await waitFor(() => {
            expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
        });
    });

    it('should handle min and max dates', () => {
        const minDate = dayjs().subtract(1, 'day');
        const maxDate = dayjs().add(1, 'day');
        renderWithFormik(
            <DatePickerInput
                name="testDate"
                placeholder="Select a date"
                minDate={minDate}
                maxDate={maxDate}
            />
        );

        const datePicker = screen.getByPlaceholderText('Select a date');

        // Simulate selecting a date within range
        fireEvent.change(datePicker, {
            target: { value: minDate.format('YYYY-MM-DD') },
        });
        expect(datePicker).toHaveValue(minDate.format('YYYY-MM-DD'));

        // Simulate selecting a date exactly at the max date
        fireEvent.change(datePicker, {
            target: { value: maxDate.format('YYYY-MM-DD') },
        });
        expect(datePicker).toHaveValue(maxDate.format('YYYY-MM-DD'));
    });

    it('should handle disabled state', () => {
        renderWithFormik(
            <DatePickerInput name="testDate" placeholder="Select a date" isDisabled />
        );

        const datePicker = screen.getByPlaceholderText('Select a date');
        expect(datePicker).toBeDisabled();
    });
});
