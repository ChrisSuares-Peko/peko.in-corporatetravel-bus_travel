import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { incentiveUpdate } from '../../../api/employeeSalaryApi/incentiveApi';
import { updateIncentivesPayload } from '../../../types/salaryProfileTypes/incentiveTypes';

export function useUpdateIncentive() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();

    const updateIncentiveId = async (payload: updateIncentivesPayload) => {
        const data = await incentiveUpdate({
            ...payload,
            userId: id,
            userType: role,
        });
        if (data) {
            dispatch(
                showToast({
                    description: 'Incentive updated succesfully',
                    variant: 'success',
                })
            );
        }
        return data;
    };

    return { updateIncentiveId };
}
