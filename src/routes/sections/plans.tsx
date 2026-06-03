import { Suspense, lazy } from 'react';

import { Skeleton } from 'antd';
import { Outlet } from 'react-router-dom';

import { paths } from '@routes/paths';
import AuthGuard from '@src/guard/AuthGuard';
import CorporateUserGuard from '@src/guard/CorporateUserGuard';
// import IdleGuard from '@src/guard/IdleGuard';

const PaymentSuccess = lazy(() => import('@src/domains/dashboard/plans/pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('@src/domains/dashboard/plans/pages/PaymentFailure'));

const PlansIndex = lazy(() => import('@src/domains/dashboard/plans/pages/PlansIndex'));
const ReviewOrder = lazy(() => import('@src/domains/dashboard/plans/pages/ReviewOrder'));

export const planRoutes = [
    {
        path: '/plans',
        element: (
            <AuthGuard>
                <CorporateUserGuard>
                    {/* <IdleGuard> */}
                    <Suspense fallback={<Skeleton />}>
                        <Outlet />
                    </Suspense>
                    {/* </IdleGuard> */}
                </CorporateUserGuard>
            </AuthGuard>
        ),
        children: [
            { element: <PlansIndex />, index: true },
            { element: <ReviewOrder />, path: paths.plans.reviewOrder },
            { element: <PaymentSuccess />, path: paths.plans.paymentsuccess },
            { element: <PaymentFailure />, path: paths.plans.paymentFailure },
        ],
    },
];
