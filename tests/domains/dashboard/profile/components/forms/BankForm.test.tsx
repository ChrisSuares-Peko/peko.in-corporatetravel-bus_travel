import { render, screen, fireEvent } from '@testing-library/react';
import { Formik, useFormikContext, FormikContextType } from 'formik';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

import { DropDown } from '@customtypes/general';
import BankForm from '@src/domains/dashboard/profile/components/forms/BankForm';

// Mock components
vi.mock('@components/atomic/inputs/SelectInput', () => ({
    default: ({ name, label, options, ...props }: any) => (
        <div data-testid={`select-${name}`}>
            <label htmlFor={name}>{label}</label>
            <select id={name} name={name} {...props}>
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

vi.mock('@components/atomic/inputs/SwitchInput', () => ({
    default: ({ name, label }: any) => (
        <div data-testid={`switch-${name}`}>
            <label htmlFor={name}>{label}</label>
            <input id={name} type="checkbox" name={name} />
        </div>
    ),
}));
vi.mock('formik', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useFormikContext: vi.fn(),
    };
});

describe('BankForm Component', () => {
    const defaultProps = {
        refresh: false,
        isOtpOpen: true,
        accountTypesList: [
            { value: 'savings', label: 'Savings' },
            { value: 'checking', label: 'Checking' },
        ] as DropDown,
    };
    beforeEach(() => {
        (useFormikContext as any).mockReturnValue({
            resetForm: vi.fn(),
            setSubmitting: vi.fn(),
        } as Partial<FormikContextType<any>>);
    });
    afterEach(() => {
        vi.clearAllMocks();
    });
    it('renders the form with all inputs and labels', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <BankForm {...defaultProps} />
            </Formik>
        );

        // Check that all form elements are rendered
        expect(screen.getByTestId('text-input-accountHolderName')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-bankName')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-accountNumber')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-bankAddress')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-iban')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-swiftCode')).toBeInTheDocument();
        expect(screen.getByTestId('select-accountType')).toBeInTheDocument();
        expect(screen.getByTestId('switch-default')).toBeInTheDocument();
    });

    it('resets the form when the refresh prop changes', () => {
        const resetForm = vi.fn();

        // Mock useFormikContext with explicit typing
        (useFormikContext as any).mockReturnValue({
            resetForm,
            setSubmitting: vi.fn(),
        } as Partial<FormikContextType<any>>);

        const { rerender } = render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <BankForm {...defaultProps} />
            </Formik>
        );

        rerender(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <BankForm {...defaultProps} refresh />
            </Formik>
        );

        expect(resetForm).toHaveBeenCalled();
    });

    it('renders the correct options in the SelectInput', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <BankForm {...defaultProps} />
            </Formik>
        );

        // Check that options are rendered correctly
        expect(screen.getByText('Savings')).toBeInTheDocument();
        expect(screen.getByText('Checking')).toBeInTheDocument();
    });

    it('handles form interactions correctly', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <BankForm {...defaultProps} />
            </Formik>
        );

        // Get the select input
        const accountTypeSelect = screen.getByTestId('select-accountType').querySelector('select');

        // Ensure the select element is found and has the correct tag
        expect(accountTypeSelect).toBeInTheDocument();
        expect(accountTypeSelect?.tagName).toBe('SELECT');

        // Simulate change event
        fireEvent.change(accountTypeSelect!, { target: { value: 'checking' } });

        // Verify the new value
        expect(accountTypeSelect?.value).toBe('checking');
    });
});
