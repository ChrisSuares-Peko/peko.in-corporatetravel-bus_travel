import { Flex } from 'antd';

import HealthCheckBody from '../components/businessHealthCheck/HealthCheckBody';
import HealthCheckHeader from '../components/businessHealthCheck/HealthCheckHeader';

const VATRegistration: React.FC = () => (
    <Flex className="mt-8" gap={40} vertical>
        <HealthCheckHeader />
        <HealthCheckBody />
    </Flex>
);

export default VATRegistration;
