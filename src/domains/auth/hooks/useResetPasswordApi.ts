import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { ResetPassword } from '../api';
import { ResetPasswordRequest } from '../types';

export default function useResetPasswordApi() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const handleResettPassword = async (values: ResetPasswordRequest) => {
        setIsLoading(true);
        const response: SuccessGenericResponse<{}> | false = await ResetPassword(values);
        if (response) {
            navigate(paths.auth.passwordSuccess, {
                state: {
                    isForgot: values.isForgot,
                },
            });
        } else {
            dispatch(
                showToast({
                    description: 'Something went wrong',
                    variant: 'error',
                })
            );
        }
        setIsLoading(false);
    };

    return { handleResettPassword, isLoading };
}
