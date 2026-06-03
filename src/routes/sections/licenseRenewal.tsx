import { lazy } from 'react';

import { paths } from '../paths';

const LicenseRenewalHome = lazy(() => import('@src/domains/dashboard/licenseRenewal/pages/Home'));
const LicenseRenewalDetails = lazy(
    () => import('@src/domains/dashboard/licenseRenewal/pages/Details')
);

// -----------------------------------------------------------------------

export const licenseRenewalRoutes = [
    { element: <LicenseRenewalHome />, index: true },
    { element: <LicenseRenewalDetails />, path: paths.licenseRenewal.details },
];
