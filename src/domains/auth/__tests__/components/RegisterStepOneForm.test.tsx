import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { MockStoreEnhanced } from 'redux-mock-store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { store, createTestStore } from '@store/store';

import { ValidateUser } from '../../api';
import RegisterStepOneForm from '../../components/forms/RegisterStepOneForm';
import { setPasswordPolicy } from '../../slices/passwordPolicySlice';
import { nextStep, setFormData } from '../../slices/registerSlice';

// Mock the API function and Redux hooks
vi.mock('../../api', () => ({
    ValidateUser: vi.fn(),
}));

describe('RegisterStepOneForm', () => {
    let mockStore: MockStoreEnhanced<unknown, {}>;

    beforeEach(() => {
        mockStore = createTestStore(store.getState());
        cleanup();
        render(
            <Provider store={mockStore}>
                <Router>
                    <RegisterStepOneForm />
                </Router>
            </Provider>
        );
    });

    it('renders the form with initial values', () => {
        // Check for form inputs
        expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Company Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Mobile Number')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Business Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Referral Code (Optional)')).toBeInTheDocument();
    });

    it('shows validation errors on submitting an empty form', async () => {
        fireEvent.click(screen.getByRole('button', { name: /Next/i }));

        await waitFor(() => {
            expect(screen.getByText('Please enter the full name')).toBeInTheDocument();
            expect(screen.getByText('Please enter the company name')).toBeInTheDocument();
            expect(screen.getByText('Please enter the mobile number')).toBeInTheDocument();
            expect(screen.getByText('Please enter the business email id')).toBeInTheDocument();
        });
    });

    it('submits the form with valid values', async () => {
        const mockValidateUserResponse = {
            status: true,
            data: { passwordPolicy: 'some-policy' },
        };

        vi.mocked(ValidateUser).mockResolvedValue(mockValidateUserResponse);

        fireEvent.change(screen.getByPlaceholderText('Full Name'), {
            target: { value: 'John Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText('Company Name'), {
            target: { value: 'Tech Corp' },
        });
        fireEvent.change(screen.getByPlaceholderText('Mobile Number'), {
            target: { value: '501234567' },
        });
        fireEvent.change(screen.getByPlaceholderText('Business Email'), {
            target: { value: 'johndoe@techcorp.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Referral Code (Optional)'), {
            target: { value: 'REF123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Next/i }));

        await waitFor(() => {
            expect(ValidateUser).toHaveBeenCalledWith({
                mobileNo: '501234567',
                email: 'johndoe@techcorp.com',
                referralCode: 'REF123',
            });

            // Retrieve the dispatched actions
            const actions = mockStore.getActions();

            // Check for the specific actions individually
            expect(actions).toContainEqual(
                setFormData({
                    contactPersonName: 'John Doe',
                    name: 'Tech Corp',
                    phonenumber: '501234567',
                    email: 'johndoe@techcorp.com',
                    referralCode: 'REF123',
                })
            );
            expect(actions).toContainEqual(setPasswordPolicy({ passwordPolicy: 'some-policy' }));
            expect(actions).toContainEqual(nextStep());
        });
    });

    it('handles server errors gracefully', async () => {
        vi.mocked(ValidateUser).mockResolvedValue({ status: false });

        fireEvent.change(screen.getByPlaceholderText('Full Name'), {
            target: { value: 'John Doe' },
        });
        fireEvent.change(screen.getByPlaceholderText('Company Name'), {
            target: { value: 'Tech Corp' },
        });
        fireEvent.change(screen.getByPlaceholderText('Mobile Number'), {
            target: { value: '501234567' },
        });
        fireEvent.change(screen.getByPlaceholderText('Business Email'), {
            target: { value: 'johndoe@techcorp.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Referral Code (Optional)'), {
            target: { value: 'REF123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Next/i }));

        await waitFor(() => {
            const actions = mockStore.getActions();
            expect(actions).not.toContainEqual(
                expect.objectContaining({
                    type: 'registration/setFormData',
                })
            );
            expect(actions).not.toContainEqual(
                expect.objectContaining({
                    type: 'passwordPolicy/setPasswordPolicy',
                })
            );
            expect(actions).not.toContainEqual(
                expect.objectContaining({
                    type: 'registration/nextStep',
                })
            );
        });
    });

    it('validates form fields according to schema', async () => {
        // Test invalid full name
        fireEvent.change(screen.getByPlaceholderText('Full Name'), {
            target: { value: '   John Corp' },
        });
        fireEvent.change(screen.getByPlaceholderText('Company Name'), {
            target: { value: 'Tech     Corp' },
        });
        fireEvent.change(screen.getByPlaceholderText('Mobile Number'), {
            target: { value: '5012345674' },
        });
        fireEvent.change(screen.getByPlaceholderText('Business Email'), {
            target: { value: 'john$$#2techcorp.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Referral Code (Optional)'), {
            target: { value: '' },
        });

        fireEvent.click(screen.getByRole('button', { name: /Next/i }));

        await waitFor(() => {
            expect(screen.getByText('Full name cannot start with whitespace')).toBeInTheDocument();
            expect(
                screen.getByText('Company name cannot contain consecutive whitespaces')
            ).toBeInTheDocument();
            expect(screen.getByText('Please enter a valid business email id')).toBeInTheDocument();
        });
    });
});
