import { render, screen, cleanup } from '@testing-library/react';
import { Formik } from 'formik';
import { describe, it, expect, beforeEach } from 'vitest';

import { accessKeys } from '@utils/accessKeys';

import BeneficiaryForm from '../../../components/forms/BeneficiaryForm';

describe('BeneficiaryForm', () => {
    beforeEach(() => {
        cleanup();
    });

    const setup = (
        formikValues = {},
        accesskeyValue = '',
        selectedProvider = '',
        setSelectedProvider = () => {}
    ) => {
        render(
            <Formik initialValues={formikValues} onSubmit={() => {}}>
                <BeneficiaryForm
                    accesskeyValue={accesskeyValue}
                    selectedProvider={selectedProvider}
                    setSelectedProvider={setSelectedProvider}
                />
            </Formik>
        );
    };

    it('renders the form fields correctly', () => {
        setup();

        // Check for form fields
        expect(screen.getByPlaceholderText('Example: JoXXX')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Example: XXXXXXX')).toBeInTheDocument();
    });

    it('renders provider-specific fields based on accesskeyValue', () => {
        setup({}, accessKeys.Salik);

        expect(screen.getByPlaceholderText('Example: 1234')).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Example:123-XXXX-XXXXXXX-X')).not.toBeInTheDocument();
    });

    it('renders conditional fields based on selectedProvider', () => {
        setup({}, '', accessKeys.darb);

        expect(screen.getByPlaceholderText('Example:123-XXXX-XXXXXXX-X')).toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Example: 1234')).not.toBeInTheDocument();
    });

    it('renders optional fields based on accesskeyValue and selectedProvider', () => {
        setup({}, accessKeys.etisalatPostpaid);

        // Check for the select element by text or placeholder if it's visible
        expect(screen.getByText('Please select a service type')).toBeInTheDocument();
    });

    it('renders label for account number based on accesskeyValue', () => {
        setup({}, accessKeys.darb);

        const label = screen.getByText('Emirates ID');
        expect(label).toBeInTheDocument();

        const associatedInput = screen.getByPlaceholderText('Example:123-XXXX-XXXXXXX-X');
        expect(associatedInput).toBeInTheDocument();
    });

    it('does not render unnecessary fields', () => {
        setup({}, accessKeys.Lootah);

        expect(screen.queryByPlaceholderText('Example: 1234')).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText('Example:123-XXXX-XXXXXXX-X')).not.toBeInTheDocument();
    });
});
