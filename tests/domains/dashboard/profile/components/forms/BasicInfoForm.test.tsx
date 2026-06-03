import { render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BasicInfoForm from '@src/domains/dashboard/profile/components/forms/BasicInfoForm';
import { useAppSelector } from '@src/hooks/store';

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

const mockedUseAppSelector = vi.mocked(useAppSelector);

vi.mock('@components/atomic/inputs/SelectInput', () => ({
    default: ({ name, label, options }: any) => (
        <div data-testid={`select-${name}`}>
            <label htmlFor={name}>{label}</label>
            <select id={name} name={name}>
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
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

vi.mock('@src/domains/dashboard/profile/components/CustomImageUploadInput', () => ({
    default: ({ handleChange }: any) => (
        <button type="button" onClick={handleChange}>
            Upload Image
        </button>
    ),
}));

vi.mock('../../../../../components/molecular/modals/ImageCropModal', () => ({
    default: ({ isVisible, onClose }: any) => (isVisible ? <div>Crop Modal</div> : null),
}));

describe('BasicInfoForm Component', () => {
    const defaultProps = {
        countriesList: [],
        companySizesList: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
        ],
    };
    beforeEach(() => {
        mockedUseAppSelector.mockReturnValue({
            data: {
                name: 'Test Company',
            },
        });
    });
    it('renders the form with all inputs and labels', () => {
        render(
            <Formik initialValues={{ profileImageBase: '' }} onSubmit={() => {}}>
                <BasicInfoForm {...defaultProps} />
            </Formik>
        );

        expect(screen.getByTestId('text-input-name')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-mobileNo')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-email')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-contactPersonName')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-designation')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-city')).toBeInTheDocument();
        expect(screen.getByTestId('select-companySize')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-landlineNo')).toBeInTheDocument();
    });
});
