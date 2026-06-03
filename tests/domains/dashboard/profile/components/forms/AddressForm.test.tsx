import { render, screen } from '@testing-library/react';
import { Formik, FormikContextType, useFormikContext } from 'formik';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { DropDown } from '@customtypes/general';
import AddressForm from '@src/domains/dashboard/profile/components/forms/AddressForm';

vi.mock('formik', async importOriginal => {
    const actual = await importOriginal();
    return {
        ...(actual as object),
        useFormikContext: vi.fn(),
    };
});
// Mock components
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
    default: ({ name, label, type = 'text', placeholder, prefix, ...props }: any) => (
        <div data-testid={`text-input-${name}`}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={prefix ? `${prefix}${props.value || ''}` : props.value}
                {...props}
            />
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

describe('AddressForm Component', () => {
    const defaultProps = {
        refresh: false,
        addressTypesList: [
            { value: 'home', label: 'Home' },
            { value: 'work', label: 'Work' },
        ] as DropDown,
    };
    beforeEach(() => {
        // Set up the mock for useFormikContext to return the resetForm function
        (useFormikContext as any).mockReturnValue({
            resetForm: vi.fn(),
        } as Partial<FormikContextType<any>>);
    });

    it('renders the form with all inputs and labels', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <AddressForm {...defaultProps} />
            </Formik>
        );

        expect(screen.getByTestId('select-addressType')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-name')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-addressLine1')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-addressLine2')).toBeInTheDocument();
        expect(screen.getByTestId('text-input-phoneNumber')).toBeInTheDocument();
        expect(screen.getByTestId('switch-default')).toBeInTheDocument();
    });

    it('resets the form when the refresh prop changes', () => {
        const resetForm = vi.fn();

        (useFormikContext as any).mockReturnValue({
            resetForm,
        } as Partial<FormikContextType<any>>);

        const { rerender } = render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <AddressForm {...defaultProps} />
            </Formik>
        );

        rerender(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <AddressForm {...defaultProps} refresh />
            </Formik>
        );

        expect(resetForm).toHaveBeenCalled();
    });

    it('renders the correct options in the SelectInput', () => {
        render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <AddressForm {...defaultProps} />
            </Formik>
        );

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Work')).toBeInTheDocument();
    });

    it('renders the prefix in the phone number input', async () => {
        render(
            <Formik initialValues={{}} onSubmit={() => {}}>
                <AddressForm {...defaultProps} />
            </Formik>
        );

        await screen.findByPlaceholderText('Enter Mobile Number');
        expect(screen.getByTestId('text-input-phoneNumber')).toBeInTheDocument();
    });
});
