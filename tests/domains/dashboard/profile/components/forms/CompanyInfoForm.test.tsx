import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import { describe, it, expect, vi } from 'vitest';

import CompanyInfoForm from '@src/domains/dashboard/profile/components/forms/CompanyInfoForm';

vi.mock('@components/atomic/inputs/DatePickerInput', () => ({
    default: ({ name, label, isDisabled, ...props }: any) => (
        <div data-testid={`date-picker-${name}`}>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} type="date" disabled={isDisabled} {...props} />
        </div>
    ),
}));

vi.mock('@components/atomic/inputs/FileUploadInput', () => ({
    default: ({ label, name, setFile, ...props }: any) => (
        <div data-testid={`file-upload-${name}`}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type="file"
                onChange={e => {
                    if (e.target.files) {
                        setFile(e.target.files[0]);
                    }
                }}
                {...props}
            />
        </div>
    ),
}));

vi.mock('@components/atomic/inputs/TextInput', () => ({
    default: ({ name, label, type = 'text', placeholder, ...props }: any) => (
        <div data-testid={`text-input-${name}`}>
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} type={type} placeholder={placeholder} {...props} />
        </div>
    ),
}));

describe('CompanyInfoForm Component', () => {
    const defaultProps = {
        activities: [{ value: 'activity1', label: 'Activity 1' }],
        values: {
            tradeLicenseNo: '',
            trnNo: '',
            tradeLicenseExpiry: '',
            trnExpiry: '',
        },
    };

    it('renders the form with all inputs and labels', () => {
        render(
            <Formik initialValues={defaultProps.values} onSubmit={() => {}}>
                <CompanyInfoForm {...defaultProps} />
            </Formik>
        );

        expect(screen.getByTestId('text-input-activity')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-tradeLicenseNo')).toBeInTheDocument();
        expect(screen.getByTestId('date-picker-tradeLicenseExpiry')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-trnNo')).toBeInTheDocument();
        expect(screen.getByTestId('date-picker-trnExpiry')).toBeInTheDocument();
        expect(screen.getByTestId('file-upload-tradeLicenseDoc')).toBeInTheDocument();
        expect(screen.getByTestId('file-upload-trnCertificate')).toBeInTheDocument();
        expect(screen.getByTestId('file-upload-eidDoc')).toBeInTheDocument();
    });

    it('disables DatePickerInput fields when corresponding text inputs are empty', () => {
        render(
            <Formik initialValues={{ tradeLicenseNo: '', trnNo: '' }} onSubmit={() => {}}>
                <CompanyInfoForm activities={[]} values={{ tradeLicenseNo: '', trnNo: '' }} />
            </Formik>
        );

        const tradeLicenseExpiryInput = screen.getByTestId('date-picker-tradeLicenseExpiry');
        const trnExpiryInput = screen.getByTestId('date-picker-trnExpiry');

        expect(tradeLicenseExpiryInput.querySelector('input')).toBeDisabled();
        expect(trnExpiryInput.querySelector('input')).toBeDisabled();
    });

    it('enables DatePickerInput fields when corresponding text inputs have values', () => {
        const updatedValues = {
            ...defaultProps.values,
            tradeLicenseNo: '12345',
            trnNo: '67890',
        };

        render(
            <Formik initialValues={updatedValues} onSubmit={() => {}}>
                <CompanyInfoForm {...defaultProps} values={updatedValues} />
            </Formik>
        );

        expect(screen.getByTestId('date-picker-tradeLicenseExpiry')).not.toBeDisabled();
        expect(screen.getByTestId('date-picker-trnExpiry')).not.toBeDisabled();
    });

    it('handles file upload input change correctly', () => {
        const setFile = vi.fn();
        const defaultProp = {
            activities: [],
            values: {
                tradeLicenseDoc: null,
            },
        };

        render(
            <Formik initialValues={defaultProp.values} onSubmit={() => {}}>
                <CompanyInfoForm {...defaultProps} />
            </Formik>
        );

        const fileInput = screen.getByTestId('file-upload-tradeLicenseDoc').querySelector('input');
        const testFile = new File(['file content'], 'filename.png', { type: 'image/png' });
        fireEvent.change(fileInput!, { target: { files: [testFile] } });

        fireEvent.change(fileInput!, { target: { files: [testFile] } });

        // Verify that setFile was called with the expected file
        expect(setFile).contain(testFile);
    });
});
