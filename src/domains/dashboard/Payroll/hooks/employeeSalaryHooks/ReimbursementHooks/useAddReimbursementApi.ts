import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { createReimbursement } from '../../../api/employeeSalaryApi/ReimbursementApi/index';
import { ReimbursementRequestFormType } from '../../../types/salaryProfileTypes/ReimbursementTypes';

export default function useReimbursementCreate(handleCancel?: () => void) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const handleReimbursementCreation = useCallback(
        async (values: ReimbursementRequestFormType) => {
            const payload = {
                ...values,
                supportingDocs: values.supportingDocs
                    ? {
                          base64: values.supportingDocs,
                          format: values.supportingDocFormat,
                      }
                    : null,
                transferMethod: 'SALARY',
            };
            const data = await createReimbursement({
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
    return { handleReimbursementCreation };
}
