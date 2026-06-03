import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { afterEach, describe, expect, it } from 'vitest';

import DateTimePickerInput from '@components/atomic/inputs/DateTimePickerInput';

describe('date time picker input', () => {
    afterEach(() => {
        cleanup();
    });

    it('should render DateTimePickerInput with default props', () => {
        render(
            <Formik initialValues={{ date: '' }} onSubmit={() => {}}>
                <DateTimePickerInput name="date" placeholder="Select date" />
            </Formik>
        );
        expect(screen.getByPlaceholderText('Select date')).toBeInTheDocument();
    });

    it('should render DateTimePickerInput with a label', () => {
        render(
            <Formik initialValues={{ date: '' }} onSubmit={() => {}}>
                <DateTimePickerInput name="date" label="Date" placeholder="Select date" />
            </Formik>
        );
        expect(screen.getByText('Date')).toBeInTheDocument();
    });

    it('should render DateTimePickerInput with a tooltip', async () => {
        render(
            <Formik initialValues={{ date: '' }} onSubmit={() => {}}>
                <DateTimePickerInput
                    name="date"
                    placeholder="Select date"
                    label="Date"
                    showToolTip
                    tooltipText="This is a tooltip"
                />
            </Formik>
        );

        fireEvent.mouseOver(screen.getByLabelText('info-circle'));

        await waitFor(() => {
            expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
        });
    });

    it('should render DateTimePickerInput as disabled', () => {
        render(
            <Formik initialValues={{ date: '' }} onSubmit={() => {}}>
                <DateTimePickerInput name="date" placeholder="Select date" isDisabled />
            </Formik>
        );
        expect(screen.getByPlaceholderText('Select date')).toBeDisabled();
    });

    it('should render DateTimePickerInput with min and max date', () => {
        render(
            <Formik initialValues={{ date: '' }} onSubmit={() => {}}>
                <DateTimePickerInput
                    name="date"
                    placeholder="Select date"
                    minDate={dayjs().subtract(1, 'day')}
                    maxDate={dayjs().add(1, 'day')}
                />
            </Formik>
        );
    });
});
