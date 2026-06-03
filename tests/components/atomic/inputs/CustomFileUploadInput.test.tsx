import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form, Formik } from 'formik';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Yup from 'yup';

import CustomFileUploadInput from '@components/atomic/inputs/CustomFileUploadInput';
import { store } from '@src/store/store';

const renderWithFormik = (ui: React.ReactElement) =>
    render(
        <Provider store={store}>
            <Formik
                initialValues={{ file: '' }}
                validationSchema={Yup.object({
                    file: Yup.mixed().required('This field is required'),
                })}
                onSubmit={() => {}}
            >
                <Form>{ui}</Form>
            </Formik>
        </Provider>
    );

describe('Custom File Upload Input', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders CustomFileUploadInput with label', () => {
        screen.debug();
        renderWithFormik(<CustomFileUploadInput name="file" label="Upload File" />);

        expect(screen.getByText('Upload File')).toBeInTheDocument();
        expect(screen.getByText('Click to Upload')).toBeInTheDocument();
    });

    it('handles file upload correctly', async () => {
        const handleImageChange = vi.fn();
        renderWithFormik(
            <CustomFileUploadInput
                name="file"
                label="Upload File"
                handleImageChange={handleImageChange}
            />
        );

        const file = new File(['dummy content'], 'example.png', {
            type: 'image/png',
        });

        const input = screen.getByRole('button').parentElement?.querySelector('input[type="file"]');

        fireEvent.change(input!, { target: { files: [file] } });

        await waitFor(() => {
            expect(handleImageChange).toHaveBeenCalledWith(expect.any(File));
        });
    });

    it('handles different file types correctly', async () => {
        const handleImageChange = vi.fn();
        renderWithFormik(
            <CustomFileUploadInput
                name="file"
                label="Upload File"
                handleImageChange={handleImageChange}
            />
        );

        const file = new File(['dummy content'], 'example.jpg', {
            type: 'image/jpeg',
        });

        const input = screen.getByRole('button').parentElement?.querySelector('input[type="file"]');

        fireEvent.change(input!, { target: { files: [file] } });

        await waitFor(() => {
            expect(handleImageChange).toHaveBeenCalledWith(expect.any(File));
        });
    });

    it('handles no file selected', async () => {
        const handleImageChange = vi.fn();
        renderWithFormik(
            <CustomFileUploadInput
                name="file"
                label="Upload File"
                handleImageChange={handleImageChange}
            />
        );

        const input = screen.getByRole('button').parentElement?.querySelector('input[type="file"]');

        fireEvent.change(input!, { target: { files: [] } });

        await waitFor(() => {
            expect(handleImageChange).not.toHaveBeenCalled();
        });
    });

    it('enforces required field validation if isRequired is true', async () => {
        renderWithFormik(<CustomFileUploadInput name="file" label="Upload File" isRequired />);

        const formItem = screen.getByTestId('form-item');
        const form = formItem.closest('form');

        if (form) {
            fireEvent.submit(form);

            const errorMessage = await screen.findByText('This field is required');
            expect(errorMessage).toBeInTheDocument();
        } else {
            throw new Error('Form element not found');
        }
        const errorMessage = await screen.findByText('This field is required');
        expect(errorMessage).toBeInTheDocument();
    });
});
