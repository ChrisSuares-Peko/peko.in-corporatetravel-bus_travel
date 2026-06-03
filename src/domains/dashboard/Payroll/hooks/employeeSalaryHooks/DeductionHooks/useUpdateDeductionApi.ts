import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { updateDeduction } from '../../../api/employeeSalaryApi/deductionApi/index';
import {
    DeductionFormType,
    deductionTableType,
} from '../../../types/salaryProfileTypes/deductionTypes/index';

export function useUpdateDeduction(handleCancel: () => void) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();

    const deductionUpdate = async (
        values: DeductionFormType,
        deductionData: deductionTableType,
        employeeId: string
    ) => {
        const { deductionAmount, ...rest } = values;
        const payload = {
            ...rest,
            deductionAmount: Number(deductionAmount),
            employeeId,
            id: deductionData.id,
            userType: role,
        };
        const data = await updateDeduction({
            ...payload,
            userId: id,
            userType: role,
        });
        if (data) {
            handleCancel();
            dispatch(
                showToast({
                    description: 'Deduction updated successfully',
                    variant: 'success',
                })
            );
        }
    };

    return { deductionUpdate };
}
