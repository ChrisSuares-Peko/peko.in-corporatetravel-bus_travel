import type { FC } from 'react';

import { Flex } from 'antd';

import LandingPageIcon from '@domains/dashboard/eSign/assets/landing.png';
import CommonIndividualLandingPage from '@domains/dashboard/IndividualPlan/pages/CommonIndividualLandingPage';
import ServiceNotPurchasedPage from '@domains/dashboard/IndividualPlan/pages/ServiceNotPurchased';
import { useAppSelector } from '@src/hooks/store';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { accessKeys } from '@utils/accessKeys';
import { packageAccessKeys } from '@utils/packageAccessKeys';

import ActionsHeader from '../components/landingPage/ActionsHeader';
import Features from '../components/landingPage/Features';
import SignDeskBranding from '../components/SignDeskBranding';
import { features } from '../utils';

interface LandingPageProps {}

const LandingPage: FC<LandingPageProps> = () => {
    const { eSign } = accessKeys;
    const isPurchased = useServiceAccess(eSign);
    const { user } = useAppSelector(state => state.reducer.user);
    if (!isPurchased && user?.roleName === 'corporate sub user') {
        return <ServiceNotPurchasedPage />;
    }
    return !isPurchased ? (
        <CommonIndividualLandingPage
            features={features}
            serviceKey={packageAccessKeys.eSign}
            svgIcon={LandingPageIcon}
            title="eSign"
            serviceName="eSign"
            description="The #1 way to digitally sign documents that are legally valid in UAE. Sign any type of document such as Offer Letters, Invoices, Contracts and more. Adopt eSign, get rid of paper and make your business faster, simpler and contribute positively to the environment."
        />
    ) : (
        <Flex vertical>
            <ActionsHeader />
            {/* <ESignHeader /> */}
            <Features />
            <SignDeskBranding position="center" />
        </Flex>
    );
};

export default LandingPage;
