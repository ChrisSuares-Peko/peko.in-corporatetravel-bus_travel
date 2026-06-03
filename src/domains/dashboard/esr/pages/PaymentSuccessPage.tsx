import React from 'react';

import { paths } from '@src/routes/paths';

import SuccessScreen from '../components/Stages/PaymentSuccess';

type Props = {};
const PaymentSuccessPage = (props: Props) => (
    <SuccessScreen
        title="Your Payment is Successful"
        ButtonTxt="Start"
        ButtonLink={paths.esr.registrationAssessment}
    />
);

export default PaymentSuccessPage;
