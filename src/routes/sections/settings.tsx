import { lazy } from 'react';

import { paths } from '../paths';

const Settings = lazy(() => import('@src/domains/dashboard/settings/pages/Settings'));
const FAQ = lazy(() => import('@src/domains/dashboard/needHelp/pages/FAQ'));

// -----------------------------------------------------------------------

export const settingsRoutes = [
    { element: <Settings />, index: true },
    { element: <FAQ />, path: paths.needHelp.faq },
];
