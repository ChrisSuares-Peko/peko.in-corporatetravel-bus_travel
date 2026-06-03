import { useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { updateStatus } from '../../api/collectorKyb';
import { ChangeStatusPayload } from '../../types/collectorKyb';

export default function useUpdateKybStatus(
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
) {
    const [isLoading, setIsLoading] = useState(false);
    const { role, id } = useAppSelector(state => state.reducer.auth);

    const dispatch = useAppDispatch();

    const statusUpdate = useCallback(
        async ({ corporateUserId, status }: ChangeStatusPayload) => {
            setIsLoading(true);
            const data: {} | false = await updateStatus({
                userId: id,
                userType: role,
                status,
                corporateUserId,
            });
            if (data) {
                dispatch(
                    showToast({
                        description: 'Status updated successfully',
                        variant: 'success',
                    })
                );
                setRefresh(true);
            }
            setIsLoading(false);
        },
        [dispatch, id, role, setRefresh]
    );
    return { statusUpdate, isLoading };
}
