import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Formik } from 'formik';
import { it, expect, describe, afterEach, vi } from 'vitest';

import PasswordInput from '@components/atomic/inputs/PasswordInput';

globalThis.ClipboardEvent = vi.fn().mockImplementation(() => ({
    clipboardData: {
        getData: () => 'pasted text',
    },
}));
const renderWithFormik = (ui: React.ReactElement) =>
    render(
        <Formik initialValues={{ password: '' }} onSubmit={() => {}}>
            {() => ui}
        </Formik>
    );

describe('PasswordInput', () => {
    afterEach(() => {
        cleanup();
    });
    it('renders with label and placeholder', () => {
        renderWithFormik(
            <PasswordInput
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
            />
        );
        expect(screen.getByTitle('Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
        const input = screen.getByPlaceholderText('Enter your password') as HTMLInputElement;
        expect(input).toHaveAttribute('type', 'password');
    });

    it('disables the input when isDisabled is true', () => {
        renderWithFormik(
            <PasswordInput
                name="password"
                placeholder="Enter your password"
                isDisabled
                type="password"
            />
        );
        screen.debug();
        expect(screen.getByPlaceholderText('Enter your password')).toBeDisabled();
    });

    it('prevents paste when disablePaste is true', () => {
        const { container } = renderWithFormik(
            <PasswordInput
                name="password"
                placeholder="Enter your password"
                type="password"
                disablePaste
            />
        );

        const input = container.querySelector('input');
        const pasteEvent = new Event('paste', { bubbles: true });
        Object.defineProperty(pasteEvent, 'clipboardData', {
            value: {
                getData: vi.fn(() => 'pasted text'),
            },
        });

        fireEvent(input!, pasteEvent);

        // Check that the input value has not changed
        expect(input).toHaveValue('');
    });

    it('removes spaces from the input value when allowAllExceptSpace is true', () => {
        const { container } = renderWithFormik(
            <PasswordInput
                name="password"
                placeholder="Enter your password"
                type="password"
                allowAllExceptSpace
            />
        );

        const input = container.querySelector('input');
        fireEvent.change(input!, { target: { value: 'pass    word' } });

        expect(input).toHaveValue('password');
    });

    it('calls onChange handler', () => {
        const handleChange = vi.fn();
        renderWithFormik(
            <PasswordInput
                name="password"
                placeholder="Enter your password"
                type="password"
                onChange={handleChange}
            />
        );

        const input = screen.getByPlaceholderText('Enter your password');
        fireEvent.change(input, { target: { value: 'new password' } });

        expect(handleChange).toHaveBeenCalled();
    });
});
