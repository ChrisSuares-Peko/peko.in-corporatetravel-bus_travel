import { Flex, Image, Typography } from 'antd';

import PaymentStatusImg from '@domains/dashboard/carbonFootprint/assets/images/payemtStatus.png';

import PaymentStatusTable from '../components/PaymentStatusTable';
import SocialLinks from '../components/SocialLinks';

type Props = {};

const PaymentStatus = (props: Props) => (
    <Flex gap={40} vertical align="center">
        <Image src={PaymentStatusImg} preview={false} style={{ maxWidth: '70%', margin: 'auto' }} />
        <Typography.Text className="text-sm sm:text-lg w-full sm:w-6/12 text-center">
            Great, You have made investments in carbon-neutral initiatives with the goal of building
            a better world for future generations.
        </Typography.Text>

        <PaymentStatusTable />

        <Typography.Text className="text-lg md:text-2xl text-red-500">
            Download Certificate
        </Typography.Text>
        <Flex justify="center" align="center" gap={10} vertical>
            <Typography.Text className="text-sm md:text-xl text-green-900">
                Share the certificate
            </Typography.Text>
            <SocialLinks />
        </Flex>
    </Flex>
);

export default PaymentStatus;
