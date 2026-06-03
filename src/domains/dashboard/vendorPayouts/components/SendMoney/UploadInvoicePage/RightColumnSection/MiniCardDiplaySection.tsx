/* eslint-disable react/prop-types */

import { BeneficiaryData } from '@src/domains/dashboard/vendorPayouts/types/types';

import EmptyMiniCard from '../VendorMiniCard/EmptyMiniCard';
import MiniCard from '../VendorMiniCard/MiniCard';

const MiniCardDisplay: React.FC<{
    selectedBeneficiary: BeneficiaryData | null;
}> = ({ selectedBeneficiary }) =>
    selectedBeneficiary ? <MiniCard beneficiariesData={selectedBeneficiary} /> : <EmptyMiniCard />;

export default MiniCardDisplay;
