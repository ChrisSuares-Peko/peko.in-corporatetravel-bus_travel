import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { submitKYBDetails } from '../api/kyb';

export default function useSubmitKYB() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { kybDetails } = useAppSelector(state => state.reducer.vendorBeneficiary);
    const dispatch = useAppDispatch();
    const [submitLoading, setSubmitLoading] = useState(false);

    const handleSubmitKYB = async (ownerInformation: any) => {
        console.log(ownerInformation, 'owner info hooks');

        setSubmitLoading(true);
        const payload = {
            ...kybDetails,
            ...ownerInformation,
            userId: id,
            userType: role,
        };

        const data = await submitKYBDetails(payload);
        if (data && data.data) {
            dispatch(
                showToast({
                    description: data.message,
                    variant: 'success',
                })
            );
        }
        setSubmitLoading(false);
        return data;
    };

    return { handleSubmitKYB, submitLoading };
}
