import React from 'react';

import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { Formik, Form } from 'formik';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import SelectInput from '@components/atomic/inputs/SelectInput';

// Mock options
const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
];

describe('SelectInput Component', () => {
    beforeEach(() => {
        cleanup();
    });
    const initialValues = { testSelect: '' };

    const renderComponent = (props = {}) =>
        render(
            <Formik initialValues={initialValues} onSubmit={vi.fn()}>
                <Form>
                    <SelectInput
                        name="testSelect"
                        label="Test Select"
                        placeholder="Select an option"
                        options={options}
                        showSearch
                        {...props}
                    />
                </Form>
            </Formik>
        );

    it('renders without crashing', () => {
        renderComponent();
        const selectElement = screen.getByText('Select an option');
        expect(selectElement).toBeInTheDocument();
    });

    it('displays label correctly', () => {
        renderComponent();

        const labelElement = screen.queryByText('Test Select');

        expect(labelElement).toBeInTheDocument();
    });

    it('renders all options provided', () => {
        renderComponent();
        fireEvent.mouseDown(screen.getByText('Select an option'));
        const option1 = screen.getByText('Option 1');
        const option2 = screen.getByText('Option 2');
        const option3 = screen.getByText('Option 3');

        expect(option1).toBeInTheDocument();
        expect(option2).toBeInTheDocument();
        expect(option3).toBeInTheDocument();
    });

    it('calls handleChange on selection change', () => {
        const handleChangeMock = vi.fn();
        renderComponent({ handleChange: handleChangeMock });
        fireEvent.mouseDown(screen.getByText('Select an option'));
        fireEvent.click(screen.getByText('Option 1'));
        expect(handleChangeMock).toHaveBeenCalledWith('option1');
    });

    it('sets the field value correctly', () => {
        renderComponent();
        fireEvent.mouseDown(screen.getByText('Select an option'));
        const optionElement = screen.getByRole('option', { name: 'Option 2' });
        fireEvent.click(optionElement);

        expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('displays error message when validation fails', async () => {
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
                    <SelectInput
                        name="testSelect"
                        label="Test Select"
                        placeholder="Select an option"
                        options={options}
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

    it('renders with a tooltip when showToolTip is true', async () => {
        renderComponent({
            showToolTip: true,
            tooltipText: 'This is a tooltip',
        });

        fireEvent.mouseOver(screen.getByLabelText('info-circle'));

        await waitFor(() => {
            expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
        });
    });

    it('supports search functionality', async () => {
        renderComponent({ showSearch: true });
        fireEvent.click(screen.getByRole('combobox'));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'option1' } });
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });
});
