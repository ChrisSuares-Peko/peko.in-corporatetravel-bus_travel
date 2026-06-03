import { Suspense } from 'react';

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import BankAccounts from '@src/domains/dashboard/profile/components/BankAccounts';
import useBankApi from '@src/domains/dashboard/profile/hooks/useBankApi';
import { setData } from '@src/domains/dashboard/profile/slices/bank';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock necessary dependencies
vi.mock('@src/hooks/store', () => ({
    useAppDispatch: vi.fn(),
    useAppSelector: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/hooks/useBankApi', () => ({
    default: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/slices/bank', () => ({
    setData: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/components/BankModal', () => ({
    __esModule: true,
    default: ({ open, handleCancel }: any) =>
        open && <div data-testid="bank-modal">Bank Modal</div>,
}));

vi.mock('@components/molecular/modals/ConfirmationModal', () => ({
    __esModule: true,
    default: ({ isOpen, handleCancel, handleSubmit }: any) =>
        isOpen && (
            <button type="button" data-testid="confirmation-modal" onClick={handleSubmit}>
                Confirmation Modal
            </button>
        ),
}));

describe('BankAccounts Component', () => {
    const mockStore = configureStore([]);
    const mockDispatch = vi.fn();
    const initialStoreState = {
        reducer: {
            bank: { id: 1 },
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockReturnValue({ id: 1 });
        (useBankApi as any).mockReturnValue({
            tableData: [],
            isLoading: false,
            isDeleteLoading: false,
            handleDeleteBank: vi.fn(),
            handleAddBank: vi.fn(),
            handleUpdateBank: vi.fn(),
        });
    });

    const renderComponent = async (storeState = initialStoreState) => {
        const store = mockStore(storeState);
        await act(async () => {
            render(
                <Provider store={store}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <BankAccounts />
                    </Suspense>
                </Provider>
            );
        });
    };

    test('renders without crashing', async () => {
        await renderComponent();
        const headings = screen.getAllByText(/Bank Accounts/i);
        expect(headings.length).toBeGreaterThan(0);
    });

    test('displays empty state when no bank accounts are present', async () => {
        await renderComponent();
        expect(screen.getByText(/No bank accounts saved/i)).toBeInTheDocument();
    });

    test('calls showToast when trying to add more than 5 bank accounts', async () => {
        (useBankApi as any).mockReturnValue({
            tableData: Array(5).fill({
                id: 1,
                bankName: 'Bank',
                accountNumber: '12345',
                default: false,
            }),
            isLoading: false,
            isDeleteLoading: false,
            handleDeleteBank: vi.fn(),
        });

        await renderComponent();
        const addButton = screen.getByRole('button', { name: /Add Account/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(
                showToast(
                    expect.objectContaining({
                        description: expect.stringContaining(
                            'Oops! You’ve reached the maximum limit'
                        ),
                        variant: 'warning',
                    })
                )
            );
        });
    });

    test('opens BankModal when Add Account button is clicked and bank count is under limit', async () => {
        await renderComponent();

        const addButton = screen.getByRole('button', { name: /Add Account/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(setData({ id: 0 }));
            expect(screen.getByTestId('bank-modal')).toBeInTheDocument();
        });
    });

    test('opens ConfirmationModal when delete button is clicked', async () => {
        (useBankApi as any).mockReturnValue({
            tableData: [{ id: 1, bankName: 'Bank', accountNumber: '12345', default: false }],
            isLoading: false,
            isDeleteLoading: false,
            handleDeleteBank: vi.fn(),
        });

        await renderComponent();
        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(setData({ id: 1 }));
            expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
        });
    });

    test('calls handleDeleteBank when confirming deletion in ConfirmationModal', async () => {
        const handleDeleteBank = vi.fn();
        (useBankApi as any).mockReturnValue({
            tableData: [{ id: 1, bankName: 'Bank', accountNumber: '12345', default: false }],
            isLoading: false,
            isDeleteLoading: false,
            handleDeleteBank,
        });

        await renderComponent();
        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);
        const confirmButton = screen.getByTestId('confirmation-modal');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(handleDeleteBank).toHaveBeenCalledWith(1);
        });
    });
});
