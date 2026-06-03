import { lazy } from 'react';

const Perks = lazy(() => import('@src/domains/dashboard/perks/pages/Perks'));

// -----------------------------------------------------------------------

export const perksRoutes = [{ element: <Perks />, index: true }];
