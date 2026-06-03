import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { createBonus } from '../../../api/employeeSalaryApi/bonusApi/index';
import { createBonusPayload } from '../../../types/salaryProfileTypes/bonustypes/index';

export default function useBonusCreate(handleCancel?: () => void) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();

    const handleBonusCreation = useCallback(
        async (payload: createBonusPayload) => {
            const data = await createBonus({
                ...payload,
                userId: id,
                userType: role,
            });

            if (data && data.data) {
                dispatch(
                    showToast({
                        description: data.message,
                        variant: 'success',
                    })
                );
                if (handleCancel) handleCancel();
            }
            return data;
        },
        [id, role, dispatch, handleCancel]
    );
    return { handleBonusCreation };
}
