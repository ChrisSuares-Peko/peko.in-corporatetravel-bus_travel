import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import AccessDenied from '@src/domains/failed/pages/AccessDenied';
import { checkSidebarkAccess } from '@utils/checkAccess';

type RoleGuardProps = {
    children: React.ReactNode;
};

export default function RoleGuard({ children }: RoleGuardProps) {
    const navigate = useNavigate();
    const key = window.location.pathname.toLocaleLowerCase().split('/');
    const hasAccess = checkSidebarkAccess(key[2]);
    const [grantAccess, setGrantAccess] = useState<any>(null);

    const checkRole = useCallback(() => {
        if (hasAccess) {
            setGrantAccess(true);
        } else setGrantAccess(false);
    }, [hasAccess]);

    useEffect(() => {
        checkRole();
    }, [checkRole]);

    if (!grantAccess && grantAccess !== null) {
        return <AccessDenied />;
    }

    return <>{children}</>;
}
