import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { validateEmployeeInformation } from '../../api/employeeApi';
import { validateEmployeeInformationPayload } from '../../types/type';

export function useValidateEmployeeApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const validateEmployee = async (payload: validateEmployeeInformationPayload) => {
        setIsLoading(true);

        const response = await validateEmployeeInformation({
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

        // Use the error message from the catch block of createEmployee

        setIsLoading(false);
        return response.errorMessage;
    };

    return { validateEmployee, isLoading };
}
