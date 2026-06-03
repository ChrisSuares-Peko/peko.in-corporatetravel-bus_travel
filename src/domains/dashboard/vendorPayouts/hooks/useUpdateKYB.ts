import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { updateKybDetails } from '../api/kyb';

export function useUpdateKYB() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { kybDetails } = useAppSelector(state => state.reducer.vendorBeneficiary);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const updateKYBData = async (ownerInformation: any, kybId: string) => {
        setIsLoading(true);
        const payload = {
            ...kybDetails,
            ...ownerInformation,
            kybId,
            userId: id,
            userType: role,
        };
        const data = await updateKybDetails(payload);
        if (data && data.data) {
            dispatch(
                showToast({
                    description: data.message,
                    variant: 'success',
                })
            );
        }
        setIsLoading(false);
        return data;
    };
    return { updateKYBData, isLoading };
}
