import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { describe, test, expect, vi, beforeEach } from 'vitest';

import MultiTextInput from '@components/atomic/inputs/MultiTextInput';

describe('MultiTextInput', () => {
    beforeEach(() => {
        cleanup();
    });
    const renderWithFormik = (ui: React.ReactElement) =>
        render(
            <Formik initialValues={{ testField: [] }} onSubmit={() => {}}>
                <Form>{ui}</Form>
            </Formik>
        );

    test('renders correctly with props', async () => {
        renderWithFormik(
            <MultiTextInput
                name="testField"
                label="Test Label"
                placeholder="Enter text"
                type="text"
                size="large"
                isDisabled={false}
                isRequired
                classes="test-class"
                formItemClass="form-item-class"
                showToolTip
                tooltipText="This is a tooltip"
                maxLength={10}
                minLength={2}
                allowNumbersOnly
                allowDecimalsOnly={false}
            />
        );

        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
        fireEvent.mouseOver(screen.getByLabelText('info-circle'));

        await waitFor(() => {
            expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
        });
    });

    test('displays tooltip when showToolTip is true', async () => {
        renderWithFormik(
            <MultiTextInput
                name="testField"
                label="Test Label"
                showToolTip
                tooltipText="Tooltip Text"
                type="text"
            />
        );
        fireEvent.mouseOver(screen.getByLabelText('info-circle'));

        await waitFor(() => {
            expect(screen.getByText('Tooltip Text')).toBeInTheDocument();
        });
    });

    test('handles input change with numbers only filter', () => {
        renderWithFormik(
            <MultiTextInput
                name="testField"
                placeholder="Enter text"
                allowNumbersOnly
                type="text"
            />
        );
        screen.debug();

        const input = screen.getByPlaceholderText('Enter text');
        fireEvent.change(input, { target: { value: '123abc' } });

        expect(input).toHaveValue('123');
    });

    test('handles input change with decimals only filter', () => {
        renderWithFormik(
            <MultiTextInput
                name="testField"
                placeholder="Enter text"
                allowDecimalsOnly
                type="text"
            />
        );

        const input = screen.getByPlaceholderText('Enter text');
        fireEvent.change(input, { target: { value: '123.45.67' } });

        expect(input).toHaveValue('123.45');
    });

    test('disables input field when isDisabled is true', () => {
        const { container } = renderWithFormik(
            <MultiTextInput name="testField" isDisabled type="text" />
        );
        screen.debug();
        const inputElement = container.querySelector('.ant-input');
        expect(inputElement).toHaveClass('ant-input-disabled');
        expect(inputElement).toBeDisabled();
        expect(inputElement).toHaveAttribute('disabled');
        // if (inputElement) {
        //     fireEvent.change(inputElement, { target: { value: 'test' } });
        //     expect(inputElement).toHaveValue('');
        // }
    });

    test('validates required field', async () => {
        renderWithFormik(
            <MultiTextInput name="testField" label="Test Label" isRequired type="text" />
        );
        const requiredLabel = screen.getByText('Test Label');
        // Adjust text as needed
        expect(requiredLabel).toBeInTheDocument();
        expect(requiredLabel).toHaveClass('ant-form-item-required');
    });
    const validate = (values: { testField: string }) => {
        const errors: { testField?: string } = {};
        if (!values.testField) {
            errors.testField = 'This is an error message';
        }
        return errors;
    };
    test('renders error message when errors object has an error for the field', async () => {
        render(
            <Formik
                initialValues={{ testField: '' }}
                validate={validate} // Here is where the validate function is added
                onSubmit={vi.fn()}
            >
                {({ errors }) => (
                    <Form>
                        <MultiTextInput
                            name="testField"
                            label="Test Field"
                            type="text"
                            isDisabled={false}
                            isRequired
                        />
                        <button type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        );

        fireEvent.click(screen.getByText('Submit'));

        const errorMessage = await screen.findByText('This is an error message');
        expect(errorMessage).toBeInTheDocument();
    });
});
