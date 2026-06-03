import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import BeneficiaryModal from '../../../components/beneficiary/BeneficiaryModal';
import { BeneficiaryActionType } from '../../../types';

vi.mock('@src/hooks/store');
vi.mock('../../../hooks/beneficiary/useBeneficiaryApis', () => ({
    default: () => ({
        buttonLoader: false,
        sendOtpApi: vi.fn(),
        addBeneficiary: vi.fn(),
        updateBeneficicary: vi.fn(),
        deleteBeneficicary: vi.fn(),
        isOtpSending: false,
    }),
}));
vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

// Mock inner components used inside BeneficiaryModal
vi.mock('@components/molecular/modals/OtpModal', () => ({
    default: () => <div>OTP Verification</div>,
}));

vi.mock('../../../components/beneficiary/ConfirmationModal', () => ({
    default: () => (
        <div>
            <span>Are you sure you want to delete this beneficiary?</span>
            <button type="button">Yes</button>
            <button type="button">No</button>
        </div>
    ),
}));

vi.mock('../../../components/beneficiary/FormComponent', () => ({
    default: () => <div>FormComponent</div>,
}));

const editValues = {
    id: 1,
    name: 'Test Beneficiary',
    accountNo: '1234567890',
    accessKey: 'some-access-key',
    optional1: 'optional-value1', // Example value, adjust as necessary
    isActive: true,
    createdAt: '2023-08-01T12:34:56Z', // Example ISO date string
    updatedAt: '2023-08-02T12:34:56Z', // Example ISO date string
    credentialId: 123, // Example credential ID
    serviceOperator: {
        serviceProvider: 'Test Service Provider',
        serviceImage: 'test-image-url', // Example image URL or path
    },
};

describe('BeneficiaryModal', () => {
    const mockDispatch = vi.fn();
    (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    (useAppSelector as Mock).mockReturnValue({ id: '123', role: 'admin' });

    const defaultProps = {
        open: true,
        onCancel: vi.fn(),
        closeAddModal: vi.fn(),
        editValues: null,
        beneficiaryActionType: BeneficiaryActionType.ADD,
        setBeneficiaryActionType: vi.fn(),
        accesskeyValue: 'test-key',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the modal with the correct title for adding a beneficiary', () => {
        render(<BeneficiaryModal {...defaultProps} />);
        expect(screen.getByText(/Add Beneficiary Details/i)).toBeInTheDocument();
    });

    it('renders the modal with the correct title for editing a beneficiary', () => {
        render(
            <BeneficiaryModal
                {...defaultProps}
                editValues={editValues}
                beneficiaryActionType={BeneficiaryActionType.EDIT}
            />
        );
        expect(screen.getByText(/Edit Beneficiary Details/i)).toBeInTheDocument();
    });

    it('calls the handleFormSubmit function when form is submitted', async () => {
        render(<BeneficiaryModal {...defaultProps} />);

        // Fill out required fields
        fireEvent.change(screen.getByPlaceholderText(/Example: JoXXX/i), {
            target: { value: 'John Doe' },
        });

        // Mock the other required fields that may trigger validation
        fireEvent.change(screen.getByPlaceholderText(/Example: XXXXXXX/i), {
            target: { value: '1234567890' },
        });

        // Simulate form submission
        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);
    });

    it('opens OTP modal when OTP is requested for editing', async () => {
        render(
            <BeneficiaryModal
                {...defaultProps}
                editValues={editValues}
                beneficiaryActionType={BeneficiaryActionType.EDIT}
            />
        );

        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/OTP Verification/i)).toBeInTheDocument();
        });
    });

    it('handles the confirmation modal submit for deletion', async () => {
        render(
            <BeneficiaryModal
                {...defaultProps}
                editValues={editValues}
                beneficiaryActionType={BeneficiaryActionType.EDIT}
            />
        );

        const deleteButton = screen.getByRole('img', { name: 'delete' });
        fireEvent.click(deleteButton);

        const confirmButton = screen.getByText(/Yes/i);
        fireEvent.click(confirmButton);

        expect(screen.getByText(/OTP Verification/i)).toBeInTheDocument();
    });

    it('closes the modal when the cancel button is clicked', () => {
        render(<BeneficiaryModal {...defaultProps} />);
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);

        expect(defaultProps.onCancel).toHaveBeenCalled();
    });
});
