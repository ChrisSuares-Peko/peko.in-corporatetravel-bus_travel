import { render, screen, fireEvent } from '@testing-library/react';
import { Formik } from 'formik';
import { describe, it, expect, vi } from 'vitest';

import AddGuideline from '@domains/dashboard/Invoice/components/AddGuideline';
import GuidelineModal from '@domains/dashboard/Invoice/components/GuidelineModal';
import { useAppSelector } from '@src/hooks/store';

vi.mock('@domains/dashboard/Invoice/components/GuidelineModal', () => ({
    __esModule: true,
    default: vi.fn(() => <div>GuidelineModal Mock</div>),
}));

vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

describe('AddGuideline Component', () => {
    const mockTemplateData = [
        {
            email: { emailId: '', subject: '', body: '' },
            sms: { mobileNo: '', body: '' },
        },
    ];

    const mockDetails = {
        invoiceDetails: {
            dueDate: '2024-08-20',
        },
    };

    const renderComponent = (
        index = 0,
        initialValues = { data: [{ email: false, sms: false }] }
    ) => {
        (useAppSelector as any).mockReturnValue({ Details: mockDetails });

        return render(
            <Formik initialValues={initialValues} onSubmit={() => {}}>
                <AddGuideline index={index} templateData={mockTemplateData} />
            </Formik>
        );
    };

    it('renders without crashing', () => {
        renderComponent();
        expect(screen.getByText('If customer did not pay in')).toBeInTheDocument();
        expect(screen.getByText('Send reminder via')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Setup Template' })).toBeInTheDocument();
    });

    it('updates days and actionDate on input change', () => {
        renderComponent();

        const input = screen.getByPlaceholderText('Eg:10 days');
        fireEvent.change(input, { target: { value: '15' } });

        expect(input).toHaveValue('15');
    });

    it('disables Setup Template button when both email and sms are false', () => {
        renderComponent();

        const setupButton = screen.getByRole('button', { name: 'Setup Template' });
        expect(setupButton).toBeDisabled();
    });

    it('enables Setup Template button when either email or sms is true', () => {
        renderComponent(0, { data: [{ email: true, sms: false }] });

        const setupButton = screen.getByRole('button', { name: 'Setup Template' });
        expect(setupButton).toBeEnabled();
    });

    it('opens the GuidelineModal when Setup Template button is clicked', () => {
        renderComponent(0, { data: [{ email: true, sms: false }] });

        const setupButton = screen.getByRole('button', { name: 'Setup Template' });
        fireEvent.click(setupButton);

        expect(GuidelineModal).toHaveBeenCalledWith(
            expect.objectContaining({
                open: true,
                index: 0,
            }),
            expect.anything()
        );
    });
});
