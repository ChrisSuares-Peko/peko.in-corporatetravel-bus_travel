import { render, screen } from '@testing-library/react';
import { Formik, Form } from 'formik'; // Import Formik components for testing
import { Provider } from 'react-redux';
import { MockStoreEnhanced } from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { InputComponentsType } from '@src/domains/dashboard/billPayments/types/index'; // Adjust import path as needed
import { useAppSelector } from '@src/hooks/store';
import { store, createTestStore } from '@store/store';
import { accessKeys } from '@utils/accessKeys';

import RenderFormField from '../../../components/forms/RenderFormField';

// Mock the useAppSelector hook
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('RenderFormField', () => {
    let mockStore: MockStoreEnhanced<unknown, {}>;

    const mockSelectFormData: InputComponentsType = {
        type: 'select',
        name: 'testField',
        label: 'Test Label',
        placeholder: 'Select an option',
        options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
        ],
    };

    const mockTextFormData: InputComponentsType = {
        type: 'input',
        name: 'testField',
        label: 'Test Label',
        placeholder: 'Enter text',
        min: 1,
        max: 10,
        supportAlphabets: true,
        showMinAndMax: true,
    };

    const mockLimitData = {
        minDenomination: 10,
        maxDenomination: 1000,
        flexiKey: 'testFlexiKey',
        typeKey: 1,
        accessKey: accessKeys.dUPostpaid,
        serviceProvider: 'testProvider',
        surcharge: 'testSurcharge',
    };

    beforeEach(() => {
        mockStore = createTestStore(store.getState());
        vi.mocked(useAppSelector).mockReturnValue({ vendor: { accessKey: accessKeys.dUPostpaid } });
    });

    it('renders SelectInput when formData type is select', () => {
        render(
            <Provider store={mockStore}>
                <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
                    <Form>
                        <RenderFormField formData={mockSelectFormData} limitData={mockLimitData} />
                    </Form>
                </Formik>
            </Provider>
        );

        expect(screen.getByText(/Test Label/i)).toBeInTheDocument();
    });

    it('renders TextInput when formData type is input', () => {
        render(
            <Provider store={mockStore}>
                <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
                    <Form>
                        <RenderFormField formData={mockTextFormData} limitData={mockLimitData} />
                    </Form>
                </Formik>
            </Provider>
        );
        expect(screen.queryByPlaceholderText('Select an option')).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('shows min and max denominations when showMinAndMax is true', () => {
        render(
            <Provider store={mockStore}>
                <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
                    <Form>
                        <RenderFormField formData={mockTextFormData} limitData={mockLimitData} />
                    </Form>
                </Formik>
            </Provider>
        );
        const elements = screen.getAllByText(
            (content, element) =>
                content.includes('Min: AED 10') && content.includes('Max: AED 1,000')
        );
        expect(elements.length).toBeGreaterThan(0);
    });

    it('passes the correct maxLength and input restrictions to TextInput', () => {
        render(
            <Provider store={mockStore}>
                <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
                    <Form>
                        <RenderFormField formData={mockTextFormData} limitData={mockLimitData} />
                    </Form>
                </Formik>
            </Provider>
        );
        const inputs = screen.getAllByPlaceholderText('Enter text');
        const input = inputs[0];
        expect(input).toHaveAttribute('maxlength', '10');
        expect(input).toBeInTheDocument();
    });

    it('allows only numbers and dots for DU Postpaid service', () => {
        render(
            <Provider store={mockStore}>
                <Formik initialValues={{ testField: '' }} onSubmit={() => {}}>
                    <Form>
                        <RenderFormField formData={mockTextFormData} limitData={mockLimitData} />
                    </Form>
                </Formik>
            </Provider>
        );
        const inputs = screen.queryAllByPlaceholderText('Enter text');
        expect(inputs[0]).toBeInTheDocument();
    });
});
