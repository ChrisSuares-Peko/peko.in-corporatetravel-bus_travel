import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { FormikProps } from 'formik';
import { describe, beforeEach, vi, afterEach, expect, test } from 'vitest';

import useHideWidgetOnDrawer from '@components/molecular/freshChat/hooks/useHideWidgetOnDrawer';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

vi.mock('@components/molecular/freshChat/hooks/useHideWidgetOnDrawer', () => ({
    default: vi.fn(),
}));

describe('CustomModalWithForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanup();
    });

    test('should render the modal when open prop is true', () => {
        render(
            <CustomModalWithForm
                open
                handleCancel={() => {}}
                initialValues={{}}
                modalTitle="Test Modal"
                handleFormSubmit={() => {}}
            >
                <div>Content</div>
            </CustomModalWithForm>
        );
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });
    test('should not render the modal when open prop is false', () => {
        render(
            <CustomModalWithForm
                open={false}
                handleCancel={() => {}}
                initialValues={{}}
                modalTitle="Test Modal"
                handleFormSubmit={() => {}}
            >
                <div>Content</div>
            </CustomModalWithForm>
        );
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    test('should call handleFormSubmit when submit button is clicked', () => {
        const handleFormSubmit = vi.fn();
        render(
            <CustomModalWithForm
                open
                handleCancel={() => {}}
                initialValues={{}}
                modalTitle="Test Modal"
                handleFormSubmit={handleFormSubmit}
            >
                <div>Content</div>
            </CustomModalWithForm>
        );
        fireEvent.click(screen.getByText('Submit'));
        waitFor(() => {
            expect(handleFormSubmit).toHaveBeenCalled();
        });
    });

    test('should disable submit button when isDisabled is true', () => {
        render(
            <CustomModalWithForm
                open
                handleCancel={() => {}}
                initialValues={{}}
                modalTitle="Test Modal"
                handleFormSubmit={() => {}}
                isDisabled
            >
                <div>Content</div>
            </CustomModalWithForm>
        );
        expect(screen.getByText('Submit').parentElement).toBeDisabled();
    });

    test('should show loading spinner on submit button when isLoading is true', () => {
        render(
            <CustomModalWithForm
                open
                handleCancel={() => {}}
                initialValues={{}}
                modalTitle="Test Modal"
                handleFormSubmit={() => {}}
                isLoading
            >
                <div>Content</div>
            </CustomModalWithForm>
        );
        expect(screen.getByText('Submit').parentElement).toHaveClass('ant-btn-loading');
    });

    test('should render buttons with custom text', () => {
        render(
            <CustomModalWithForm
                open
                handleCancel={() => {}}
                initialValues={{}}
                modalTitle="Test Modal"
                handleFormSubmit={() => {}}
                firstBtnTxt="Custom Submit"
                secondBtnTxt="Custom Cancel"
            >
                <div>Content</div>
            </CustomModalWithForm>
        );
        expect(screen.getByText('Custom Submit')).toBeInTheDocument();
        expect(screen.getByText('Custom Cancel')).toBeInTheDocument();
    });

    test('should call handleCancel when Cancel button is clicked', () => {
        const handleCancel = vi.fn();
        render(
            <CustomModalWithForm
                open
                handleCancel={handleCancel}
                initialValues={{}}
                modalTitle="Test Modal"
                handleFormSubmit={() => {}}
            >
                <div>Content</div>
            </CustomModalWithForm>
        );
        fireEvent.click(screen.getByText('Cancel'));
        expect(handleCancel).toHaveBeenCalled();
    });

    test('should render children function with formikBag', () => {
        const ChildComponent = (formikBag: FormikProps<any>) => <div>Formik Content</div>;
        render(
            <CustomModalWithForm
                open
                handleCancel={() => {}}
                initialValues={{}}
                modalTitle="Test Modal"
                handleFormSubmit={() => {}}
            >
                {ChildComponent}
            </CustomModalWithForm>
        );
        expect(screen.getByText('Formik Content')).toBeInTheDocument();
    });

    test('should call useHideWidgetOnDrawer with correct arguments', () => {
        render(
            <CustomModalWithForm
                open
                handleCancel={() => {}}
                initialValues={{}}
                modalTitle="Test Modal"
                handleFormSubmit={() => {}}
            >
                <div>Content</div>
            </CustomModalWithForm>
        );
        expect(useHideWidgetOnDrawer).toHaveBeenCalledWith(true);
    });
});
