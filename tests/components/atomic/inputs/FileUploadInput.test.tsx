import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useFormikContext } from 'formik';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import { showToast } from '@src/slices/apiSlice';

// Mock Formik
vi.mock('formik', () => ({
    useFormikContext: vi.fn(),
}));

// Mock Redux store
const mockStore = configureStore([]);
let store: ReturnType<typeof mockStore>;
describe('FileUploadInput', () => {
    beforeEach(() => {
        store = mockStore({});
        vi.spyOn(store, 'dispatch');
    });
    afterEach(() => {
        cleanup();
    });

    it('renders the component and displays the label and description', () => {
        (useFormikContext as Mock).mockReturnValue({
            setFieldValue: vi.fn(),
            errors: {},
            touched: {},
            validateField: vi.fn(),
            values: {},
        });
        render(
            <Provider store={store}>
                <FileUploadInput
                    name="file"
                    label="Upload File"
                    descriptionText="Upload a valid image file."
                />
            </Provider>
        );
        expect(screen.getByText('Upload File')).toBeInTheDocument();
        expect(screen.getByText('Upload a valid image file.')).toBeInTheDocument();
    });

    it('uploads a valid file and sets field value', async () => {
        const mockSetFieldValue = vi.fn();
        (useFormikContext as Mock).mockReturnValue({
            setFieldValue: mockSetFieldValue,
            errors: {},
            touched: {},
            validateField: vi.fn(),
            values: {},
        });

        render(
            <Provider store={store}>
                <FileUploadInput
                    name="file"
                    allowedFileTypes={['image/jpeg']}
                    showNotification
                    format="jpeg"
                />
            </Provider>
        );

        const file = new File(['dummy content'], 'example.jpg', { type: 'image/jpeg' });
        const inputNode = screen.getByRole('button', { name: /click to upload/i })
            .previousSibling as HTMLInputElement;

        // Simulate file upload
        fireEvent.change(inputNode, { target: { files: [file] } });

        // Add debug logging
        await waitFor(() => {
            expect(mockSetFieldValue).toHaveBeenNthCalledWith(1, 'file', expect.any(String)); // Check for base64 string
            expect(mockSetFieldValue).toHaveBeenNthCalledWith(2, 'jpeg', 'jpeg');
            expect(store.dispatch).toHaveBeenCalledWith(
                showToast({
                    description: 'File uploaded successfully',
                    variant: 'success',
                })
            );
        });
    });

    it('shows an error for a file size exceeding the limit', async () => {
        const mockDispatch = vi.fn();
        (store.dispatch as Mock).mockImplementation(mockDispatch);

        // Mock useFormikContext
        const mockSetFieldValue = vi.fn();
        (useFormikContext as Mock).mockReturnValue({
            setFieldValue: mockSetFieldValue,
            errors: {},
            touched: {},
            validateField: vi.fn(),
            values: {},
        });

        render(
            <Provider store={store}>
                <FileUploadInput
                    name="file"
                    maxFileSize={1} // 1 KB for testing
                    showNotification
                />
            </Provider>
        );

        // Create a file that exceeds the size limit
        const content = 'A'.repeat(2 * 1024); // 2 KB content
        const file = new File([content], 'example.jpg', { type: 'image/jpeg' });
        // Get the file input element
        const inputNode = screen.getByRole('button', { name: /click to upload/i })
            .previousSibling as HTMLInputElement;

        // Trigger file selection
        fireEvent.change(inputNode, { target: { files: [file] } });

        // Check dispatch call
        await waitFor(() => {
            // Check the actual arguments passed to the dispatch call
            expect(mockDispatch).toHaveBeenCalledWith(
                showToast({
                    description: 'File size must be smaller than 1 KB',
                    variant: 'error',
                })
            );
        });
    });

    it('displays the file name if showFileName is true', async () => {
        const mockSetFieldValue = vi.fn();
        (useFormikContext as Mock).mockReturnValue({
            setFieldValue: mockSetFieldValue,
            errors: {},
            touched: {},
            validateField: vi.fn(),
            values: {},
        });

        render(
            <Provider store={store}>
                <FileUploadInput name="file" showFileName />
            </Provider>
        );

        const file = new File(['dummy content'], 'example.jpg', { type: 'image/jpeg' });
        const inputNode = screen.getByRole('button', { name: /click to upload/i })
            .previousSibling as HTMLInputElement;

        fireEvent.change(inputNode, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText('example.jpg')).toBeInTheDocument();
        });
    });

    it('shows a success notification for a successful file upload', async () => {
        // Mock functions
        const mockSetFieldValue = vi.fn();
        const mockSetFile = vi.fn();
        const mockDispatch = vi.fn();

        // Mock useFormikContext
        (useFormikContext as Mock).mockReturnValue({
            setFieldValue: mockSetFieldValue,
            errors: {},
            touched: {},
            validateField: vi.fn(),
            values: {},
        });

        // Mock dispatch
        store.dispatch = mockDispatch;

        render(
            <Provider store={store}>
                <FileUploadInput
                    name="file"
                    format="format"
                    showNotification
                    setFile={mockSetFile}
                />
            </Provider>
        );

        // Create a file for testing
        const file = new File(['dummy content'], 'example.jpg', { type: 'image/jpeg' });

        // Get the file input element
        const inputNode = screen.getByRole('button', { name: /click to upload/i })
            .previousSibling as HTMLInputElement;

        // Trigger file selection
        fireEvent.change(inputNode, { target: { files: [file] } });

        await waitFor(() => {
            // Check if setFile was called
            expect(mockSetFile).toHaveBeenCalledWith(expect.any(String));

            // Check if setFieldValue was called for the base64 string and format
            expect(mockSetFieldValue).toHaveBeenCalledWith('file', expect.any(String));
            expect(mockSetFieldValue).toHaveBeenCalledWith('format', 'jpeg');

            // Check if dispatch was called with the success message
            expect(mockDispatch).toHaveBeenCalledWith(
                showToast({
                    description: 'File uploaded successfully',
                    variant: 'success',
                })
            );
        });
    });
    it('displays an error message when an invalid file type is uploaded', async () => {
        const mockSetFieldValue = vi.fn();
        const mockSetFile = vi.fn();
        const mockDispatch = vi.fn();

        // Mock dispatch in the store
        store.dispatch = mockDispatch;

        // Mock useFormikContext
        (useFormikContext as Mock).mockReturnValue({
            setFieldValue: mockSetFieldValue,
            errors: {},
            touched: {},
            validateField: vi.fn(),
            values: {},
        });

        render(
            <Provider store={store}>
                <FileUploadInput
                    name="file"
                    allowedFileTypes={['image/jpeg']}
                    showNotification
                    setFile={mockSetFile}
                />
            </Provider>
        );

        const uploadInput = screen.getByRole('button', { name: /click to upload/i })
            .previousSibling as HTMLInputElement;

        fireEvent.change(uploadInput, {
            target: {
                files: [new File(['dummy content'], 'example.txt', { type: 'text/plain' })],
            },
        });

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                showToast({
                    description: 'Please upload  JPEG file.',
                    variant: 'error',
                })
            );
        });
    });
});
