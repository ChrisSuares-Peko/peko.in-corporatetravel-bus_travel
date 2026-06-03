import React from 'react';

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { describe, test, expect } from 'vitest';

import QuantityField from '../../components/QuantityField'; // Adjust path as necessary

describe('QuantityField', () => {
    const initialValues = { quantity: 1 };

    const renderComponent = () =>
        render(
            <Formik initialValues={initialValues} onSubmit={() => {}}>
                <QuantityField />
            </Formik>
        );

    test('renders correctly', () => {
        renderComponent();
        expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    test('initial value is set correctly', () => {
        renderComponent();
        expect(screen.getByRole('spinbutton')).toHaveValue(1);
    });

    test('value change updates Formik state', async () => {
        renderComponent();
        const input = screen.getByRole('spinbutton');

        fireEvent.change(input, { target: { value: '5' } });
        await waitFor(() => {
            expect(input).toHaveValue(5);
        });
    });

    test('blur event updates Formik state', async () => {
        renderComponent();
        const input = screen.getByRole('spinbutton');

        fireEvent.change(input, { target: { value: '5' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(input).toHaveValue(5);
        });
    });

    test('restricts non-numeric input', () => {
        renderComponent();
        const input = screen.getByRole('spinbutton') as HTMLInputElement;

        fireEvent.keyDown(input, { key: 'a', code: 'KeyA' });
        fireEvent.change(input, { target: { value: 'abc' } });

        expect(input).toHaveValue(null);
    });

    test('formatter and parser work correctly', async () => {
        renderComponent();
        const input = screen.getByRole('spinbutton');

        fireEvent.change(input, { target: { value: '12a' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(input).toHaveValue(1);
        });

        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);

        await waitFor(() => {
            expect(input).toHaveValue(1);
        });
    });
});
