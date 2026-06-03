import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAppSelector } from '@src/hooks/store';

import BeneficiariesList from '../../../components/beneficiary/BeneficiariesList';

// Mock the necessary hooks and components
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
}));

vi.mock('../../../hooks/beneficiary/useFetchBeneficiary', () => ({
    default: vi.fn(),
}));

vi.mock('../../../components/beneficiary/BeneficiaryCard', () => ({
    default: ({ beneficiary, handleEdit }: any) => (
        <div
            role="button"
            tabIndex={0}
            onClick={() => handleEdit(beneficiary)}
            onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    handleEdit(beneficiary);
                }
            }}
        >
            {beneficiary.name}
        </div>
    ),
}));

vi.mock('../../../components/beneficiary/BeneficiaryModal', () => ({
    default: ({ open, onCancel, editValues, beneficiaryActionType }: any) =>
        open && (
            <div data-testid="beneficiary-modal">
                <div>{editValues ? `Editing: ${editValues.name}` : 'Adding new beneficiary'}</div>
                <div>Action Type: {beneficiaryActionType}</div>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        ),
}));

describe('BeneficiariesList Component', () => {
    it('renders beneficiaries list correctly', () => {
        const mockBeneficiaries = [
            {
                id: 1,
                name: 'John Doe',
                accountNo: '1234567890',
                accessKey: 'key1',
                optional1: '',
                isActive: true,
                createdAt: '',
                updatedAt: '',
                credentialId: 1,
                serviceOperator: { serviceProvider: '', serviceImage: '' },
            },
            {
                id: 2,
                name: 'Jane Doe',
                accountNo: '0987654321',
                accessKey: 'key2',
                optional1: '',
                isActive: true,
                createdAt: '',
                updatedAt: '',
                credentialId: 2,
                serviceOperator: { serviceProvider: '', serviceImage: '' },
            },
        ];
        (useAppSelector as any).mockReturnValue({ tableData: mockBeneficiaries, isLoading: false });

        render(<BeneficiariesList />);

        // Verify that the beneficiaries are shown
        const beneficiaries = screen.getAllByText(/Doe/i);
        expect(beneficiaries).toHaveLength(2);
    });

    it('shows empty state when there are no beneficiaries', () => {
        (useAppSelector as any).mockReturnValue({ tableData: [], isLoading: false });

        render(<BeneficiariesList />);

        // Verify that the empty state is shown
        expect(screen.getByText(/No Beneficiaries Found/i)).toBeInTheDocument();
    });

    it('opens the modal in "add" mode when "Add Beneficiary" button is clicked', async () => {
        (useAppSelector as any).mockReturnValue({ tableData: [], isLoading: false });

        render(<BeneficiariesList />);

        // Click the "Add Beneficiary" button
        fireEvent.click(screen.getByText(/Add Beneficiary/i));

        // Verify that the modal is opened in add mode
        await waitFor(() => {
            expect(screen.getByTestId('beneficiary-modal')).toBeInTheDocument();
            expect(screen.getByText(/Adding new beneficiary/i)).toBeInTheDocument();
            expect(screen.getByText(/Action Type: ADD/i)).toBeInTheDocument();
        });
    });

    it('opens the modal in "edit" mode when a beneficiary card is clicked', async () => {
        const mockBeneficiaries = [
            {
                id: 1,
                name: 'John Doe',
                accountNo: '1234567890',
                accessKey: 'key1',
                optional1: '',
                isActive: true,
                createdAt: '',
                updatedAt: '',
                credentialId: 1,
                serviceOperator: { serviceProvider: '', serviceImage: '' },
            },
        ];
        (useAppSelector as any).mockReturnValue({ tableData: mockBeneficiaries, isLoading: false });

        render(<BeneficiariesList />);

        // Click the beneficiary card
        fireEvent.click(screen.getByText(/John Doe/i));

        // Verify that the modal is opened in edit mode
        await waitFor(() => {
            expect(screen.getByTestId('beneficiary-modal')).toBeInTheDocument();
            expect(screen.getByText(/Editing: John Doe/i)).toBeInTheDocument();
            expect(screen.getByText(/Action Type: EDIT/i)).toBeInTheDocument();
        });
    });
});
