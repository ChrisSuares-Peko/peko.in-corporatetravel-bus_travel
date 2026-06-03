import { Flex } from 'antd';

import FailureScreen from '@src/components/molecular/failure/FailureScreen';
import SuccessScreen from '@src/components/molecular/success/SuccessScreen';

interface PaymentProps {
    paymentStatus?: Boolean;
}
const PaymentStatusPage = (paymentStatus: PaymentProps) => (
    <Flex justify="center" align="center">
        {paymentStatus ? <SuccessScreen /> : <FailureScreen />}
    </Flex>
);

export default PaymentStatusPage;
