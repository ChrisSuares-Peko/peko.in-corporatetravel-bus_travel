import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Form, Formik, FormikValues } from 'formik';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as Yup from 'yup';

import TextAreaInput from '@components/atomic/inputs/TextAreaInput';

// Helper function to render with Formik
const renderWithFormik = (
    ui: React.ReactElement,
    {
        initialValues = {},
        onSubmit = vi.fn(),
    }: {
        initialValues?: FormikValues;
        onSubmit?: (values: FormikValues) => void;
    } = {}
) =>
    render(
        <Formik initialValues={initialValues} onSubmit={onSubmit}>
            {() => ui}
        </Formik>
    );

describe('text input Component', () => {
    beforeEach(() => {
        cleanup();
    });

    it('renders the TextAreaInput component', () => {
        renderWithFormik(
            <TextAreaInput name="testArea" label="Test Label" placeholder="Enter text" />
        );

        expect(screen.getByText(/Test Label/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter text/i)).toBeInTheDocument();
    });

    it('displays validation error when input is invalid', async () => {
        const validationSchema = Yup.object({
            testArea: Yup.string().required('Error message'),
        });

        render(
            <Formik
                initialValues={{ testArea: '' }}
                validationSchema={validationSchema}
                onSubmit={vi.fn()}
            >
                <Form>
                    <TextAreaInput
                        name="testArea"
                        label="Test Label"
                        placeholder="Enter text"
                        isRequired
                    />
                </Form>
            </Formik>
        );

        const input = screen.getByPlaceholderText(/Enter text/i) as HTMLTextAreaElement;
        fireEvent.blur(input);

        // Wait for the error message to appear
        const errorMessage = await screen.findByText(/Error message/i);
        expect(errorMessage).toBeInTheDocument();
    });

    it('does not display validation error when input is valid', async () => {
        renderWithFormik(
            <Form>
                <TextAreaInput name="testArea" label="Test Label" placeholder="Enter text" />
            </Form>,
            {
                initialValues: { testArea: 'Valid text' },
            }
        );

        const errorMessage = screen.queryByText(/Error message/i);
        expect(errorMessage).not.toBeInTheDocument();
    });

    it('disables TextArea when isDisabled is true', () => {
        renderWithFormik(
            <TextAreaInput name="testArea" label="Test Label" placeholder="Enter text" isDisabled />
        );

        const input = screen.getByPlaceholderText(/Enter text/i) as HTMLTextAreaElement;
        expect(input).toBeDisabled();
    });

    it('applies required validation when isRequired is true', () => {
        renderWithFormik(
            <TextAreaInput name="testArea" label="Test Label" placeholder="Enter text" isRequired />
        );

        const requiredLabel = screen.getByText(/Test Label/i);
        expect(requiredLabel).toBeInTheDocument();
        expect(requiredLabel).toHaveClass('ant-form-item-required');
    });

    it('renders with custom size', () => {
        renderWithFormik(
            <TextAreaInput
                name="testArea"
                label="Test Label"
                placeholder="Enter text"
                size="large"
            />
        );

        const input = screen.getByPlaceholderText(/Enter text/i) as HTMLTextAreaElement;
        expect(input).toHaveClass('ant-input-lg'); // Adjust based on Ant Design class names for different sizes
    });
});
