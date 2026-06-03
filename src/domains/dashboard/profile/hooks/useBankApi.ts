import { useCallback, useEffect } from 'react';

import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { addBank, deleteBank, getBanks, updateBank } from '../api/bank';
import { setData } from '../slices/bank';
import {
    AddBankRequestPayload,
    AddBankResponse,
    BankListResponse,
    UpdateBankRequestPayload,
    updateResponse,
} from '../types';

interface useBankApiProps {
    handleCancel?: () => void;
    handleOtpClose?: () => void;
}

export default function useBankApi({ handleCancel, handleOtpClose }: useBankApiProps) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { refresh, tableData, isLoading, isDeleteLoading, isEditLoading } = useAppSelector(
        state => state.reducer.bank
    );

    const dispatch = useAppDispatch();
    const getBankList = useCallback(async () => {
        dispatch(setData({ tableData: [], isLoading: true }));
        const data: BankListResponse | false = await getBanks({
            userId: id,
            userType: role,
        });
        if (data) {
            const bankData = data as BankListResponse;
            const arr = bankData?.data?.sort((a, b) => b.default - a.default);

            dispatch(setData({ tableData: arr, isLoading: false }));
        } else {
            dispatch(setData({ tableData: [], isLoading: false }));
        }
    }, [id, role, dispatch]);

    const handleDeleteBank = async (itemId: number) => {
        dispatch(setData({ isDeleteLoading: true }));
        const response = await deleteBank({ userType: role, userId: id, id: itemId });
        if (response) {
            dispatch(setData({ refresh: !refresh, isDeleteLoading: false, id: 0 }));
            if (handleCancel) {
                handleCancel();
                dispatch(
                    showToast({
                        description: 'Bank Account deleted successfully',
                        variant: 'success',
                    })
                );
            }
        } else {
            dispatch(setData({ isDeleteLoading: false }));
            if (handleCancel) {
                handleCancel();
            }
        }
    };

    const handleAddBank = async (payload: AddBankRequestPayload) => {
        dispatch(setData({ isEditLoading: true }));
        const response: AddBankResponse | false = await addBank(payload);
        if (response) {
            dispatch(setData({ refresh: !refresh, isLoading: false, isEditLoading: false }));
            if (handleCancel && handleOtpClose) {
                handleOtpClose();
                handleCancel();
                dispatch(
                    showToast({
                        description: 'Bank Account added successfully',
                        variant: 'success',
                    })
                );
            }
        } else {
            dispatch(setData({ isEditLoading: false }));
            // if (handleOtpClose) {
            //     handleOtpClose();
            // }
        }
    };

    const handleUpdateBank = async (payload: UpdateBankRequestPayload) => {
        dispatch(setData({ isEditLoading: true }));
        const response: updateResponse | false = await updateBank(payload);
        if (response) {
            dispatch(setData({ refresh: !refresh, isLoading: false, isEditLoading: false }));
            if (handleCancel && handleOtpClose) {
                handleOtpClose();
                handleCancel();
                dispatch(
                    showToast({
                        description: 'Bank Account updated successfully',
                        variant: 'success',
                    })
                );
            }
        } else {
            dispatch(setData({ isEditLoading: false }));
            // if (handleOtpClose) {
            //     handleOtpClose();
            // }
        }
    };

    useEffect(() => {
        getBankList();
    }, [getBankList, refresh]);

    return {
        tableData,
        isLoading,
        refresh,
        isDeleteLoading,
        isEditLoading,
        handleDeleteBank,
        handleAddBank,
        handleUpdateBank,
    };
}
