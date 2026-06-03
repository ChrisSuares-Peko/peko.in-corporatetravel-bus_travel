import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import SwitchInput from '@components/atomic/inputs/SwitchInput'; // Adjust import path if needed

const renderWithFormik = (ui: React.ReactElement, initialValues = { testField: false }) =>
    render(
        <Formik initialValues={initialValues} onSubmit={() => {}}>
            <Form>{ui}</Form>
        </Formik>
    );

describe('Switch input Component', () => {
    beforeEach(() => {
        cleanup();
    });

    it('renders with label and switch', () => {
        renderWithFormik(
            <SwitchInput
                name="testField"
                label="Test Label"
                classes="switch-class"
                labelClasses="label-class"
            />
        );
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('toggles switch and calls onChange handler', () => {
        const handleChange = vi.fn();
        renderWithFormik(<SwitchInput name="testField" onChange={handleChange} />);

        const switchElement = screen.getByRole('switch');

        // Simulate changing the switch to checked
        fireEvent.click(switchElement);
        expect(handleChange).toHaveBeenCalledWith(true);

        // Simulate changing the switch to unchecked
        fireEvent.click(switchElement);
        expect(handleChange).toHaveBeenCalledWith(false);
    });

    it('disables the switch when isDisabled is true', () => {
        renderWithFormik(<SwitchInput name="testField" isDisabled />);
        const switchElement = screen.getByRole('switch');
        expect(switchElement).toBeDisabled();
    });

    it('initializes with the correct value', () => {
        renderWithFormik(<SwitchInput name="testField" />);
        const switchElement = screen.getByRole('switch');
        expect(switchElement).not.toBeChecked();
    });

    it('initializes as checked if initial value is true', () => {
        renderWithFormik(<SwitchInput name="testField" />, { testField: true });
        const switchElement = screen.getByRole('switch');
        expect(switchElement).toBeChecked();
    });

    it('applies custom classes', () => {
        renderWithFormik(
            <SwitchInput
                name="testField"
                classes="custom-switch-class"
                labelClasses="custom-label-class"
                label="Custom Label"
            />
        );
        const switchElement = screen.getByRole('switch');
        const labelElement = screen.getByText('Custom Label');
        expect(switchElement).toHaveClass('custom-switch-class');
        expect(labelElement).toHaveClass('custom-label-class');
    });
});
