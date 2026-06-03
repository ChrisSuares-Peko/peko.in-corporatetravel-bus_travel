import React from 'react';

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form, Formik } from 'formik';
import { describe, afterEach, it, expect, vi } from 'vitest';
// import * as Yup from 'yup';

import MultiSelectInput from '@components/atomic/inputs/MultiSelectInput';

const renderWithFormik = (ui: React.ReactElement, initialErrors: Record<string, any> = {}) =>
    render(
        <Formik
            initialValues={{ testSelect: [] }}
            initialErrors={initialErrors}
            onSubmit={() => {}}
            validateOnChange={false}
        >
            <Form>{ui}</Form>
        </Formik>
    );

const mockOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
];

describe('DatePickerInput', () => {
    afterEach(() => {
        cleanup();
    });
    const initialValues = { testSelect: '' };
    it('renders with label and placeholder', () => {
        renderWithFormik(
            <MultiSelectInput
                name="testSelect"
                label="Test Label"
                placeholder="Select options"
                options={mockOptions}
            />
        );

        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('Select options')).toBeInTheDocument();
    });

    it('allows selecting multiple options', () => {
        renderWithFormik(
            <MultiSelectInput
                name="testSelect"
                placeholder="Select options"
                options={mockOptions}
            />,
            { testSelect: [] }
        );

        const selectInput = screen.getByText('Select options');
        fireEvent.mouseDown(selectInput);

        const option1 = screen.getByText('Option 1');
        const option2 = screen.getByText('Option 2');
        fireEvent.click(option1);
        fireEvent.click(option2);

        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('shows tooltip when showToolTip is true', async () => {
        renderWithFormik(
            <MultiSelectInput
                name="testSelect"
                label="Test Label"
                placeholder="Select options"
                options={mockOptions}
                showToolTip
                tooltipText="This is a tooltip"
            />
        );

        fireEvent.mouseOver(screen.getByLabelText('info-circle'));

        await waitFor(() => {
            expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
        });
    });

    it('disables the select input when isDisabled is true', () => {
        const { container } = renderWithFormik(
            <MultiSelectInput
                name="testSelect"
                placeholder="Select options"
                options={mockOptions}
                isDisabled
            />
        );

        const selectContainer = container.querySelector('.ant-select');
        expect(selectContainer).toHaveClass('ant-select-disabled');

        // Check if the input field inside the select is disabled
        const inputField = container.querySelector('.ant-select-selection-search-input');
        expect(inputField).toBeDisabled();

        if (selectContainer) {
            fireEvent.mouseDown(selectContainer);
        }
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('respects maxCount prop for maximum selectable options', async () => {
        renderWithFormik(
            <MultiSelectInput
                name="testSelect"
                placeholder="Select options"
                options={mockOptions}
                maxCount={2}
            />
        );

        const selectInput = screen.getByText('Select options');
        fireEvent.mouseDown(selectInput);

        const option1 = screen.getByTitle('Option 1');
        const option2 = screen.getByTitle('Option 2');
        const option3 = screen.getByTitle('Option 3');

        fireEvent.click(option1);
        fireEvent.click(option2);

        // Check if Option 1 and Option 2 are selected
        expect(option1).toHaveAttribute('aria-selected', 'true');
        expect(option2).toHaveAttribute('aria-selected', 'true');

        // Check if Option 3 is not selected
        expect(option3).toHaveAttribute('aria-selected', 'false');

        // Attempt to select the third option
        fireEvent.click(option3);

        // Ensure Option 3 remains unselected and verify it is disabled or not interactable
        expect(option3).toHaveAttribute('aria-selected', 'false');

        expect(screen.queryByText('Option 3')).toBeInTheDocument();
    });

    it('renders correct error state when form validation fails', async () => {
        const validate = (values: { testSelect: string }) => {
            const errors: { testSelect?: string } = {};
            if (!values.testSelect) {
                errors.testSelect = 'This field is required';
            }
            return errors;
        };
        render(
            <Formik initialValues={initialValues} validate={validate} onSubmit={vi.fn()}>
                <Form>
                    <MultiSelectInput
                        name="testSelect"
                        placeholder="Select options"
                        options={mockOptions}
                        isRequired
                    />
                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        );
        screen.debug();

        fireEvent.click(screen.getByText('Submit'));

        // Verify that the error message is displayed
        const errorMessage = await screen.findByText('This field is required');
        expect(errorMessage).toBeInTheDocument();
    });
});
