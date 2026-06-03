import { useCallback, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { setRedirectUrl } from '../domains/auth/slices/loginSlice';

type AuthGuardProps = {
    children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();

    const { isAuthenticated } = useAppSelector(state => state.reducer.auth);

    const [checked, setChecked] = useState(false);

    const check = useCallback(() => {
        if (!isAuthenticated) {
            dispatch(setRedirectUrl(pathname));
            const href = paths.auth.jwt.login;
            navigate(href, { replace: true });
        } else {
            setChecked(true);
        }
    }, [dispatch, isAuthenticated, navigate, pathname]);

    useEffect(() => {
        check();
    }, [check]);

    if (!checked) {
        return null;
    }

    return <>{children}</>;
}
