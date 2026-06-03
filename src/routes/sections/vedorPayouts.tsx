import ActivateAccount from '@src/domains/dashboard/vendorPayouts/pages/ActivateAccount';
import Beneficiary from '@src/domains/dashboard/vendorPayouts/pages/BeneficiaryLandingPage';
import BeneficiaryReceives from '@src/domains/dashboard/vendorPayouts/pages/BeneficiaryReceives';
import EstimateCalculator from '@src/domains/dashboard/vendorPayouts/pages/EstimateCalculator';
import LandingPage from '@src/domains/dashboard/vendorPayouts/pages/LandingPage';
import RegisterBeneficiaryPage from '@src/domains/dashboard/vendorPayouts/pages/RegisterPage';
import UploadInvoice from '@src/domains/dashboard/vendorPayouts/pages/UploadInvoicePage';

import { paths } from '../paths';

export const vendorPayoutsRoutes = [
    { element: <LandingPage />, index: true },
    { element: <UploadInvoice />, path: paths.vendorPayouts.upload },
    {
        element: <BeneficiaryReceives />,
        path: `${paths.vendorPayouts.upload}/${paths.vendorPayouts.beneficiaryReceives}`,
    },
    { element: <Beneficiary />, path: paths.vendorPayouts.beneficiary },
    {
        element: <RegisterBeneficiaryPage />,
        path: `${paths.vendorPayouts.beneficiary}/${paths.vendorPayouts.registerBeneficiary}`,
    },
    { element: <EstimateCalculator />, path: paths.vendorPayouts.estimateCalculator },
    { element: <ActivateAccount />, path: paths.vendorPayouts.activateAccount },
];
