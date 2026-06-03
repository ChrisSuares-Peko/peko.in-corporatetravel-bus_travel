import { Flex, Typography } from 'antd';

import CustomerDetails from '../components/forms/CustomerDetails';
import LicenseInformation from '../components/LicenseInformation';

const Details = () => (
    <Flex vertical className="px-0">
        <LicenseInformation />
        <Typography.Text className="my-5 text-base font-semibold leading-6">
            Enter Details
        </Typography.Text>
        <CustomerDetails />
    </Flex>
);

export default Details;
