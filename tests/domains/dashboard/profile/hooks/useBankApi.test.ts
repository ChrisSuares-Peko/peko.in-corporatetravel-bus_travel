import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

import { addBank, deleteBank, getBanks, updateBank } from '@src/domains/dashboard/profile/api/bank';
import useBankApi from '@src/domains/dashboard/profile/hooks/useBankApi';
import { setData } from '@src/domains/dashboard/profile/slices/bank';
import {
    AddBankRequestPayload,
    AddBankResponse,
    BankListResponse,
    UpdateBankRequestPayload,
    BankDetail,
} from '@src/domains/dashboard/profile/types/index';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

// Mock functions
vi.mock('@src/hooks/store', () => ({
    useAppSelector: vi.fn(),
    useAppDispatch: vi.fn(),
}));

vi.mock('@src/slices/apiSlice', () => ({
    showToast: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/api/bank', () => ({
    addBank: vi.fn(),
    deleteBank: vi.fn(),
    getBanks: vi.fn(),
    updateBank: vi.fn(),
}));

vi.mock('@src/domains/dashboard/profile/slices/bank', () => ({
    setData: vi.fn(),
}));

describe('useBankApi', () => {
    const mockDispatch = vi.fn();
    const mockState = {
        reducer: {
            auth: {
                role: 'user',
                id: '123',
                refresh: false,
                data: null,
                isLoading: false,
                isEditLoading: false,
            },
            bank: {
                refresh: false,
                tableData: [],
                isLoading: false,
                isDeleteLoading: false,
                isEditLoading: false,
            },
        },
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAppDispatch as any).mockReturnValue(mockDispatch);
        (useAppSelector as any).mockImplementation((selector: (state: typeof mockState) => any) =>
            selector(mockState)
        );
    });

    it('should fetch bank list and update state', async () => {
        const mockBankDetail: BankDetail = {
            id: 1,
            accountHolderName: 'John Doe',
            accountNumber: '123456789',
            bankName: 'Example Bank',
            iban: 'EX123456789',
            status: 1,
            default: 1,
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            credentialId: 1,
            swiftCode: 'EXAMP123',
            accountType: 'Savings',
        };

        const mockResponse: BankListResponse = {
            data: [mockBankDetail],
        };

        (getBanks as any).mockResolvedValue(mockResponse);

        renderHook(() => useBankApi({}));

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(setData({ tableData: [], isLoading: true }));
            expect(mockDispatch).toHaveBeenCalledWith(
                setData({ tableData: [mockBankDetail], isLoading: false })
            );
            expect(getBanks).toHaveBeenCalledWith({ userId: '123', userType: 'user' });
        });
    });

    it('should handle fetch bank list failure gracefully', async () => {
        (getBanks as any).mockResolvedValue(false);

        renderHook(() => useBankApi({}));

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(setData({ tableData: [], isLoading: true }));
            expect(mockDispatch).toHaveBeenCalledWith(setData({ tableData: [], isLoading: false }));
            expect(getBanks).toHaveBeenCalledWith({ userId: '123', userType: 'user' });
        });
    });

    it('should handle deleting a bank', async () => {
        (deleteBank as any).mockResolvedValue(true);
        const handleCancel = vi.fn();

        const { result } = renderHook(() => useBankApi({ handleCancel }));

        await act(async () => {
            await result.current.handleDeleteBank(1);
        });

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(setData({ isDeleteLoading: true }));
            expect(deleteBank).toHaveBeenCalledWith({ userType: 'user', userId: '123', id: 1 });
            expect(mockDispatch).toHaveBeenCalledWith(
                setData({ refresh: true, isDeleteLoading: false, id: 0 })
            );
            expect(handleCancel).toHaveBeenCalled();
            expect(showToast).toHaveBeenCalledWith({
                description: 'Bank Account deleted successfully',
                variant: 'success',
            });
        });
    });

    it('should handle adding a bank', async () => {
        const mockPayload: AddBankRequestPayload = {
            accountHolderName: 'John Doe',
            accountNumber: '123456789',
            bankName: 'Example Bank',
            swiftCode: 'EXAMP123',
            iban: 'EX123456789',
            credentialId: '1',
            bankBranch: '',
            default: false,
            otp: '',
            scope: '',
            selectedId: '',
            userId: 0,
            userType: '',
        };

        const mockResponse: AddBankResponse = {
            status: true,
            id: 1,
            accountHolderName: 'John Doe',
            bankName: 'Example Bank',
            accountNumber: '123456789',
            credentialId: '1',
            ifscCode: 'EX123',
            default: true,
            updatedAt: '2023-01-01T00:00:00Z',
            createdAt: '2023-01-01T00:00:00Z',
        };

        (addBank as any).mockResolvedValue(mockResponse);
        const handleCancel = vi.fn();
        const handleOtpClose = vi.fn();

        const { result } = renderHook(() => useBankApi({ handleCancel, handleOtpClose }));

        await act(async () => {
            await result.current.handleAddBank(mockPayload);
        });

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(setData({ isEditLoading: true }));
            expect(addBank).toHaveBeenCalledWith(mockPayload);
            expect(mockDispatch).toHaveBeenCalledWith(
                setData({ refresh: true, isLoading: false, isEditLoading: false })
            );
            expect(handleOtpClose).toHaveBeenCalled();
            expect(handleCancel).toHaveBeenCalled();
            expect(showToast).toHaveBeenCalledWith({
                description: 'Bank Account added successfully',
                variant: 'success',
            });
        });
    });

    it('should handle updating a bank', async () => {
        const mockPayload: UpdateBankRequestPayload = {
            id: 1,
            accountHolderName: 'John Doe',
            accountNumber: '123456789',
            bankName: 'Example Bank',
            swiftCode: 'EXAMP123',
            iban: 'EX123456789',
            credentialId: '1',
            bankBranch: '',
            default: false,
            otp: '',
            scope: '',
            selectedId: '',
            userId: 0,
            userType: '',
        };

        const mockResponse: AddBankResponse = {
            status: true,
            id: 1,
            accountHolderName: 'John Doe',
            bankName: 'Example Bank',
            accountNumber: '123456789',
            credentialId: '1',
            ifscCode: 'EX123',
            default: true,
            updatedAt: '2023-01-01T00:00:00Z',
            createdAt: '2023-01-01T00:00:00Z',
        };

        (updateBank as any).mockResolvedValue(mockResponse);
        const handleCancel = vi.fn();
        const handleOtpClose = vi.fn();

        const { result } = renderHook(() => useBankApi({ handleCancel, handleOtpClose }));

        await act(async () => {
            await result.current.handleUpdateBank(mockPayload);
        });

        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(setData({ isEditLoading: true }));
            expect(updateBank).toHaveBeenCalledWith(mockPayload);
            expect(mockDispatch).toHaveBeenCalledWith(
                setData({ refresh: true, isLoading: false, isEditLoading: false })
            );
            expect(handleOtpClose).toHaveBeenCalled();
            expect(handleCancel).toHaveBeenCalled();
            expect(showToast).toHaveBeenCalledWith({
                description: 'Bank Account updated successfully',
                variant: 'success',
            });
        });
    });
});
