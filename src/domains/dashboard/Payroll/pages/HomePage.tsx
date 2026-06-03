/* eslint-disable no-nested-ternary */
import React from 'react';

import CommonIndividualLandingPage from '@domains/dashboard/IndividualPlan/pages/CommonIndividualLandingPage';
import ServiceNotPurchasedPage from '@domains/dashboard/IndividualPlan/pages/ServiceNotPurchased';
import LandingPageImg from '@domains/dashboard/Payroll/assets/images/purchase-page/LandingPageImg.png';
import { useAppSelector } from '@src/hooks/store';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { accessKeys } from '@utils/accessKeys';
import { packageAccessKeys } from '@utils/packageAccessKeys';

import LandingPage from './LandingPage';
import { features } from '../utils/purchase-payroll';

const HomePage = () => {
    const isPurchased = useServiceAccess(accessKeys.payroll);
    const { user } = useAppSelector(state => state.reducer.user);
    if (!isPurchased && user?.roleName === 'corporate sub user') {
        return <ServiceNotPurchasedPage />;
    }
    return !isPurchased ? (
        <CommonIndividualLandingPage
            features={features}
            serviceKey={packageAccessKeys.Payroll}
            serviceName="Payroll"
            svgIcon={LandingPageImg}
            title="Simple HR & Payroll Solution"
            // subDescription="Smart tools for efficient and personalized payroll management"
            subDescription=""
            description="Say goodbye to the hassle of HR tasks with our user-friendly platform. Let the intuitive system take charge, ensuring accuracy and efficiency in handling all your payroll needs. Automate processes, streamline workforce management and increase overall efficiency like never before."
        />
    ) : (
        <LandingPage />
    );
};

export default HomePage;
