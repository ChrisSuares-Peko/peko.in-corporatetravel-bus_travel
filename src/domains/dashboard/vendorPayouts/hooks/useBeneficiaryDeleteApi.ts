import { useState, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { deleteBeneficiary } from '../api/BeneficiaryRegistrationApis';

interface useDeleteBeneficiaryApiProps {
    handleCancel?: () => void;
}

export const useDeleteBeneficiaryApi = ({ handleCancel }: useDeleteBeneficiaryApiProps) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const deleteBeneficiaryData = useCallback(
        async (bId: string) => {
            setIsLoading(true);
            try {
                const data = await deleteBeneficiary({
                    userId: id,
                    userType: role,
                    bId,
                });

                if (data && data.status) {
                    dispatch(showToast({ variant: 'success', description: data.message }));

                    if (handleCancel) {
                        handleCancel();
                    }
                    return true;
                }
                dispatch(
                    showToast({
                        variant: 'error',
                        description: 'Failed to delete the beneficiary.Please try again',
                    })
                );
                return false;
            } catch (error) {
                dispatch(
                    showToast({
                        variant: 'error',
                        description: 'Failed to delete the beneficiary.Please try again',
                    })
                );
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [dispatch, handleCancel, id, role]
    );

    return { deleteBeneficiaryData, isLoading };
};
