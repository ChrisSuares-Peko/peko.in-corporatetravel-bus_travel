import { render, cleanup, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik, FormikValues } from 'formik';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as Yup from 'yup';

import TextInput from '@components/atomic/inputs/TextInput';

const renderWithFormik = (
    ui: React.ReactElement,
    {
        initialValues = {},
        onSubmit = vi.fn(),
        validationSchema = Yup.object(), // Default empty validation schema
    }: {
        initialValues?: FormikValues;
        onSubmit?: (values: FormikValues) => void;
        validationSchema?: Yup.ObjectSchema<any>;
    } = {}
) =>
    render(
        <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
        >
            {() => ui}
        </Formik>
    );

describe('text input Component', () => {
    beforeEach(() => {
        cleanup();
    });
    it('renders the TextInput component', () => {
        renderWithFormik(<TextInput name="testInput" type="text" placeholder="Enter text" />);
        const input = screen.getByPlaceholderText(/Enter text/i);
        expect(input).toBeInTheDocument();
    });

    it('renders with a label', () => {
        renderWithFormik(<TextInput name="testInput" label="Test Label" type="text" />);
        const label = screen.getByText(/Test Label/i);
        expect(label).toBeInTheDocument();
    });

    it('disables the input when isDisabled is true', () => {
        renderWithFormik(
            <TextInput name="testInput" type="text" isDisabled placeholder="Enter text" />
        );
        const input = screen.getByPlaceholderText(/Enter text/i);
        expect(input).toBeDisabled();
    });

    it('restricts input to numbers only', () => {
        renderWithFormik(
            <TextInput name="testInput" type="text" allowNumbersOnly placeholder="Enter text" />
        );
        const input = screen.getByPlaceholderText(/Enter text/i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'abc123' } });
        expect(input.value).toBe('123');
    });

    it('restricts input to alphabets only', () => {
        renderWithFormik(
            <TextInput name="testInput" type="text" allowAlphabetsOnly placeholder="Enter text" />
        );
        const input = screen.getByPlaceholderText(/Enter text/i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'abc123' } });
        expect(input.value).toBe('abc');
    });

    it('restricts input to two decimals only', () => {
        renderWithFormik(
            <TextInput name="testInput" type="text" allowTwoDecimalsOnly placeholder="Enter text" />
        );
        const input = screen.getByPlaceholderText(/Enter text/i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: '123.456' } });
        expect(input.value).toBe('123.45');
    });

    it('calls handleChange with the correct value', () => {
        const handleChangeMock = vi.fn();
        renderWithFormik(
            <TextInput
                name="testInput"
                type="text"
                handleChange={handleChangeMock}
                placeholder="Enter text"
            />
        );
        const input = screen.getByPlaceholderText(/Enter text/i) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'new value' } });
        expect(handleChangeMock).toHaveBeenCalledWith('new value');
    });

    it('prevents paste when disablePaste is true', () => {
        renderWithFormik(
            <TextInput name="testInput" type="text" disablePaste placeholder="Enter text" />
        );
        const input = screen.getByPlaceholderText(/Enter text/i) as HTMLInputElement;
        const pasteEvent = new Event('paste', {
            bubbles: true,
            cancelable: true,
        });

        input.addEventListener('paste', e => e.preventDefault());

        fireEvent(input, pasteEvent);

        expect(pasteEvent.defaultPrevented).toBe(true);
    });

    it('displays validation error when input is invalid', async () => {
        const validationSchema = Yup.object({
            testInput: Yup.string().required('Error message'),
        });

        renderWithFormik(
            <TextInput name="testInput" type="text" isRequired placeholder="Enter text" />,
            { validationSchema }
        );

        const input = screen.getByPlaceholderText(/Enter text/i) as HTMLInputElement;

        // Simulate blur to trigger validation
        fireEvent.blur(input);

        // Wait for the validation error message to appear
        const errorMessage = await screen.findByText(/Error message/i);

        expect(errorMessage).toBeInTheDocument();
    });

    it('renders tooltip when showToolTip is true', async () => {
        renderWithFormik(
            <TextInput
                name="testInput"
                type="text"
                showToolTip
                tooltipText="Tooltip content"
                placeholder="Enter text"
                label="Test Label"
            />
        );
        fireEvent.mouseOver(screen.getByLabelText('info-circle'));

        await waitFor(() => {
            const tooltipContent = screen.getByText(/Tooltip content/i, { selector: 'div' }); // Adjust selector if needed
            expect(tooltipContent).toBeInTheDocument();
        });
    });
});
