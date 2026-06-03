import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch'; // Adjust import path if needed

const renderWithFormik = (ui: React.ReactElement) =>
    render(
        <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
            <Form>{ui}</Form>
        </Formik>
    );

describe('SelectInputWithSearch Component', () => {
    beforeEach(() => {
        cleanup();
    });
    it('renders with provided props', () => {
        renderWithFormik(
            <SelectInputWithSearch
                name="testField"
                label="Test Label"
                placeholder="Select an option"
                options={[{ label: 'Option 1', value: '1' }]}
            />
        );

        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('displays tooltip if showToolTip is true', async () => {
        renderWithFormik(
            <SelectInputWithSearch
                name="testField"
                label="Test Label"
                placeholder="Select an option"
                showToolTip
                tooltipText="Tooltip text"
                options={[{ label: 'Option 1', value: '1' }]}
            />
        );

        fireEvent.mouseOver(screen.getByLabelText('info-circle'));

        await waitFor(() => {
            expect(screen.getByText('Tooltip text')).toBeInTheDocument();
        });
    });

    it('displays required field indicator if isRequired is true', async () => {
        renderWithFormik(
            <SelectInputWithSearch
                name="testField"
                label="Test Label"
                placeholder="Select an option"
                showToolTip
                tooltipText="Tooltip text"
                options={[{ label: 'Option 1', value: '1' }]}
                isRequired
            />
        );
        const requiredLabel = screen.getByText('Test Label');

        // Assert that the label is in the document
        expect(requiredLabel).toBeInTheDocument();

        // Assert that the label has the required class
        expect(requiredLabel.parentElement).toHaveClass('ant-form-item-required');
    });

    it('displays validation error', async () => {
        const validate = (values: { testField: string }) => {
            const errors: { testField?: string } = {};
            if (!values.testField) {
                errors.testField = 'This is an error message';
            }
            return errors;
        };
        render(
            <Formik
                initialValues={{ testField: '' }}
                validate={validate} // Here is where the validate function is added
                onSubmit={vi.fn()}
            >
                <Form>
                    <SelectInputWithSearch
                        name="testField"
                        label="Test Select"
                        isRequired
                        placeholder="Select an option"
                        options={[{ label: 'Option 1', value: '1' }]}
                    />
                    <button name="submit" type="submit">
                        Submit
                    </button>
                </Form>
            </Formik>
        );

        screen.debug();
        fireEvent.click(screen.getByText('Submit'));
        const errorMessage = await screen.findByText('This is an error message');
        expect(errorMessage).toBeInTheDocument();
    });

    it('handles selection and triggers handleChange', () => {
        const handleChange = vi.fn();
        renderWithFormik(
            <SelectInputWithSearch
                name="testField"
                placeholder="Select an option"
                options={[
                    { label: 'Option 1', value: '1' },
                    { label: 'Option 2', value: '2' },
                ]}
                handleChange={handleChange}
            />
        );

        fireEvent.mouseDown(screen.getByRole('combobox'));

        fireEvent.click(screen.getByText('Option 1'));

        expect(handleChange).toHaveBeenCalledWith('1');
    });

    it('disables the select input when isDisabled is true', () => {
        renderWithFormik(
            <SelectInputWithSearch
                name="testField"
                placeholder="Select an option"
                isDisabled
                options={[{ label: 'Option 1', value: '1' }]}
            />
        );

        expect(screen.getByRole('combobox')).toBeDisabled();
    });

    it('searches options correctly', async () => {
        renderWithFormik(
            <SelectInputWithSearch
                name="testField"
                placeholder="Select an option"
                options={[
                    { label: 'Option 1', value: '1' },
                    { label: 'Option 2', value: '2' },
                ]}
            />
        );

        fireEvent.click(screen.getByRole('combobox'));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Option 1' } });
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('handles deselecting if allowClear is true', () => {
        renderWithFormik(
            <SelectInputWithSearch
                name="testField"
                placeholder="Select an option"
                disableDeselect={false}
                options={[{ label: 'Option 1', value: '1' }]}
            />
        );

        fireEvent.click(screen.getByRole('combobox'));
        screen.debug();
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Option 1' } });
        fireEvent.click(screen.getByText('Option 1'));
        expect(screen.getByRole('combobox')).toHaveValue('');
    });
});
