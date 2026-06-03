import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';

const renderWithFormik = (ui: React.ReactElement) =>
    render(
        <Formik initialValues={{}} onSubmit={() => {}}>
            {() => ui}
        </Formik>
    );

describe('check box input', () => {
    beforeEach(() => {
        globalThis.getComputedStyle = vi.fn().mockImplementation(() => ({
            getPropertyValue: () => '',
        }));
    });
    afterEach(() => {
        cleanup();
    });

    it('renders CheckboxInput with default props', () => {
        renderWithFormik(<CheckboxInput name="test-checkbox">Test Checkbox</CheckboxInput>);
        expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
    });

    it('renders CheckboxInput with checked prop', () => {
        renderWithFormik(
            <CheckboxInput name="test-checkbox" checked>
                Test Checkbox
            </CheckboxInput>
        );
        expect(screen.getByLabelText('Test Checkbox')).toBeChecked();
    });

    it('renders CheckboxInput with disabled prop', () => {
        renderWithFormik(
            <CheckboxInput name="test-checkbox" disabled>
                Test Checkbox
            </CheckboxInput>
        );
        expect(screen.getByLabelText('Test Checkbox')).toBeDisabled();
    });

    it('calls onChange handler when checkbox is toggled', () => {
        const onChange = vi.fn();

        renderWithFormik(
            <CheckboxInput name="test-checkbox" onChange={onChange}>
                Test Checkbox
            </CheckboxInput>
        );

        const checkbox = screen.getByLabelText('Test Checkbox');
        fireEvent.click(checkbox);

        expect(onChange).toHaveBeenCalled();
    });

    it('sets required attribute when isRequired is true', () => {
        renderWithFormik(
            <CheckboxInput name="test-checkbox" isRequired>
                Test Checkbox
            </CheckboxInput>
        );
        expect(screen.getByLabelText('Test Checkbox')).toHaveAttribute('required');
    });
});
