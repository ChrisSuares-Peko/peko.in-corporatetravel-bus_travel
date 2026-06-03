import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Formik } from 'formik';
import { test, expect, vi, describe, afterEach, beforeEach } from 'vitest';

import BulkUploadModal from '@components/molecular/modals/BulkUploadModal';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

const mockHandleBulkUpload = vi.fn();
const mockHandleCancel = vi.fn();
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

const renderComponent = () =>
    render(
        <Formik initialValues={{ file: null }} onSubmit={() => {}}>
            <BulkUploadModal
                open
                handleCancel={mockHandleCancel}
                handleBulkUpload={mockHandleBulkUpload}
            />
        </Formik>
    );

describe('BulkUploadModal', () => {
    const mockDispatch = vi.fn();
    beforeEach(() => {
        (useAppDispatch as any).mockReturnValue(mockDispatch);

        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });
    test('should successfully upload a valid file and display its name', async () => {
        renderComponent();
        screen.debug();
        const file = new File(['dummy content'], 'example.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const uploadButton = screen.getByRole('button', { name: /Upload New/i });

        const input = uploadButton.closest('div')?.querySelector('input[type="file"]');
        fireEvent.change(input!, { target: { files: [file] } });

        await waitFor(() => expect(screen.getByText('example.xlsx')).toBeInTheDocument());

        expect(showToast).toHaveBeenCalledWith({
            description: 'File uploaded successfully',
            variant: 'success',
        });
    });

    test('should show error when uploading an invalid file type', async () => {
        renderComponent();

        const invalidFile = new File(['dummy content'], 'example.txt', { type: 'text/plain' });

        const uploadButton = screen.getByRole('button', { name: /Upload New/i });

        // Find the input element within the same container as the button
        const input = uploadButton.closest('div')?.querySelector('input[type="file"]');
        fireEvent.change(input!, { target: { files: [invalidFile] } });

        expect(showToast).toHaveBeenCalledWith({
            description: 'Please upload a file in Excel format.',
            variant: 'error',
        });
        expect(screen.queryByText('example.txt')).not.toBeInTheDocument();
    });

    test('should show error when uploading a file larger than the allowed size', async () => {
        renderComponent();

        const largeFile = new File(['dummy content'], 'example.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        Object.defineProperty(largeFile, 'size', { value: 300 * 1024 }); // 300 KB

        const uploadButton = screen.getByRole('button', { name: /Upload New/i });

        // Find the input element within the same container as the button
        const input = uploadButton.closest('div')?.querySelector('input[type="file"]');
        fireEvent.change(input!, { target: { files: [largeFile] } });

        expect(showToast).toHaveBeenCalledWith({
            description: 'file size should be smaller than 200 KB',
            variant: 'error',
        });
        expect(screen.queryByText('example.xlsx')).not.toBeInTheDocument();
    });

    test('should submit the form with a valid file', async () => {
        renderComponent();

        const file = new File(['dummy content'], 'example.xlsx', {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        const uploadButton = screen.getByRole('button', { name: /Upload New/i });

        // Find the input element within the same container as the button
        const input = uploadButton
            .closest('div')
            ?.querySelector('input[type="file"]') as HTMLInputElement;

        fireEvent.change(input, { target: { files: [file] } });

        // Optional: add a delay to simulate async file upload process if necessary
        await waitFor(() => expect(input.files![0]).toEqual(file));
        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockHandleBulkUpload).toHaveBeenCalledWith(file);
            expect(mockHandleCancel).toHaveBeenCalled();
        });
    });
    test('should show validation error when submitting without a file', async () => {
        renderComponent();

        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Please upload a file in excel format')).toBeInTheDocument();
            expect(mockHandleBulkUpload).not.toHaveBeenCalled();
        });
    });

    test('should call handleCancel when Cancel button is clicked', () => {
        renderComponent();

        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);

        expect(mockHandleCancel).toHaveBeenCalled();
    });

    test('should call handleTemplateDownload when Download Excel Template button is clicked', () => {
        const mockHandleTemplateDownload = vi.fn();

        render(
            <Formik initialValues={{ file: null }} onSubmit={() => {}}>
                <BulkUploadModal
                    open
                    handleCancel={mockHandleCancel}
                    handleBulkUpload={mockHandleBulkUpload}
                    handleTemplateDownload={mockHandleTemplateDownload}
                />
            </Formik>
        );

        const downloadButton = screen.getByText(/Download Excel Template/i);
        fireEvent.click(downloadButton);

        expect(mockHandleTemplateDownload).toHaveBeenCalled();
    });
});
