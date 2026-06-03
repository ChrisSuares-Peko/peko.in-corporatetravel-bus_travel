import type { FC } from 'react';

import SuccessScreen from '@components/molecular/success/SuccessScreen';
import { paths } from '@src/routes/paths';

interface SuccessPageProps {}

const SuccessPage: FC<SuccessPageProps> = () => (
    <SuccessScreen
        title="Your document has been successfully sent to the signer(s)."
        message="You can check the status of the eSign by clicking on the button below or Go Back to initiate another eSign."
        firstButtonTxt="Check e-Sign Status"
        firstBtnLink={`${paths.dashboard.eSign}/${paths.eSign.historyPage}`}
        secondButtonTxt="Go Back"
        secondBtnLink={paths.dashboard.eSign}
    />
);

export default SuccessPage;
