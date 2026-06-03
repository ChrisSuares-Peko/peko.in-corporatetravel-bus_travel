import { Col, Row, Typography } from 'antd';

import FeaturesCard from '../components/LandingPage/FeaturesCard';
import LogoFooter from '../components/LandingPage/LogoFooter';
import VendorInfoSection from '../components/LandingPage/VendorInfoSection';

const { Text } = Typography;

const LandingPage = () => (
    <>
        <Row justify="space-between" align="middle" className="pb-6">
            <Text className="text-xl font-medium">Vendor Payouts</Text>
        </Row>
        <Row className="flex flex-col md:flex-row">
            <Col xl={11} sm={24} className="mb-4 md:mb-0">
                <VendorInfoSection />
            </Col>
            <Col xl={13} sm={24}>
                <FeaturesCard />
            </Col>
        </Row>
        <Row justify="center" align="middle" className="w-full mt-8">
            <LogoFooter />
        </Row>
    </>
);

export default LandingPage;
