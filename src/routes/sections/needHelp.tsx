import { lazy } from 'react';

import { paths } from '../paths';

const NeedHelp = lazy(() => import('@src/domains/dashboard/needHelp/pages/NeedHelp'));
const FAQ = lazy(() => import('@src/domains/dashboard/needHelp/pages/FAQ'));

// -----------------------------------------------------------------------

export const needHelpRoutes = [
    { element: <NeedHelp />, index: true },
    { element: <FAQ />, path: paths.needHelp.faq },
];
