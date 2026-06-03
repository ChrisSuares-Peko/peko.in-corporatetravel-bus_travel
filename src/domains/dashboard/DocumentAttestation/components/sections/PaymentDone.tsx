import { Button, Flex, Typography } from 'antd';
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';

import animation from '@assets/success-animation.json';

const { Title } = Typography;
const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

const PaymentDone = () => (
    <Flex vertical align="center" justify="center" gap={15} className="text-center h-[28rem] ">
        <Lottie options={defaultOptions} height={100} width={100} />
        <Title level={3}>Your payment is done</Title>
        <Typography.Text className="w-[23rem] md:w-[40rem]">
            Your order for Document attestation service has been successfully placed. Our
            representative will be dispatched to collect the document from the provided address.
        </Typography.Text>
        <Flex gap={25}>
            <Link to="/payments" className="hidden md:flex">
                <Button type="primary" danger size="small">
                    Go to bill payments
                </Button>
            </Link>
            <Link to="/bill-summary" className="flex md:hidden">
                <Button type="primary" danger size="small">
                    Go to bill payments
                </Button>
            </Link>
            <Button type="default" size="small">
                Download Receipt
            </Button>
        </Flex>
    </Flex>
);

export default PaymentDone;
