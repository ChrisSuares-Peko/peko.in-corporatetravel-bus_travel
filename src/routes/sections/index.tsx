import { lazy } from 'react';

import { Navigate, useRoutes } from 'react-router-dom';

import { useRootPath } from '@src/hooks/useRootPath';

// eslint-disable-next-line import/no-cycle
import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { planRoutes } from './plans';
import { systemUserRoutes } from './systemUser';

const PageNotFound = lazy(() => import('@src/domains/failed/pages/PageNotFound'));

export default function Router() {
    const rootPath = useRootPath();

    return useRoutes([
        {
            path: '/',
            element: <Navigate to={rootPath} replace />,
        },

        // Auth routes
        ...authRoutes,

        // Dashboard routes
        ...dashboardRoutes,

        // Subscription routes
        ...planRoutes,

        // System User routes
        ...systemUserRoutes,

        // No match 404
        { path: '/404', element: <PageNotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
    ]);
}
