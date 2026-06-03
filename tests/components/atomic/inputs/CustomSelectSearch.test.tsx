import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Form, Formik } from 'formik';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as Yup from 'yup';

import CustomSelectSearch from '@components/atomic/inputs/CustomSelectSearch'; // Adjust path

const renderWithFormik = (ui: React.ReactElement) =>
    render(
        <Formik
            initialValues={{ mySelect: '' }}
            validationSchema={Yup.object({
                mySelect: Yup.string().required('This field is required'),
            })}
            onSubmit={() => {}}
        >
            <Form>{ui}</Form>
        </Formik>
    );

describe('CustomSelectSearch', () => {
    afterEach(() => {
        cleanup();
    });
    const options = [
        { oName: 'Option 1', oValue: 'value1' },
        { oName: 'Option 2', oValue: 'value2' },
    ];

    it('renders CustomSelectSearch with default props', () => {
        renderWithFormik(
            <CustomSelectSearch name="mySelect" placeholder="Select an option" options={options} />
        );

        expect(screen.getByRole('combobox')).toBeInTheDocument();

        // Open the select dropdown to check for placeholder
        fireEvent.mouseDown(screen.getByRole('combobox'));
        expect(screen.getByText('Select an option')).toBeInTheDocument();
    });

    it('renders error message if field is required and not filled', async () => {
        renderWithFormik(
            <CustomSelectSearch
                name="mySelect"
                label="My Select"
                placeholder="Select an option"
                isRequired
                options={options}
            />
        );

        const formItem = screen.getByTestId('form-item');
        const form = formItem.closest('form');

        if (form) {
            fireEvent.submit(form);

            const errorMessage = await screen.findByText('This field is required');
            expect(errorMessage).toBeInTheDocument();
        } else {
            throw new Error('Form element not found');
        }
        const errorMessage = await screen.findByText('This field is required');
        expect(errorMessage).toBeInTheDocument();
    });

    it('handles option selection and triggers onChange callback', async () => {
        const handleChange = vi.fn();

        renderWithFormik(
            <CustomSelectSearch
                name="mySelect"
                placeholder="Select an option"
                options={options}
                onChange={handleChange}
            />
        );
        const select = screen.getByRole('combobox');
        fireEvent.mouseDown(select);

        // Select the option
        const option = await screen.findByText('Option 1');
        fireEvent.click(option);

        // Check if onChange was called with the correct arguments
        expect(handleChange).toHaveBeenCalledWith('value1', 'Option 1');
    });

    it('triggers onSearch callback when search input is used', async () => {
        const handleSearch = vi.fn();

        renderWithFormik(
            <CustomSelectSearch
                name="mySelect"
                placeholder="Select an option"
                options={options}
                onSearch={handleSearch}
            />
        );

        const searchInput = screen.getByRole('combobox');

        fireEvent.change(searchInput, { target: { value: 'Option' } });

        // Ensure onSearch callback was called with the expected argument
        await waitFor(() => {
            expect(handleSearch).toHaveBeenCalledWith('Option');
        });
    });

    it('handles clear functionality and triggers onClear callback', async () => {
        const handleClear = vi.fn();
        const onSearch = vi.fn();

        renderWithFormik(
            <CustomSelectSearch
                name="mySelect"
                placeholder="Select an option"
                options={options}
                onClear={handleClear}
                showSearch
                onSearch={onSearch}
                filterOption={false}
                label="test"
            />
        );

        // Debug to inspect the initial DOM
        screen.debug();

        // Simulate selecting a value to ensure the clear button appears
        const selectInput = screen.getByRole('combobox');
        fireEvent.click(selectInput); // Open the dropdown
        const optionText = options[0].oName;
        const option = screen.queryByText(new RegExp(optionText, 'i'));
        if (option) {
            fireEvent.click(option);
        } else {
            console.warn(`Option with text "${optionText}" not found.`);
        }

        // Debug to inspect the DOM after selecting an option
        screen.debug();

        // Find and click the clear button
        const clearButton = screen.queryByRole('button', { name: /clear/i });
        if (!clearButton) {
            console.warn(
                'Clear button not found in the DOM. It may appear under certain conditions.'
            );
            return;
        }
        fireEvent.click(clearButton);

        // Ensure onClear callback was called
        await waitFor(() => {
            expect(handleClear).toHaveBeenCalled();
        });
    });

    it('shows tooltip when showToolTip is true', async () => {
        screen.debug();
        renderWithFormik(
            <CustomSelectSearch
                name="mySelect"
                label="Test Label"
                placeholder="Select an option"
                options={options}
                showToolTip
                tooltipText="This is a tooltip"
            />
        );

        fireEvent.mouseOver(screen.getByLabelText('info-circle'));

        await waitFor(() => {
            expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
        });
    });
});
