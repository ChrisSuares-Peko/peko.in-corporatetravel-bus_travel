// useRootPath hook
import { UserRole } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

export const useRootPath = () => {
    const { role, redirectUrl } = useAppSelector(state => state.reducer.auth);

    switch (role) {
        case UserRole.CORPORATE: {
            if (redirectUrl === '') return paths.dashboard.home;
            return redirectUrl;
        }
        case UserRole.SYSTEM:
            return paths.systemUser.dashboard;
        default:
            return '/auth/login';
    }
};
