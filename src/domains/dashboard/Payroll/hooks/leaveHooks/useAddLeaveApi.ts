import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { addLeave } from '../../api/leaveApis';
import { LeaveRequestFormType } from '../../types/leaveSection';

export function useAddLeave(handleCancel?: () => void) {
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const dispatch = useAppDispatch();
    const addLeaveData = useCallback(
        async (values: LeaveRequestFormType) => {
            const payload = {
                ...values,
                leaveSupportingDocs: values.leaveSupportingDocs
                    ? {
                          base64: values.leaveSupportingDocs,
                          format: values.supportingDocFormat,
                      }
                    : null,
            };
            const data = await addLeave({
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
    return { addLeaveData };
}
