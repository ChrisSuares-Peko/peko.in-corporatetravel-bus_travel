import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import BasicInfo from '@src/domains/dashboard/profile/components/BasicInfo';
import useBasicInfoApi from '@src/domains/dashboard/profile/hooks/useBasicInfoApi';
import useGetPasswordPolicies from '@src/domains/dashboard/profile/hooks/useGetPasswordPolicies';
import usePasswordPolicyValidation from '@src/domains/dashboard/profile/hooks/usePasswordPolicyValidation';

vi.mock('@src/domains/dashboard/profile/components/BasicInfoModal', () => ({
    default: () => <div data-testid="basic-info-modal">Basic Info Modal</div>,
}));

vi.mock('@src/domains/dashboard/profile/ChangePasswordModal', () => ({
    default: ({ open, handleCancel }: any) =>
        open ? (
            <div data-testid="change-password-modal">
                Change Password Modal
                <button type="button" onClick={handleCancel}>
                    Close
                </button>
            </div>
        ) : null,
}));

// Mock the hooks used in the component
vi.mock('@src/domains/dashboard/profile/hooks/useBasicInfoApi', () => ({
    default: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/hooks/useGetPasswordPolicies', () => ({
    default: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/hooks/usePasswordPolicyValidation', () => ({
    default: vi.fn(),
}));

describe('BasicInfo Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (useBasicInfoApi as any).mockReturnValue({
            data: {
                contactPersonName: 'John Doe',
                city: 'New York',
                credential: { username: 'john_doe_123' },
                companySize: 50,
                landlineNo: '123-456-7890',
                mobileNo: '987-654-3210',
                designation: 'Manager',
                email: 'john.doe@example.com',
                name: 'John Doe Inc.',
            },
            isLoading: false,
        });

        (useGetPasswordPolicies as any).mockReturnValue({
            respData: {},
        });

        (usePasswordPolicyValidation as any).mockReturnValue({
            validatePassword: vi.fn(),
        });
    });

    it('renders without crashing', () => {
        render(<BasicInfo />);
        expect(screen.getByText(/Basic Information/i)).toBeInTheDocument();
    });

    it('displays basic information when data is available', () => {
        render(<BasicInfo />);
        expect(screen.getByText('Full Name')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('City')).toBeInTheDocument();
        expect(screen.getByText('New York')).toBeInTheDocument();
    });

    it('opens the basic info modal when edit button is clicked', async () => {
        render(<BasicInfo />);
        fireEvent.click(screen.getByText(/Edit/i)); // Assuming the edit button has this text
        await waitFor(() => {
            expect(screen.getByTestId('basic-info-modal')).toBeInTheDocument();
        });
    });

    it('calls useBasicInfoApi hook correctly', () => {
        render(<BasicInfo />);
        expect(useBasicInfoApi).toHaveBeenCalledTimes(1);
    });
});
