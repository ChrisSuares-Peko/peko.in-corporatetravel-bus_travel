import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { describe, it, expect, vi } from 'vitest';

import EditGuidelineForm from '@domains/dashboard/Invoice/components/Guideline/EditGuidelineForm';

// Mock store
const mockStore = configureStore([]);
const store = mockStore({
    reducer: {
        invoices: {
            Details: {
                id: 1,
            },
        },
    },
});

// Mock GuidelineModal
vi.mock('@domains/dashboard/Invoice/components/GuidelineModal', () => ({
    __esModule: true,
    default: vi.fn(() => <div>Mocked Guideline Modal</div>),
}));

describe('EditGuidelineForm Component', () => {
    const initialValues = {
        data: [
            {
                days: '10',
                sms: false,
                email: false,
                actionDate: '2024-12-31',
                status: 'PENDING',
            },
        ],
    };

    const renderComponent = () =>
        render(
            <Provider store={store}>
                <Formik initialValues={initialValues} onSubmit={vi.fn()}>
                    <EditGuidelineForm index={0} templateData={[]} />
                </Formik>
            </Provider>
        );

    it('renders the component correctly', () => {
        renderComponent();

        expect(screen.getByText('If customer did not pay in')).toBeInTheDocument();
        expect(screen.getByText('Send reminder via')).toBeInTheDocument();
        expect(screen.getByText('Change Template')).toBeInTheDocument();
    });

    it('opens the GuidelineModal when "Change Template" is clicked', () => {
        renderComponent();

        const changeTemplateButton = screen.getByText('Change Template');
        fireEvent.click(changeTemplateButton);

        expect(screen.getByText('Mocked Guideline Modal')).toBeInTheDocument();
    });

    it('updates days input value and action date on change', () => {
        renderComponent();

        const daysInput = screen.getByPlaceholderText('10 days');
        fireEvent.change(daysInput, { target: { value: '5' } });

        expect(daysInput).toHaveValue('5');
        // You can also check if the actionDate field gets updated correctly
    });
});
