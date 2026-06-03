import { useCallback, useState } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { statusUpdate } from '../api';

export default function useTracker() {
    const { id, role } = useAppSelector(store => store.reducer.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<any>([]);

    const updateStatus = useCallback(
        async (value: string, invoiceId: number) => {
            const response: any = await statusUpdate({
                userId: id,
                userType: role,
                status: value,
                id: invoiceId,
            });

            if (response) {
                dispatch(
                    showToast({
                        description: 'Status updated successfully',
                        variant: 'success',
                    })
                );
            }
            return response;
        },
        [dispatch, id, role]
    );

    return { updateStatus };
}
