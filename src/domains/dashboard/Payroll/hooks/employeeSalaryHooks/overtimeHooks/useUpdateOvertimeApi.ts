import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { overtimeUpdate } from '../../../api/employeeSalaryApi/overtimeApi';
import {
    createOvertimePayload,
    overtimeTable,
} from '../../../types/salaryProfileTypes/overtimeTypes';

export function useUpdateOvertime() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();

    const updateOvertimeId = async (
        payload: createOvertimePayload,
        selectedRowData: overtimeTable
    ) => {
        const data = await overtimeUpdate({
            ...payload,
            overtimeId: selectedRowData.id,
            userId: id,
            userType: role,
        });
        if (data) {
            dispatch(
                showToast({
                    description: 'Overtime updated succesfully',
                    variant: 'success',
                })
            );
        }
    };

    return { updateOvertimeId };
}
