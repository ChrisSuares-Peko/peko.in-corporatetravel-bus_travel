import { useNavigate } from 'react-router-dom';

import { UserRole } from '@customtypes/general';
import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { loginSuccess } from '../slices/loginSlice';
import { LoginRequest } from '../types';

export default function useLoginApi() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // PROTOTYPE MODE: no API calls, no validation — fake a corporate user and go to dashboard.
    const handleLogin = async (payload: LoginRequest) => {
        dispatch(
            loginSuccess({
                token: 'prototype-token',
                refreshToken: 'prototype-refresh',
                sessionId: 'prototype-session',
                isAuthenticated: true,
                role: UserRole.CORPORATE,
                roleName: 'corporate',
                id: 1,
                username: payload?.username || 'prototype-user',
                corporateId: 1,
                redirectUrl: '',
            })
        );
        navigate(paths.dashboard.home, { replace: true });
    };

    return { handleLogin };
}
