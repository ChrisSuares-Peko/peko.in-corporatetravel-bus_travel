import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { leaveUpdate } from '../../api/leaveApis';
import { LeaveRequestFormType, LeaveTableRow } from '../../types/leaveSection';

export function useUpdateLeave(handleCancel?: () => void) {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const updateLeavebyId = useCallback(
        async (values: LeaveRequestFormType, leaveData: LeaveTableRow) => {
            const payload = {
                ...values,
                leaveId: leaveData.id,
                leaveSupportingDocs: values.leaveSupportingDocs
                    ? {
                          base64: values.leaveSupportingDocs,
                          format: values.supportingDocFormat,
                      }
                    : leaveData.leaveSupportingDocs,
            };
            const data = await leaveUpdate({
                ...payload,
                userId: id,
                userType: role,
            });
            if (data) {
                dispatch(
                    showToast({ variant: 'success', description: 'Leave updated successfully' })
                );
                if (handleCancel) handleCancel();
            }
            // dispatch(showToast({variant:'error',description:'Failed to update the leave.Please try again'}))
        },
        [id, role, dispatch, handleCancel]
    );
    return { updateLeavebyId };
}
