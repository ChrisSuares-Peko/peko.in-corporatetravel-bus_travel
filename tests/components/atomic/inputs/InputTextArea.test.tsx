import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form, Formik } from 'formik';
import { afterEach, describe, expect, it, vi } from 'vitest';

import InputTextArea from '@components/atomic/inputs/InputTextArea';

const renderWithFormik = (ui: React.ReactElement) =>
    render(
        <Formik initialValues={{}} onSubmit={() => {}}>
            {() => ui}
        </Formik>
    );

describe('input text area', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders component with default props', () => {
        renderWithFormik(<InputTextArea name="testField" placeholder="Type here" />);

        expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders correctly with required props', () => {
        renderWithFormik(
            <>
                <InputTextArea
                    name="description"
                    label="Description"
                    placeholder="Enter Description"
                    isRequired
                    maxLength={700}
                />
                <InputTextArea
                    name="offerings"
                    label="Offerings"
                    placeholder="Enter Offerings"
                    isRequired
                    maxLength={200}
                />
            </>
        );

        const descriptionInput = screen.getByPlaceholderText('Enter Description');
        const offeringsInput = screen.getByPlaceholderText('Enter Offerings');

        // Ensure label text is present and associated with input by checking `id`
        expect(descriptionInput).toHaveAttribute('id', 'description');
        expect(offeringsInput).toHaveAttribute('id', 'offerings');

        // Check input attributes
        expect(descriptionInput).toHaveAttribute('maxLength', '700');
        expect(offeringsInput).toHaveAttribute('maxLength', '200');
    });

    it('shows tooltip when showToolTip is true', async () => {
        renderWithFormik(
            <InputTextArea
                name="description"
                label="Description"
                placeholder="Enter Description"
                showToolTip
                tooltipText="Tooltip Text"
            />
        );

        const tooltipIcon = screen.getByRole('img', { name: 'info-circle' });

        fireEvent.mouseOver(tooltipIcon);

        await waitFor(() => {
            const tooltip = document.querySelector('.ant-tooltip-inner'); // Class name might need adjustment
            expect(tooltip).toBeInTheDocument();
            expect(tooltip).toHaveTextContent('Tooltip Text');
        });
    });
    it('disables the input when isDisabled is true', () => {
        renderWithFormik(
            <InputTextArea
                name="description"
                label="Description"
                placeholder="Enter Description"
                isDisabled
            />
        );

        const input = screen.getByPlaceholderText('Enter Description') as HTMLTextAreaElement;
        expect(input).toBeDisabled();
    });

    it('handles autoSize prop', () => {
        renderWithFormik(
            <InputTextArea
                name="testField"
                placeholder="Type here"
                autoSize={{ minRows: 3, maxRows: 5 }}
            />
        );

        // Verify autoSize prop
        const textArea = screen.getByRole('textbox');
        fireEvent.change(textArea, { target: { value: 'A'.repeat(10000) } });
        // screen.debug()
        expect(textArea).toHaveAttribute(
            'style',
            'resize: none; height: -30px; min-height: -14px; max-height: -30px;'
        );
    });
    it('shows validation errors correctly', async () => {
        const validate = (values: { testField: string }) => {
            const errors: { testField?: string } = {};
            if (!values.testField) {
                errors.testField = 'This is an error message';
            }
            return errors;
        };
        render(
            <Formik initialValues={{ testField: '' }} validate={validate} onSubmit={vi.fn()}>
                <Form>
                    <InputTextArea
                        name="testField"
                        placeholder="Type here"
                        label="Test Label"
                        isRequired
                    />
                </Form>
            </Formik>
        );

        const input = screen.getByPlaceholderText(/Type here/i) as HTMLTextAreaElement;
        fireEvent.blur(input);
        // Wait for the error message to appear
        const errorMessage = await screen.findByText('This is an error message');
        expect(errorMessage).toBeInTheDocument();
    });

    it('validates required field', async () => {
        renderWithFormik(
            <InputTextArea name="testField" label="Test Label" placeholder="Type here" isRequired />
        );

        const requiredLabel = screen.getByText('Test Label');
        screen.debug();
        expect(requiredLabel).toBeInTheDocument();
        expect(requiredLabel.parentElement).toHaveClass('ant-form-item-required');
    });
});
