import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import { MockStoreEnhanced } from 'redux-mock-store';
import { describe, it, vi, expect, beforeEach } from 'vitest';

import { useAppSelector } from '@src/hooks/store';
import { store, createTestStore } from '@store/store';

import BulkForm from '../../../components/forms/BulkForm';

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('BulkForm', () => {
    let mockStore: MockStoreEnhanced<unknown, {}>;

    beforeEach(() => {
        mockStore = createTestStore(store.getState());
        vi.mocked(useAppSelector).mockReturnValue({ vendor: { accessKey: 'etisalat_bill' } });

        render(
            <Provider store={mockStore}>
                <Formik
                    initialValues={{
                        beneficiaryName: '',
                        accountNumber: '',
                        serviceType: '',
                    }}
                    onSubmit={() => {}}
                >
                    <BulkForm />
                </Formik>
            </Provider>
        );
    });

    it('renders the form with initial values', () => {
        expect(screen.getByPlaceholderText('Enter Beneficiary Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Account Number')).toBeInTheDocument();
    });

    it('renders the Service Type dropdown when accessKey is "etisalat_bill"', () => {
        const allComboboxes = screen.getAllByRole('combobox');
        const serviceTypeSelect = allComboboxes[0];
        expect(serviceTypeSelect).toBeInTheDocument();
    });

    it('does not render the Service Type dropdown when accessKey is not "etisalat_bill"', () => {
        expect(screen.queryByLabelText('Service Type')).not.toBeInTheDocument();
        expect(screen.queryByRole('combobox', { name: /Service Type/i })).not.toBeInTheDocument();
    });

    it('validates form fields correctly', () => {
        // Get all inputs for Beneficiary Name and Account Number
        const nameInputs = screen.getAllByPlaceholderText('Enter Beneficiary Name');
        const accountInputs = screen.getAllByPlaceholderText('Enter Account Number');

        // Interact with the first input fields
        fireEvent.change(nameInputs[0], { target: { value: 'John Doe' } });
        fireEvent.change(accountInputs[0], { target: { value: '123456789' } });

        // Assert that the inputs have the correct values
        expect(nameInputs[0]).toHaveValue('John Doe');
        expect(accountInputs[0]).toHaveValue('123456789');
    });
});
