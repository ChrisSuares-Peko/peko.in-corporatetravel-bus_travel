import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form, Formik } from 'formik';
import { Provider } from 'react-redux';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Yup from 'yup';

import DocumentUploadInput from '@components/atomic/inputs/DocumentUploadInput';
import { store } from '@store/store';

describe('DocumentUploadInput Component', () => {
    beforeEach(() => {
        cleanup();
    });
    const initialValues = { testField: '' };
    const renderWithFormik = (props = {}) => {
        render(
            <Provider store={store}>
                <Formik
                    initialValues={initialValues}
                    validationSchema={Yup.object({
                        file: Yup.mixed().required('This field is required'),
                    })}
                    onSubmit={vi.fn()}
                >
                    <Form data-testid="form">
                        <DocumentUploadInput
                            name="testField"
                            label="Test Label"
                            isrequired
                            {...props}
                        />
                    </Form>
                </Formik>
            </Provider>
        );
    };
    it('renders without crashing', () => {
        renderWithFormik();
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('Click to upload')).toBeInTheDocument();
    });

    it('handles file upload correctly', () => {
        renderWithFormik();
        const inputElement = screen
            .getByRole('button', { name: /click to upload/i })
            .parentNode?.querySelector('input[type="file"]') as HTMLInputElement;
        // Check that the input element exists
        expect(inputElement).toBeInTheDocument();
        // Simulate file upload by triggering a change event on the input element
        const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
        fireEvent.change(inputElement, { target: { files: [file] } });

        expect(inputElement.files?.[0]).toEqual(file);
    });

    it('displays file name after upload', async () => {
        renderWithFormik({ showFileName: true });

        const fileName = 'test.pdf';
        const inputElement = screen
            .getByRole('button', { name: /click to upload/i })
            .parentNode?.querySelector('input[type="file"]') as HTMLInputElement;

        // Ensure the input element exists
        expect(inputElement).toBeInTheDocument();

        // Create a file object to simulate the upload
        const file = new File(['test'], fileName, { type: 'application/pdf' });

        // Simulate the change event on the input element
        fireEvent.change(inputElement, {
            target: { files: [file] },
        });

        // Wait for the file name to appear in the document
        await waitFor(() => {
            expect(screen.getByText(fileName)).toBeInTheDocument();
        });
    });

    it('validates required field', async () => {
        renderWithFormik();

        // Check label presence and class
        const requiredLabel = screen.getByText('Test Label');
        expect(requiredLabel).toBeInTheDocument();
        expect(requiredLabel).toHaveClass('ant-form-item-required');
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
            <Provider store={store}>
                <Formik
                    initialValues={{ testField: '' }}
                    validate={validate} // Here is where the validate function is added
                    onSubmit={vi.fn()}
                >
                    <Form>
                        <DocumentUploadInput name="testField" label="Test Label" isrequired />
                        <button name="submit" type="submit">
                            Submit
                        </button>
                    </Form>
                </Formik>
            </Provider>
        );

        screen.debug();
        fireEvent.click(screen.getByText('Submit'));
        const errorMessage = await screen.findByText('This is an error message');
        expect(errorMessage).toBeInTheDocument();
    });
});
