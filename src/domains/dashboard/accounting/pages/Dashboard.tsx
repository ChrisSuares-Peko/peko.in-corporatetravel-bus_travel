import LandingPageImg from '@src/assets/images/LandingPageImg.png';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { accessKeys } from '@utils/accessKeys';
import { packageAccessKeys } from '@utils/packageAccessKeys';

import CommonIndividualLandingPage from '../../IndividualPlan/pages/CommonIndividualLandingPage';
import LandingPage from '../components/LandingPage';
import { accountingFeatures } from '../utils/features';

type Props = {};

const Dashboard = (props: Props) => {
    const { taxRegistration } = accessKeys;
    const isPurchased = useServiceAccess(taxRegistration);

    return !isPurchased ? (
        <CommonIndividualLandingPage
            features={accountingFeatures}
            serviceKey={packageAccessKeys['Tax & More']} // accessKey
            // packageName={} // packageName any one is required (serviceKey / packageName)
            title="Tax & More"
            serviceName="Accounting"
            svgIcon={LandingPageImg}
            description="Tax & More services simplify financial management, save time, and ensure compliance with automated bookkeeping and expert tax advice. Streamline your accounting processes effortlessly and stay ahead with accurate, timely financial insights."
        />
    ) : (
        <LandingPage />
    );
};

export default Dashboard;
