import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import FormComponent from '@src/domains/dashboard/works/components/FormComponent';
import useForm from '@src/domains/dashboard/works/hooks/useForm';
import { workInformationSchema } from '@src/domains/dashboard/works/schema';

// Mock the useForm hook
vi.mock('@src/domains/dashboard/works/hooks/useForm', () => ({
    default: vi.fn().mockReturnValue({
        handleSubmission: vi.fn().mockResolvedValue({}),
    }),
}));

// Mock the schema
vi.mock('@src/domains/dashboard/works/schema', () => ({
    workInformationSchema: {
        validate: vi.fn().mockResolvedValue({}),
        validateSync: vi.fn().mockReturnValue({}), // Optional: for sync validation if needed
    },
}));

describe('FormComponent', () => {
    const mockHandleSubmission = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useForm).mockReturnValue({
            handleSubmission: mockHandleSubmission,
        });

        // No need to mock validate here since it's already mocked
    });

    it('renders without crashing', () => {
        render(
            <Formik
                initialValues={{
                    pocName: '',
                    email: '',
                    requirement: '',
                }}
                validationSchema={workInformationSchema}
                onSubmit={() => {}}
            >
                <FormComponent planId="123" workId={1} price="100" planName="Basic Plan" />
            </Formik>
        );

        expect(screen.getByPlaceholderText(/POC Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter Email ID/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter requirement/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    it('submits form with correct values', async () => {
        const initialValues = {
            pocName: 'John Doe',
            email: 'john.doe@example.com',
            requirement: 'Requirement details',
        };

        render(
            <Formik
                initialValues={initialValues}
                validationSchema={workInformationSchema}
                onSubmit={mockHandleSubmission}
            >
                <FormComponent planId="123" workId={1} price="100" planName="Basic Plan" />
            </Formik>
        );

        fireEvent.change(screen.getByPlaceholderText(/POC Name/i), {
            target: { value: 'John Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email ID/i), {
            target: { value: 'john.doe@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter requirement/i), {
            target: { value: 'Requirement details' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(mockHandleSubmission).toHaveBeenCalledWith(
                expect.objectContaining({
                    pocName: 'John Doe',
                    email: 'john.doe@example.com',
                    requirement: 'Requirement details',
                    planId: '123',
                    workId: 1,
                    price: '100',
                    planName: 'Basic Plan',
                })
            );
        });
    });

    it('displays a loading state while submitting', async () => {
        vi.mocked(useForm).mockReturnValue({
            handleSubmission: vi
                .fn()
                .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000))), // Simulate loading
        });
        render(
            <Formik
                initialValues={{
                    pocName: '',
                    email: '',
                    requirement: '',
                }}
                validationSchema={workInformationSchema}
                onSubmit={() => {}}
            >
                <FormComponent planId="123" workId={1} price="100" planName="Basic Plan" />
            </Formik>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter POC Name/i), {
            target: { value: 'John Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter Email ID/i), {
            target: { value: 'john.doe@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText(/Enter requirement/i), {
            target: { value: 'Requirement details' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Submit/i })).toBeEnabled();
        });
    });

    it('does not submit form with invalid values', async () => {
        (workInformationSchema.validate as any).mockRejectedValue(new Error('Validation error'));

        render(
            <Formik
                initialValues={{
                    pocName: '',
                    email: '',
                    requirement: '',
                }}
                validationSchema={workInformationSchema}
                onSubmit={() => {}}
            >
                <FormComponent planId="123" workId={1} price="100" planName="Basic Plan" />
            </Formik>
        );

        fireEvent.change(screen.getByPlaceholderText(/Enter POC Name/), { target: { value: '' } });

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(mockHandleSubmission).not.toHaveBeenCalled();
        });
    });
});
