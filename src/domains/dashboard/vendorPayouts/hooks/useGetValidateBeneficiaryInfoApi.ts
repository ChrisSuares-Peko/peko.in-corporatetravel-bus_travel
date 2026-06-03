import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { validateBeneficiaryInformation } from '../api';
import { validateBeneficiaryInformationPayload } from '../types/types';

export function useValidateBeneficiaryApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();

    const validateBeneficiary = async (payload: validateBeneficiaryInformationPayload) => {
        setIsLoading(true);

        const response = await validateBeneficiaryInformation({
            ...payload,
            userId: id,
            userType: role,
        });

        if (response.data?.status) {
            return response;
        }

        dispatch(
            showToast({
                variant: 'error',
                description: response?.data?.message || response.errorMessage,
            })
        );

        setIsLoading(false);
        return response.errorMessage;
    };

    return { validateBeneficiary, isLoading };
}
